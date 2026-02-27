import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class localRepository {
  // Method to get all locales linked to a user
  static async getUserLocales(userId) {
    const locales = await prisma.local.findMany({
      where: {
        users: { some: { id: userId } },
      },
    });

    // Defaulting role to "admin" for now since we updated all users
    return locales.map((local) => ({
      ...local,
      role: "admin",
    }));
  }

  // Method to get stats for a specific local
  static async getLocalStats(localId) {
    // 1. Total Revenue (sum(total) from Ventas)
    const revenueResult = await prisma.ventas.aggregate({
      where: { localId: parseInt(localId, 10) },
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    // 2. Orders Count (count from Ventas)
    const ordersCount = await prisma.ventas.count({
      where: { localId: parseInt(localId, 10) },
    });

    // 3. Customers Count (count from Clientes)
    const customersCount = await prisma.clientes.count({
      where: { localId: parseInt(localId, 10) },
    });

    // 4. Products Count (count from Inventario)
    const productsCount = await prisma.inventario.count({
      where: { localId: parseInt(localId, 10) },
    });

    return {
      revenue: totalRevenue,
      orders: ordersCount,
      customers: customersCount,
      products: productsCount,
    };
  }

  // Method to get Proveedores for a local
  static async getProveedores(localId) {
    return prisma.proveedores.findMany({
      where: { localId: parseInt(localId, 10) },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Inventario for a local (includes Proveedor relation)
  static async getInventario(localId) {
    return prisma.inventario.findMany({
      where: { localId: parseInt(localId, 10) },
      include: {
        proveedor: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Clientes for a local
  static async getClientes(localId) {
    return prisma.clientes.findMany({
      where: { localId: parseInt(localId, 10) },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Ventas for a local (includes Cliente and items)
  static async getVentas(localId) {
    return prisma.ventas.findMany({
      where: { localId: parseInt(localId, 10) },
      include: {
        cliente: { select: { name: true, email: true } },
      },
      orderBy: { fecha: "desc" },
    });
  }

  // Method to get Users for a local
  static async getUsuarios(localId) {
    return prisma.user.findMany({
      where: { localId: parseInt(localId, 10) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });
  }

  // == CREATION METHODS ==

  static async createProveedor(localId, data) {
    return prisma.proveedores.create({
      data: {
        ...data,
        localId: parseInt(localId, 10),
      },
    });
  }

  static async updateProveedor(id, data) {
    return prisma.proveedores.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  static async createUsuario(localId, data) {
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || "user",
        password: hashedPassword,
        localId: parseInt(localId, 10),
      },
    });
  }

  static async createInventario(localId, data) {
    return prisma.inventario.create({
      data: {
        ...data,
        proveedorId: parseInt(data.proveedorId, 10),
        precio_compra: parseFloat(data.precio_compra),
        precio_venta: parseFloat(data.precio_venta),
        stock: parseInt(data.stock, 10),
        localId: parseInt(localId, 10),
      },
    });
  }

  static async updateInventario(id, data) {
    return prisma.inventario.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: data.name,
        precio_compra: parseFloat(data.precio_compra),
        precio_venta: parseFloat(data.precio_venta),
        stock: parseInt(data.stock, 10),
      },
      include: {
        proveedor: { select: { name: true } },
      },
    });
  }

  static async createCliente(localId, data) {
    return prisma.clientes.create({
      data: {
        ...data,
        localId: parseInt(localId, 10),
      },
    });
  }

  static async updateCliente(id, data) {
    return prisma.clientes.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  static async createVenta(localId, data) {
    // Need to fetch price dynamically to secure it, but for UI sake trust payload for now or re-fetch.
    return prisma.ventas.create({
      data: {
        cantidad: parseInt(data.cantidad, 10),
        precio_venta: parseFloat(data.precio_venta),
        total: parseFloat(data.total),
        fecha: new Date(),
        clienteId: parseInt(data.clienteId, 10),
        inventarioId: parseInt(data.inventarioId, 10),
        localId: parseInt(localId, 10),
      },
    });
  }

  static async updateVenta(id, data) {
    // We only update cantidad, precio is pulled from inventario item.
    // Ensure we have an inventario ID to get price from
    const invId = parseInt(data.inventarioId, 10);
    const item = await prisma.inventario.findUnique({ where: { id: invId } });

    if (!item) throw new Error("Inventario item not found");

    const qty = parseInt(data.cantidad, 10);

    return prisma.ventas.update({
      where: { id: parseInt(id, 10) },
      data: {
        cantidad: qty,
        precio_venta: item.precio_venta,
        total: qty * item.precio_venta,
        clienteId: parseInt(data.clienteId, 10),
        inventarioId: invId,
      },
      include: {
        cliente: { select: { name: true, email: true } },
      },
    });
  }

  static async deleteProveedor(id) {
    const provId = parseInt(id, 10);
    // Find all inventory items for this provider
    const inventarioItems = await prisma.inventario.findMany({
      where: { proveedorId: provId },
      select: { id: true },
    });

    const invIds = inventarioItems.map((item) => item.id);

    // Delete all ventas associated with these inventory items
    if (invIds.length > 0) {
      await prisma.ventas.deleteMany({
        where: { inventarioId: { in: invIds } },
      });

      // Delete all inventory items for this provider
      await prisma.inventario.deleteMany({
        where: { proveedorId: provId },
      });
    }

    return prisma.proveedores.delete({
      where: { id: provId },
    });
  }

  static async deleteUsuario(id) {
    return prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  static async deleteInventario(id) {
    const invId = parseInt(id, 10);
    // Remove ventas that reference this inventory item first
    await prisma.ventas.deleteMany({
      where: { inventarioId: invId },
    });
    return prisma.inventario.delete({
      where: { id: invId },
    });
  }

  static async deleteCliente(id) {
    const clienteId = parseInt(id, 10);
    // Remove ventas that reference this client first
    await prisma.ventas.deleteMany({
      where: { clienteId: clienteId },
    });
    return prisma.clientes.delete({
      where: { id: clienteId },
    });
  }

  static async deleteVenta(id) {
    return prisma.ventas.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}

export default localRepository;
