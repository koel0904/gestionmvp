import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import localRepository from "../repositories/local.js";
import authenticateToken from "../middleware/middleware.js";
import requireActiveLocal from "../middleware/requireActiveLocal.js";
import requirePermission from "../middleware/requirePermission.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for vehicle images
const vehiculoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/vehiculos"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `veh-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const uploadVehiculo = multer({
  storage: vehiculoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

const router = express.Router();

// GET /api/locales - Returns locales linked to the authenticated user
router.get("/locales", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType || "user";
    const locales = await localRepository.getUserLocales(userId, userType);
    res.json({ locales });
  } catch (err) {
    console.error("Error fetching user locales:", err);
    res.status(500).json({ error: "Error fetching user locales" });
  }
});

// POST /api/locales - Create a new local (owner only)
router.post("/locales", authenticateToken, async (req, res) => {
  try {
    const userType = req.user.userType;
    if (userType !== "owner") {
      return res
        .status(403)
        .json({ error: "Solo los owners pueden crear locales" });
    }

    const ownerId = req.user.userId;
    const { name, address, phone, email } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "El nombre del local es obligatorio" });
    }

    const local = await localRepository.createLocal(ownerId, {
      name: name.trim(),
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
    });

    res.json({ message: "Local creado con éxito", local });
  } catch (err) {
    console.error("Error creating local:", err);
    res.status(500).json({ error: "Error creando el local" });
  }
});

// PUT /api/locales/:id - Update a local's info (owner only)
router.put("/locales/:id", authenticateToken, async (req, res) => {
  try {
    const userType = req.user.userType;
    if (userType !== "owner") {
      return res
        .status(403)
        .json({ error: "Solo los owners pueden editar locales" });
    }

    const { id } = req.params;
    const { name, address, phone, email, active } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "El nombre del local es obligatorio" });
    }

    const updateData = {
      name: name.trim(),
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
    };
    if (active !== undefined) updateData.active = active;

    const local = await localRepository.updateLocal(id, updateData);

    res.json({ message: "Local actualizado con éxito", local });
  } catch (err) {
    console.error("Error updating local:", err);
    res.status(500).json({ error: "Error actualizando el local" });
  }
});

// GET /api/locales/:id/stats - Returns stats for a specific local
router.get("/locales/:id/stats", authenticateToken, async (req, res) => {
  try {
    const localId = req.params.id;
    // Basic authorization check could go here: ensure user has access to localId
    const stats = await localRepository.getLocalStats(localId);
    res.json({ stats });
  } catch (err) {
    console.error("Error fetching local stats:", err);
    res.status(500).json({ error: "Error fetching local stats" });
  }
});

// GET /api/locales/:id/proveedores
router.get(
  "/locales/:id/proveedores",
  authenticateToken,
  requirePermission("proveedores", "view"),
  async (req, res) => {
    try {
      const proveedores = await localRepository.getProveedores(req.params.id);
      res.json(proveedores);
    } catch (err) {
      res.status(500).json({ error: "Error fetching proveedores" });
    }
  },
);

// GET /api/locales/:id/inventario
router.get(
  "/locales/:id/inventario",
  authenticateToken,
  requirePermission("inventario", "view"),
  async (req, res) => {
    try {
      const inventario = await localRepository.getInventario(req.params.id);
      res.json(inventario);
    } catch (err) {
      res.status(500).json({ error: "Error fetching inventario" });
    }
  },
);

// GET /api/locales/:id/clientes
router.get(
  "/locales/:id/clientes",
  authenticateToken,
  requirePermission("clientes", "view"),
  async (req, res) => {
    try {
      const clientes = await localRepository.getClientes(req.params.id);
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ error: "Error fetching clientes" });
    }
  },
);

// GET /api/locales/:id/ventas
router.get(
  "/locales/:id/ventas",
  authenticateToken,
  requirePermission("ventas", "view"),
  async (req, res) => {
    try {
      const ventas = await localRepository.getVentas(req.params.id);
      res.json(ventas);
    } catch (err) {
      res.status(500).json({ error: "Error fetching ventas" });
    }
  },
);

// GET /api/locales/:id/vehiculos
router.get(
  "/locales/:id/vehiculos",
  authenticateToken,
  requirePermission("vehiculos", "view"),
  async (req, res) => {
    try {
      const vehiculos = await localRepository.getVehiculos(req.params.id);
      res.json(vehiculos);
    } catch (err) {
      res.status(500).json({ error: "Error fetching vehiculos" });
    }
  },
);

// GET /api/locales/:id/usuarios
router.get(
  "/locales/:id/usuarios",
  authenticateToken,
  requirePermission("usuarios", "view"),
  async (req, res) => {
    try {
      const usuarios = await localRepository.getUsuarios(req.params.id);
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: "Error fetching usuarios" });
    }
  },
);

// ==== CREATE ROUTES ====

router.post(
  "/locales/:id/usuarios",
  authenticateToken,
  requireActiveLocal,
  requirePermission("usuarios", "add"),
  async (req, res) => {
    try {
      const usuario = await localRepository.createUsuario(req.params.id, {
        ...req.body,
        ownerId: req.user.userId,
      });
      res.json({ message: "Usuario creado con éxito", usuario });
    } catch (err) {
      if (err.code === "P2002")
        return res.status(400).json({ error: "Email already exists" });
      res.status(500).json({ error: "Error creating usuario" });
    }
  },
);

// PUT /api/locales/:localId/usuarios/:id - Update a user
router.put(
  "/locales/:localId/usuarios/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("usuarios", "edit"),
  async (req, res) => {
    try {
      const updated = await localRepository.updateUsuario(
        req.params.id,
        req.body,
      );
      res.json({ message: "Usuario actualizado", usuario: updated });
    } catch (err) {
      if (err.code === "P2002")
        return res.status(400).json({ error: "Ese email ya está en uso" });
      console.error("Error updating usuario:", err);
      res.status(500).json({ error: "Error updating usuario" });
    }
  },
);

// PUT /api/locales/:localId/usuarios/:id/permissions - Update permissions (owner only)
router.put(
  "/locales/:localId/usuarios/:id/permissions",
  authenticateToken,
  requireActiveLocal,
  async (req, res) => {
    try {
      if (req.user.userType !== "owner") {
        return res
          .status(403)
          .json({ error: "Solo los owners pueden cambiar permisos" });
      }

      const { permissions } = req.body;
      if (!permissions || typeof permissions !== "object") {
        return res.status(400).json({ error: "Formato de permisos inválido" });
      }

      // Check if user actually belongs to this local
      const dbUser = await prisma.user.findFirst({
        where: { id: req.params.id, localId: req.params.localId },
      });

      if (!dbUser) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado en este local" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { permissions },
      });

      res.json({
        message: "Permisos actualizados",
        permissions: updatedUser.permissions,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error actualizando permisos" });
    }
  },
);

router.post(
  "/locales/:id/proveedores",
  authenticateToken,
  requireActiveLocal,
  requirePermission("proveedores", "add"),
  async (req, res) => {
    try {
      const proveedor = await localRepository.createProveedor(
        req.params.id,
        req.body,
      );
      res.json({ message: "Proveedor creado con éxito", proveedor });
    } catch (err) {
      res.status(500).json({ error: "Error creating proveedor" });
    }
  },
);

router.put(
  "/locales/:localId/proveedores/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("proveedores", "edit"),
  async (req, res) => {
    try {
      const proveedor = await localRepository.updateProveedor(
        req.params.id,
        req.body,
      );
      res.json({ message: "Proveedor actualizado con éxito", proveedor });
    } catch (err) {
      res.status(500).json({ error: "Error updating proveedor" });
    }
  },
);

router.post(
  "/locales/:id/inventario",
  authenticateToken,
  requireActiveLocal,
  requirePermission("inventario", "add"),
  async (req, res) => {
    try {
      const item = await localRepository.createInventario(
        req.params.id,
        req.body,
      );
      res.json({ message: "Producto creado con éxito", item });
    } catch (err) {
      res.status(500).json({ error: "Error creating inventario item" });
    }
  },
);

router.put(
  "/locales/:localId/inventario/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("inventario", "edit"),
  async (req, res) => {
    try {
      const item = await localRepository.updateInventario(
        req.params.id,
        req.body,
      );
      res.json({ message: "Producto actualizado con éxito", item });
    } catch (err) {
      res.status(500).json({ error: "Error updating inventario item" });
    }
  },
);

router.post(
  "/locales/:id/clientes",
  authenticateToken,
  requireActiveLocal,
  requirePermission("clientes", "add"),
  async (req, res) => {
    try {
      const cliente = await localRepository.createCliente(
        req.params.id,
        req.body,
      );
      res.json({ message: "Cliente creado con éxito", cliente });
    } catch (err) {
      res.status(500).json({ error: "Error creating cliente" });
    }
  },
);

router.put(
  "/locales/:localId/clientes/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("clientes", "edit"),
  async (req, res) => {
    try {
      const cliente = await localRepository.updateCliente(
        req.params.id,
        req.body,
      );
      res.json({ message: "Cliente actualizado con éxito", cliente });
    } catch (err) {
      res.status(500).json({ error: "Error updating cliente" });
    }
  },
);

router.post(
  "/locales/:id/ventas",
  authenticateToken,
  requireActiveLocal,
  requirePermission("ventas", "add"),
  async (req, res) => {
    try {
      const venta = await localRepository.createVenta(req.params.id, req.body);
      res.json({ message: "Venta registrada con éxito", venta });
    } catch (err) {
      res.status(500).json({ error: "Error creating venta" });
    }
  },
);

router.put(
  "/locales/:localId/ventas/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("ventas", "edit"),
  async (req, res) => {
    try {
      const venta = await localRepository.updateVenta(req.params.id, req.body);
      res.json({ message: "Venta actualizada con éxito", venta });
    } catch (err) {
      if (err.message === "Inventario item not found") {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Error updating venta" });
    }
  },
);

// ==== DELETE ROUTES ====

router.delete(
  "/locales/:localId/proveedores/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("proveedores", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteProveedor(req.params.id);
      res.json({ message: "Proveedor eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting proveedor" });
    }
  },
);

router.delete(
  "/locales/:localId/usuarios/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("usuarios", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteUsuario(req.params.id);
      res.json({ message: "Usuario eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting usuario" });
    }
  },
);

router.delete(
  "/locales/:localId/inventario/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("inventario", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteInventario(req.params.id);
      res.json({ message: "Item eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting inventario item" });
    }
  },
);

router.delete(
  "/locales/:localId/clientes/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("clientes", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteCliente(req.params.id);
      res.json({ message: "Cliente eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting cliente" });
    }
  },
);

router.delete(
  "/locales/:localId/ventas/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("ventas", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteVenta(req.params.id);
      res.json({ message: "Venta eliminada con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting venta" });
    }
  },
);

// ==== VEHICULOS ROUTES ====

// Upload vehicle image
router.post(
  "/locales/:id/vehiculos/upload",
  authenticateToken,
  requireActiveLocal,
  requirePermission("vehiculos", "add"), // upload falls under add/edit rights (handled primarily inside forms)
  uploadVehiculo.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }
    const imageUrl = `/uploads/vehiculos/${req.file.filename}`;
    res.json({ imageUrl });
  },
);

router.get("/locales/:id/vehiculos", authenticateToken, async (req, res) => {
  try {
    const vehiculos = await localRepository.getVehiculos(req.params.id);
    res.json(vehiculos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching vehiculos" });
  }
});

router.post(
  "/locales/:id/vehiculos",
  authenticateToken,
  requireActiveLocal,
  requirePermission("vehiculos", "add"),
  async (req, res) => {
    try {
      const vehiculo = await localRepository.createVehiculo(
        req.params.id,
        req.body,
      );
      res.json({ message: "Vehículo creado con éxito", vehiculo });
    } catch (err) {
      console.error("Error creating vehiculo:", err);
      res.status(500).json({ error: "Error creating vehiculo" });
    }
  },
);

router.put(
  "/locales/:localId/vehiculos/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("vehiculos", "edit"),
  async (req, res) => {
    try {
      const vehiculo = await localRepository.updateVehiculo(
        req.params.id,
        req.body,
      );
      res.json({ message: "Vehículo actualizado con éxito", vehiculo });
    } catch (err) {
      console.error("Error updating vehiculo:", err);
      res.status(500).json({ error: "Error updating vehiculo" });
    }
  },
);

router.delete(
  "/locales/:localId/vehiculos/:id",
  authenticateToken,
  requireActiveLocal,
  requirePermission("vehiculos", "delete"),
  async (req, res) => {
    try {
      await localRepository.deleteVehiculo(req.params.id);
      res.json({ message: "Vehículo eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting vehiculo" });
    }
  },
);

// ==========================================
// ANUNCIOS / FORO
// ==========================================

// Obtener anuncios
router.get(
  "/locales/:id/anuncios",
  authenticateToken,
  requireActiveLocal,
  async (req, res) => {
    try {
      const anuncios = await localRepository.getAnuncios(req.params.id);
      res.json(anuncios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetch anuncios" });
    }
  },
);

// Crear anuncio
router.post(
  "/locales/:id/anuncios",
  authenticateToken,
  requireActiveLocal,
  async (req, res) => {
    try {
      if (req.user.userType !== "owner") {
        return res.status(403).json({ error: "Solo dueños" });
      }
      const newAnuncio = await localRepository.createAnuncio(
        req.params.id,
        req.user.userId,
        req.body,
      );
      res.json(newAnuncio);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error post anuncio" });
    }
  },
);

// Borrar anuncio
router.delete(
  "/locales/:localId/anuncios/:id",
  authenticateToken,
  requireActiveLocal,
  async (req, res) => {
    try {
      if (req.user.userType !== "owner") {
        return res.status(403).json({ error: "Solo dueños" });
      }
      await localRepository.deleteAnuncio(req.params.id);
      res.json({ message: "Anuncio borrado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error delete anuncio" });
    }
  },
);

// Pin anuncio
router.patch(
  "/locales/:localId/anuncios/:id/pin",
  authenticateToken,
  requireActiveLocal,
  async (req, res) => {
    try {
      if (req.user.userType !== "owner") {
        return res.status(403).json({ error: "Solo dueños" });
      }
      const updated = await localRepository.togglePinAnuncio(req.params.id);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error pin anuncio" });
    }
  },
);

export default router;
