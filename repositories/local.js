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

  // Method to get stats for a specific local (with month-over-month trends)
  static async getLocalStats(localId) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Revenue & orders: this month vs last month
    const [revenueThis, revenueLast, ordersThis, ordersLast] =
      await Promise.all([
        prisma.ventas.aggregate({
          where: { localId, fecha: { gte: startOfThisMonth } },
          _sum: { total: true },
        }),
        prisma.ventas.aggregate({
          where: {
            localId,
            fecha: { gte: startOfLastMonth, lt: startOfThisMonth },
          },
          _sum: { total: true },
        }),
        prisma.ventas.count({
          where: { localId, fecha: { gte: startOfThisMonth } },
        }),
        prisma.ventas.count({
          where: {
            localId,
            fecha: { gte: startOfLastMonth, lt: startOfThisMonth },
          },
        }),
      ]);

    const totalRevenue =
      (await prisma.ventas.aggregate({
        where: { localId },
        _sum: { total: true },
      }))._sum.total || 0;

    const totalOrders = await prisma.ventas.count({ where: { localId } });

    const customersCount = await prisma.clientes.count({
      where: { localId },
    });

    const productsCount = await prisma.inventario.count({
      where: { localId },
    });

    const lowStockCount = await prisma.inventario.count({
      where: {
        localId,
        stock: { lte: 5 },
        estado: true,
      },
    });

    const pendingTasks = await prisma.tarea.count({
      where: { localId, status: "Sin realizar" },
    });

    // Calculate percentage changes
    const revThisVal = revenueThis._sum.total || 0;
    const revLastVal = revenueLast._sum.total || 0;
    const revenueChange = revLastVal > 0
      ? (((revThisVal - revLastVal) / revLastVal) * 100).toFixed(1)
      : revThisVal > 0 ? "100.0" : "0.0";

    const ordersChange = ordersLast > 0
      ? (((ordersThis - ordersLast) / ordersLast) * 100).toFixed(1)
      : ordersThis > 0 ? "100.0" : "0.0";

    return {
      revenue: totalRevenue,
      revenueChange: parseFloat(revenueChange),
      orders: totalOrders,
      ordersChange: parseFloat(ordersChange),
      customers: customersCount,
      products: productsCount,
      lowStockCount,
      pendingTasks,
    };
  }

  static async countVentasByCliente(clienteId) {
    return prisma.ventas.count({
      where: { clienteId },
    });
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
        proveedorId: data.proveedorId || null,
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
    if (data.proveedorId !== undefined) 
      updateData.proveedorId = data.proveedorId || null;
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
    await prisma.ventas.updateMany({
      where: { clienteId: id },
      data: { clienteId: null },
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
        imageUrl: data.imageUrl || null,
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

  // Full analytics data for the Analytics page
  static async getLocalAnalytics(localId) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    // ── KPI stats with trends ──
    const [revenueThis, revenueLast, ordersThis, ordersLast] =
      await Promise.all([
        prisma.ventas.aggregate({
          where: { localId, fecha: { gte: startOfThisMonth } },
          _sum: { total: true },
        }),
        prisma.ventas.aggregate({
          where: {
            localId,
            fecha: { gte: startOfLastMonth, lt: startOfThisMonth },
          },
          _sum: { total: true },
        }),
        prisma.ventas.count({
          where: { localId, fecha: { gte: startOfThisMonth } },
        }),
        prisma.ventas.count({
          where: {
            localId,
            fecha: { gte: startOfLastMonth, lt: startOfThisMonth },
          },
        }),
      ]);

    const totalRevenue =
      (
        await prisma.ventas.aggregate({
          where: { localId },
          _sum: { total: true },
        })
      )._sum.total || 0;

    const totalOrders = await prisma.ventas.count({ where: { localId } });

    const customersCount = await prisma.clientes.count({
      where: { localId },
    });

    const revThisVal = revenueThis._sum.total || 0;
    const revLastVal = revenueLast._sum.total || 0;

    const pctChange = (cur, prev) => {
      if (prev > 0) return parseFloat((((cur - prev) / prev) * 100).toFixed(1));
      return cur > 0 ? 100.0 : 0.0;
    };

    const avgOrderValue =
      totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0;
    // Avg this month vs last month
    const avgThis =
      ordersThis > 0 ? revThisVal / ordersThis : 0;
    const avgLast =
      ordersLast > 0 ? revLastVal / ordersLast : 0;

    const kpis = {
      revenue: totalRevenue,
      revenueChange: pctChange(revThisVal, revLastVal),
      orders: totalOrders,
      ordersChange: pctChange(ordersThis, ordersLast),
      customers: customersCount,
      avgOrderValue,
      avgOrderValueChange: pctChange(avgThis, avgLast),
    };

    // ── Revenue by month (last 6 months) ──
    const monthLabels = [];
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      monthLabels.push(
        mStart.toLocaleString("en", { month: "short" }),
      );
      const agg = await prisma.ventas.aggregate({
        where: { localId, fecha: { gte: mStart, lt: mEnd } },
        _sum: { total: true },
      });
      revenueByMonth.push(agg._sum.total || 0);
    }

    // ── Orders by day (last 7 days) ──
    const dayLabels = [];
    const ordersByDay = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i,
      );
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayName = dayStart.toLocaleString("en", { weekday: "short" });
      dayLabels.push(dayName);
      const count = await prisma.ventas.count({
        where: { localId, fecha: { gte: dayStart, lt: dayEnd } },
      });
      ordersByDay.push(count);
    }

    // ── Top products (from Ventas JSON items) ──
    const allVentas = await prisma.ventas.findMany({
      where: { localId },
      select: { items: true },
    });

    const productMap = {};
    for (const venta of allVentas) {
      const items = Array.isArray(venta.items) ? venta.items : [];
      for (const item of items) {
        const name = item.nombre || "Sin nombre";
        if (!productMap[name]) {
          productMap[name] = { sold: 0, revenue: 0 };
        }
        productMap[name].sold += parseInt(item.cantidad) || 0;
        productMap[name].revenue += parseFloat(item.subtotal) || 0;
      }
    }

    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, data]) => [
        name,
        `${data.sold} uds`,
        `$${data.revenue.toFixed(2)}`,
      ]);

    // ── Top customers (by total spent) ──
    const customerSales = await prisma.ventas.groupBy({
      by: ["clienteId"],
      where: { localId, clienteId: { not: null } },
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    });

    const customerIds = customerSales.map((cs) => cs.clienteId);
    const customers =
      customerIds.length > 0
        ? await prisma.clientes.findMany({
            where: { id: { in: customerIds } },
            select: { id: true, name: true },
          })
        : [];
    const customerNameMap = Object.fromEntries(
      customers.map((c) => [c.id, c.name]),
    );

    const topCustomers = customerSales.map((cs) => [
      customerNameMap[cs.clienteId] || "Desconocido",
      `${cs._count.id} ventas`,
      `$${(cs._sum.total || 0).toFixed(2)}`,
    ]);

    // ── Recent activity feed (all timestamped sources) ──
    const [recentVentas, recentTareas, recentUsers, recentAnuncios, lowStockProducts] =
      await Promise.all([
        prisma.ventas.findMany({
          where: { localId },
          include: { cliente: { select: { name: true } } },
          orderBy: { fecha: "desc" },
          take: 10,
        }),
        prisma.tarea.findMany({
          where: { localId },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, title: true, status: true, createdAt: true },
        }),
        prisma.user.findMany({
          where: { localId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, createdAt: true },
        }),
        prisma.anuncio.findMany({
          where: { localId },
          orderBy: { fecha: "desc" },
          take: 5,
          select: { id: true, content: true, type: true, fecha: true },
        }),
        prisma.inventario.findMany({
          where: { localId, stock: { lte: 5 }, estado: true },
          select: { name: true, stock: true },
          take: 5,
        }),
      ]);

    const activity = [];

    for (const v of recentVentas) {
      const itemNames = Array.isArray(v.items)
        ? v.items.map((it) => it.nombre).filter(Boolean).join(", ")
        : "";
      activity.push({
        icon: "add_shopping_cart",
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-400/10",
        title: `Venta — $${Number(v.total).toFixed(2)}`,
        desc: v.cliente?.name
          ? `Cliente: ${v.cliente.name}${itemNames ? ` — ${itemNames}` : ""}`
          : itemNames || "Venta registrada",
        timestamp: v.fecha.toISOString(),
        badge: "Venta",
        badgeColor: "glass-badge-orange text-accent-orange",
      });
    }

    for (const t of recentTareas) {
      const statusIcon =
        t.status === "Realizada"
          ? "check_circle"
          : t.status === "En proceso"
            ? "pending"
            : t.status === "No se pudo completar"
              ? "cancel"
              : "task_alt";
      const statusColor =
        t.status === "Realizada"
          ? "text-emerald-400"
          : t.status === "En proceso"
            ? "text-amber-400"
            : t.status === "No se pudo completar"
              ? "text-red-400"
              : "text-blue-400";
      activity.push({
        icon: statusIcon,
        iconColor: statusColor,
        iconBg:
          t.status === "Realizada"
            ? "bg-emerald-400/10"
            : t.status === "En proceso"
              ? "bg-amber-400/10"
              : t.status === "No se pudo completar"
                ? "bg-red-400/10"
                : "bg-blue-400/10",
        title: `Tarea: ${t.title}`,
        desc: `Estado: ${t.status}`,
        timestamp: t.createdAt.toISOString(),
        badge: "Tarea",
        badgeColor: "glass-badge-purple text-primary-light",
      });
    }

    for (const u of recentUsers) {
      activity.push({
        icon: "person_add",
        iconColor: "text-primary-light",
        iconBg: "bg-primary/10",
        title: "Nuevo empleado registrado",
        desc: u.name,
        timestamp: u.createdAt.toISOString(),
        badge: "Equipo",
        badgeColor: "glass-badge-purple text-primary-light",
      });
    }

    for (const a of recentAnuncios) {
      activity.push({
        icon: "campaign",
        iconColor: "text-amber-400",
        iconBg: "bg-amber-400/10",
        title: "Anuncio publicado",
        desc:
          a.content.length > 60
            ? a.content.substring(0, 60) + "..."
            : a.content,
        timestamp: a.fecha.toISOString(),
        badge: "Foro",
        badgeColor: "bg-amber-500/20 border border-amber-400/20 text-amber-400",
      });
    }

    // Low stock alerts (pinned to now - they're current state, not events)
    for (const p of lowStockProducts) {
      activity.push({
        icon: "inventory",
        iconColor: "text-red-400",
        iconBg: "bg-red-400/10",
        title: "Stock bajo",
        desc: `${p.name} — ${p.stock} restantes`,
        timestamp: now.toISOString(),
        badge: "Alerta",
        badgeColor: "bg-red-500/20 border border-red-400/20 text-red-400",
      });
    }

    // Sort all by timestamp descending
    activity.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );

    // Assign sequential IDs and keep only latest 15
    const trimmedActivity = activity.slice(0, 15).map((ev, i) => ({
      ...ev,
      id: i + 1,
    }));

    return {
      kpis,
      revenueChart: monthLabels.map((label, i) => ({
        label,
        value: revenueByMonth[i],
      })),
      ordersChart: dayLabels.map((label, i) => ({
        label,
        value: ordersByDay[i],
      })),
      topProducts,
      topCustomers,
      activity: trimmedActivity,
    };
  }
}

export default localRepository;
