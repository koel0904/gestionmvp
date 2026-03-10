import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TareaRepository {
  /**
   * Obtiene las tareas para un usuario según su rol y el ID de local.
   * - owner/admin: ve todas las tareas de ese local.
   * - user normal: ve solo las tareas que le han sido asignadas,
   *   O las tareas marcadas como isPublic.
   */
  static async getTareas(localId, userId, userType, userPermissions = {}) {
    const isAdmin = userType === "owner" || userPermissions.admin === true;

    // Condición base: pertenecer al local
    const baseWhere = { localId };

    if (!isAdmin) {
      // Si no es admin, filtramos por tareas públicas o donde este asignado
      baseWhere.OR = [
        { isPublic: true },
        { assignedUsers: { some: { id: userId } } },
      ];
    }

    try {
      const tareas = await prisma.tarea.findMany({
        where: baseWhere,
        include: {
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
            },
          },
        },
        orderBy: { deadline: "asc" },
      });

      // Actualizar visualmente aquellas tareas "Fuera de tiempo" que no hayan sido completadas
      const now = new Date();
      const updatedVisualTareas = tareas.map((t) => {
        if (
          t.deadline < now &&
          t.status !== "Realizada" &&
          t.status !== "Fuera de tiempo"
        ) {
          return { ...t, status: "Fuera de tiempo" };
        }
        return t;
      });

      return updatedVisualTareas;
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarea asignándola a un conjunto de usuarios.
   */
  static async createTarea(tareaData, localId, creatorId, creatorType) {
    const { title, description, deadline, isPublic, assignedUserIds } = tareaData;

    try {
      const nuevaTarea = await prisma.tarea.create({
        data: {
          title,
          description,
          deadline: new Date(deadline),
          isPublic: isPublic || false,
          creatorId,
          creatorType,
          localId,
          assignedUsers: {
            connect: assignedUserIds.map((id) => ({ id })),
          },
        },
        include: {
           assignedUsers: {
            select: {
              id: true,
              name: true,
            },
          },
        }
      });
      return nuevaTarea;
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw error;
    }
  }

  /**
   * Actualiza el status de una tarea, y opcionalmente el reason (motivo) 
   * si aplicara el status de "No se pudo completar".
   */
  static async updateStatus(tareaId, status, reason) {
    const updateData = { status };
    if (status === "No se pudo completar" && reason) {
      updateData.reason = reason;
    } else if (status !== "No se pudo completar") {
       // Limpiar razón si el status cambió a otra cosa
      updateData.reason = null;
    }

    try {
      const updated = await prisma.tarea.update({
        where: { id: tareaId },
        data: updateData,
        include: {
           assignedUsers: {
            select: { id: true, name: true }
           }
        }
      });
      return updated;
    } catch (error) {
       console.error("Error al actualizar estado de tarea:", error);
       throw error;
    }
  }

  // Permite saber si un usuario pertenece a los asignados de una tarea
  static async isUserAssigned(tareaId, userId) {
    const tarea = await prisma.tarea.findUnique({
      where: { id: tareaId },
      include: { assignedUsers: { select: { id: true } } },
    });
    if (!tarea) return false;
    return tarea.assignedUsers.some((u) => u.id === userId);
  }
}

export default TareaRepository;
