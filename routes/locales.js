import express from "express";
import localRepository from "../repositories/local.js";
import authenticateToken from "../middleware/middleware.js";

const router = express.Router();

// GET /api/locales - Returns locales linked to the authenticated user
router.get("/locales", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const locales = await localRepository.getUserLocales(userId);
    res.json({ locales });
  } catch (err) {
    console.error("Error fetching user locales:", err);
    res.status(500).json({ error: "Error fetching user locales" });
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
router.get("/locales/:id/proveedores", authenticateToken, async (req, res) => {
  try {
    const proveedores = await localRepository.getProveedores(req.params.id);
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: "Error fetching proveedores" });
  }
});

// GET /api/locales/:id/inventario
router.get("/locales/:id/inventario", authenticateToken, async (req, res) => {
  try {
    const inventario = await localRepository.getInventario(req.params.id);
    res.json(inventario);
  } catch (err) {
    res.status(500).json({ error: "Error fetching inventario" });
  }
});

// GET /api/locales/:id/clientes
router.get("/locales/:id/clientes", authenticateToken, async (req, res) => {
  try {
    const clientes = await localRepository.getClientes(req.params.id);
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching clientes" });
  }
});

// GET /api/locales/:id/ventas
router.get("/locales/:id/ventas", authenticateToken, async (req, res) => {
  try {
    const ventas = await localRepository.getVentas(req.params.id);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ventas" });
  }
});

// GET /api/locales/:id/usuarios
router.get("/locales/:id/usuarios", authenticateToken, async (req, res) => {
  try {
    const usuarios = await localRepository.getUsuarios(req.params.id);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error fetching usuarios" });
  }
});

// ==== CREATE ROUTES ====

router.post("/locales/:id/usuarios", authenticateToken, async (req, res) => {
  try {
    const usuario = await localRepository.createUsuario(
      req.params.id,
      req.body,
    );
    // Don't send back password
    const safeUser = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      phone: usuario.phone,
    };
    res.json({ message: "Usuario creado con éxito", usuario: safeUser });
  } catch (err) {
    if (err.code === "P2002")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: "Error creating usuario" });
  }
});

router.post("/locales/:id/proveedores", authenticateToken, async (req, res) => {
  try {
    const proveedor = await localRepository.createProveedor(
      req.params.id,
      req.body,
    );
    res.json({ message: "Proveedor creado con éxito", proveedor });
  } catch (err) {
    res.status(500).json({ error: "Error creating proveedor" });
  }
});

router.put("/locales/:localId/proveedores/:id", authenticateToken, async (req, res) => {
  try {
    const proveedor = await localRepository.updateProveedor(
      req.params.id,
      req.body,
    );
    res.json({ message: "Proveedor actualizado con éxito", proveedor });
  } catch (err) {
    res.status(500).json({ error: "Error updating proveedor" });
  }
});

router.post("/locales/:id/inventario", authenticateToken, async (req, res) => {
  try {
    const item = await localRepository.createInventario(
      req.params.id,
      req.body,
    );
    res.json({ message: "Producto creado con éxito", item });
  } catch (err) {
    res.status(500).json({ error: "Error creating inventario item" });
  }
});

router.post("/locales/:id/clientes", authenticateToken, async (req, res) => {
  try {
    const cliente = await localRepository.createCliente(
      req.params.id,
      req.body,
    );
    res.json({ message: "Cliente creado con éxito", cliente });
  } catch (err) {
    res.status(500).json({ error: "Error creating cliente" });
  }
});

router.post("/locales/:id/ventas", authenticateToken, async (req, res) => {
  try {
    const venta = await localRepository.createVenta(req.params.id, req.body);
    res.json({ message: "Venta registrada con éxito", venta });
  } catch (err) {
    res.status(500).json({ error: "Error creating venta" });
  }
});

router.put("/locales/:localId/ventas/:id", authenticateToken, async (req, res) => {
  try {
    const venta = await localRepository.updateVenta(req.params.id, req.body);
    res.json({ message: "Venta actualizada con éxito", venta });
  } catch (err) {
    if (err.message === "Inventario item not found") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Error updating venta" });
  }
});

export default router;
