import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class localRepository {
  // Method to get all locales linked to a user or owner
  static async getUserLocales(userId, userType = "user") {
    if (userType === "owner") {
      // Owner: find locales they own directly
      const locales = await prisma.local.findMany({
        where: { ownerId: userId },
      });
      return locales.map((local) => ({ ...local, role: "owner" }));
    }

    // Regular user: find locales they're assigned to
    const userLocales = await prisma.local.findMany({
      where: {
        users: { some: { id: userId } },
      },
    });
    return userLocales.map((local) => ({ ...local, role: "user" }));
  }

  // Method to get stats for a specific local
  static async getLocalStats(localId) {
    const revenueResult = await prisma.ventas.aggregate({
      where: { localId },
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    const ordersCount = await prisma.ventas.count({
      where: { localId },
    });

    const customersCount = await prisma.clientes.count({
      where: { localId },
    });

    const productsCount = await prisma.inventario.count({
      where: { localId },
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
      where: { localId },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Inventario for a local (includes Proveedor relation)
  static async getInventario(localId) {
    return prisma.inventario.findMany({
      where: { localId },
      include: {
        proveedor: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Clientes for a local
  static async getClientes(localId) {
    return prisma.clientes.findMany({
      where: { localId },
      orderBy: { name: "asc" },
    });
  }

  // Method to get Ventas for a local (includes Cliente and items)
  static async getVentas(localId) {
    return prisma.ventas.findMany({
      where: { localId },
      include: {
        cliente: { select: { name: true, email: true } },
        inventario: { select: { name: true, precio_venta: true } },
      },
      orderBy: { fecha: "desc" },
    });
  }

  // Method to get Users for a local
  static async getUsuarios(localId) {
    return prisma.user.findMany({
      where: { localId },
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

  static async createLocal(ownerId, data) {
    return prisma.local.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        ownerId,
      },
    });
  }

  static async createProveedor(localId, data) {
    return prisma.proveedores.create({
      data: {
        ...data,
        localId,
      },
    });
  }

  static async updateProveedor(id, data) {
    return prisma.proveedores.update({
      where: { id },
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
        localId,
        ownerId: data.ownerId,
      },
    });
  }

  static async updateUsuario(id, data) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });
  }

  static async createInventario(localId, data) {
    return prisma.inventario.create({
      data: {
        ...data,
        proveedorId: data.proveedorId,
        precio_compra: parseFloat(data.precio_compra),
        precio_venta: parseFloat(data.precio_venta),
        stock: parseInt(data.stock, 10),
        localId,
      },
    });
  }

  static async updateInventario(id, data) {
    return prisma.inventario.update({
      where: { id },
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
        localId,
      },
    });
  }

  static async updateCliente(id, data) {
    return prisma.clientes.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  static async createVenta(localId, data) {
    return prisma.ventas.create({
      data: {
        cantidad: parseInt(data.cantidad, 10),
        precio_venta: parseFloat(data.precio_venta),
        total: parseFloat(data.total),
        fecha: new Date(),
        clienteId: data.clienteId,
        inventarioId: data.inventarioId,
        localId,
      },
    });
  }

  static async updateVenta(id, data) {
    const invId = data.inventarioId;
    const item = await prisma.inventario.findUnique({ where: { id: invId } });

    if (!item) throw new Error("Inventario item not found");

    const qty = parseInt(data.cantidad, 10);

    return prisma.ventas.update({
      where: { id },
      data: {
        cantidad: qty,
        precio_venta: item.precio_venta,
        total: qty * item.precio_venta,
        clienteId: data.clienteId,
        inventarioId: invId,
      },
      include: {
        cliente: { select: { name: true, email: true } },
      },
    });
  }

  static async deleteProveedor(id) {
    const inventarioItems = await prisma.inventario.findMany({
      where: { proveedorId: id },
      select: { id: true },
    });

    const invIds = inventarioItems.map((item) => item.id);

    if (invIds.length > 0) {
      await prisma.ventas.deleteMany({
        where: { inventarioId: { in: invIds } },
      });

      await prisma.inventario.deleteMany({
        where: { proveedorId: id },
      });
    }

    return prisma.proveedores.delete({
      where: { id },
    });
  }

  static async deleteUsuario(id) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async deleteInventario(id) {
    await prisma.ventas.deleteMany({
      where: { inventarioId: id },
    });
    return prisma.inventario.delete({
      where: { id },
    });
  }

  static async deleteCliente(id) {
    await prisma.ventas.deleteMany({
      where: { clienteId: id },
    });
    return prisma.clientes.delete({
      where: { id },
    });
  }

  static async deleteVenta(id) {
    return prisma.ventas.delete({
      where: { id },
    });
  }
}

export default localRepository;
