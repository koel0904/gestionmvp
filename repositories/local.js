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

  // Method to get Ventas for a local (items is a JSON column, auto-returned)
  static async getVentas(localId) {
    return prisma.ventas.findMany({
      where: { localId },
      include: {
        cliente: { select: { name: true, email: true } },
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
        position: true,
        active: true,
        createdAt: true,
        permissions: true,
        local: { select: { name: true } },
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

  static async updateLocal(id, data) {
    const updateData = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
    };
    if (data.active !== undefined) updateData.active = data.active;

    return prisma.local.update({
      where: { id },
      data: updateData,
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
        position: data.position || null,
        password: hashedPassword,
        localId,
        ownerId: data.ownerId,
      },
    });
  }

  static async updateUsuario(id, data) {
    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    if (data.position !== undefined)
      updateData.position = data.position || null;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.localId !== undefined) updateData.localId = data.localId || null;

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        position: true,
        active: true,
        createdAt: true,
        permissions: true,
        local: { select: { name: true } },
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
    const updateData = {
      name: data.name,
      precio_compra: parseFloat(data.precio_compra),
      precio_venta: parseFloat(data.precio_venta),
      stock: parseInt(data.stock, 10),
    };
    if (data.maxStock !== undefined)
      updateData.maxStock = parseInt(data.maxStock, 10);
    if (data.proveedorId) updateData.proveedorId = data.proveedorId;
    if (data.estado !== undefined) updateData.estado = data.estado;

    return prisma.inventario.update({
      where: { id },
      data: updateData,
      include: {
        proveedor: { select: { name: true } },
      },
    });
  }

  static async createCliente(localId, data) {
    return prisma.clientes.create({
      data: {
        ...data,
        direccion: data.direccion || null,
        localId,
      },
    });
  }

  static async updateCliente(id, data) {
    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    if (data.direccion !== undefined)
      updateData.direccion = data.direccion || null;

    return prisma.clientes.update({
      where: { id },
      data: updateData,
    });
  }

  static async createVenta(localId, data) {
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.inventarioId) {
          await prisma.inventario.update({
            where: { id: item.inventarioId },
            data: { stock: { decrement: parseInt(item.cantidad) || 0 } },
          });
        }
      }
    }

    return prisma.ventas.create({
      data: {
        total: parseFloat(data.total),
        items: data.items,
        fecha: new Date(),
        clienteId: data.clienteId,
        localId,
      },
    });
  }

  static async updateVenta(id, data) {
    const oldVenta = await prisma.ventas.findUnique({ where: { id } });
    if (oldVenta && Array.isArray(oldVenta.items)) {
      for (const item of oldVenta.items) {
        if (item.inventarioId) {
          await prisma.inventario.update({
            where: { id: item.inventarioId },
            data: { stock: { increment: parseInt(item.cantidad) || 0 } },
          });
        }
      }
    }

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.inventarioId) {
          await prisma.inventario.update({
            where: { id: item.inventarioId },
            data: { stock: { decrement: parseInt(item.cantidad) || 0 } },
          });
        }
      }
    }

    return prisma.ventas.update({
      where: { id },
      data: {
        total: parseFloat(data.total),
        items: data.items,
        clienteId: data.clienteId,
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

    if (inventarioItems.length > 0) {
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
    const venta = await prisma.ventas.findUnique({ where: { id } });
    if (venta && Array.isArray(venta.items)) {
      for (const item of venta.items) {
        if (item.inventarioId) {
          await prisma.inventario.update({
            where: { id: item.inventarioId },
            data: { stock: { increment: parseInt(item.cantidad) || 0 } },
          });
        }
      }
    }

    return prisma.ventas.delete({
      where: { id },
    });
  }

  // == VEHICULOS ==

  static async getVehiculos(localId) {
    return prisma.vehiculos.findMany({
      where: { localId },
      include: {
        encargados: {
          select: { id: true, name: true },
        },
      },
      orderBy: { marca: "asc" },
    });
  }

  static async createVehiculo(localId, data) {
    return prisma.vehiculos.create({
      data: {
        carName: data.carName || null,
        marca: data.marca,
        modelo: data.modelo,
        year: data.year,
        tipo: data.tipo,
        ultimoMantenimientoFecha: data.ultimoMantenimientoFecha || null,
        ultimoMantenimientoKm: data.ultimoMantenimientoKm || null,
        proximoMantenimientoFecha: data.proximoMantenimientoFecha || null,
        proximoMantenimientoKm: data.proximoMantenimientoKm || null,
        frecuenciaKm: data.frecuenciaKm || null,
        frecuenciaTiempo: data.frecuenciaTiempo || null,
        estado: data.estado !== undefined ? data.estado : true,
        imagen: data.imagen || null,
        localId,
        encargados: data.encargadoIds
          ? { connect: data.encargadoIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        encargados: { select: { id: true, name: true } },
      },
    });
  }

  static async updateVehiculo(id, data) {
    const updateData = {};
    if (data.carName !== undefined) updateData.carName = data.carName;
    if (data.marca !== undefined) updateData.marca = data.marca;
    if (data.modelo !== undefined) updateData.modelo = data.modelo;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.ultimoMantenimientoFecha !== undefined)
      updateData.ultimoMantenimientoFecha = data.ultimoMantenimientoFecha;
    if (data.ultimoMantenimientoKm !== undefined)
      updateData.ultimoMantenimientoKm = data.ultimoMantenimientoKm;
    if (data.proximoMantenimientoFecha !== undefined)
      updateData.proximoMantenimientoFecha = data.proximoMantenimientoFecha;
    if (data.proximoMantenimientoKm !== undefined)
      updateData.proximoMantenimientoKm = data.proximoMantenimientoKm;
    if (data.frecuenciaKm !== undefined)
      updateData.frecuenciaKm = data.frecuenciaKm;
    if (data.frecuenciaTiempo !== undefined)
      updateData.frecuenciaTiempo = data.frecuenciaTiempo;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.imagen !== undefined) updateData.imagen = data.imagen;
    if (data.encargadoIds !== undefined) {
      updateData.encargados = {
        set: data.encargadoIds.map((uid) => ({ id: uid })),
      };
    }

    return prisma.vehiculos.update({
      where: { id },
      data: updateData,
      include: {
        encargados: { select: { id: true, name: true } },
      },
    });
  }

  static async deleteVehiculo(id) {
    return prisma.vehiculos.delete({
      where: { id },
    });
  }

  // == FORO / ANUNCIOS ==
  static async getAnuncios(localId) {
    return prisma.anuncio.findMany({
      where: { localId },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
      orderBy: [{ isPinned: "desc" }, { fecha: "desc" }],
    });
  }

  static async createAnuncio(localId, authorId, data) {
    return prisma.anuncio.create({
      data: {
        content: data.content,
        type: data.type || "info",
        isPinned: data.isPinned || false,
        localId,
        authorId,
      },
    });
  }

  static async deleteAnuncio(id) {
    return prisma.anuncio.delete({
      where: { id },
    });
  }

  static async togglePinAnuncio(id) {
    const anuncio = await prisma.anuncio.findUnique({ where: { id } });
    if (!anuncio) return null;
    return prisma.anuncio.update({
      where: { id },
      data: { isPinned: !anuncio.isPinned },
    });
  }
}

export default localRepository;
