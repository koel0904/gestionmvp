import express from "express";
import TareaRepository from "../repositories/tarea.js";
import authenticateToken from "../middleware/middleware.js";
import requireActiveLocal from "../middleware/requireActiveLocal.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Helper interno para verificar si un usuario tiene permisos de admin
 */
const checkIsAdmin = async (user) => {
  if (user.userType === "owner") return true;

  // Si es "user", revisamos sus permisos actualizados
  const record = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { permissions: true }
  });
  if (record && record.permissions && record.permissions.admin === true) {
      return true;
  }
  return false;
};

// ==========================================
// Rutas de Tareas
// ==========================================

// Obtener Tareas
router.get("/locales/:id/tareas", authenticateToken, requireActiveLocal, async (req, res) => {
  try {
    const localId = req.params.id;
    const userId = req.user.userId;
    const userType = req.user.userType;
    
    let permissions = {};
    if (userType === "user") {
        const u = await prisma.user.findUnique({ where: { id: userId }, select: { permissions: true } });
        permissions = u.permissions || {};
    }

    const tareas = await TareaRepository.getTareas(localId, userId, userType, permissions);
    res.status(200).json({ tareas });
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener tareas" });
  }
});

// Crear Tarea (Solo Owner/Admin)
router.post("/locales/:id/tareas", authenticateToken, requireActiveLocal, async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user);
    if (!isAdmin) {
      return res.status(403).json({ error: "No tienes permisos para crear tareas" });
    }

    const localId = req.params.id;
    const { title, description, deadline, isPublic, assignedUserIds } = req.body;
    
    if (!title || !deadline || !assignedUserIds || !Array.isArray(assignedUserIds)) {
        return res.status(400).json({ error: "Datos incompletos para crear la tarea" });
    }

    const nuevaTarea = await TareaRepository.createTarea(
      { title, description, deadline, isPublic, assignedUserIds },
      localId,
      req.user.userId,
      req.user.userType
    );

    res.status(201).json({ tarea: nuevaTarea, message: "Tarea creada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al crear tarea" });
  }
});

// Actualizar estatus Tarea
router.patch("/locales/:id/tareas/:tareaId/status", authenticateToken, requireActiveLocal, async (req, res) => {
  try {
    const localId = req.params.id;
    const tareaId = req.params.tareaId;
    const userId = req.user.userId;
    const isAdmin = await checkIsAdmin(req.user);
    const { status, reason } = req.body;
    
    const validStatuses = ["Sin realizar", "En proceso", "Realizada", "No se pudo completar"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Estado no válido" });
    }

    if (!isAdmin) {
      // Si no es admin, verificamos que esté asignado a la tarea para poderla cambiar
      const assigned = await TareaRepository.isUserAssigned(tareaId, userId);
      if (!assigned) {
          return res.status(403).json({ error: "Las tareas públicas solo pueden ser marcadas por sus asignados" });
      }
    }

    const updated = await TareaRepository.updateStatus(tareaId, status, reason);
    res.status(200).json({ tarea: updated, message: "Estado de tarea actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al actualizar estado de tarea" });
  }
});

export default router;
