import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware to enforce view-level and action-level permissions
 * @param {string} viewName - The name of the view (e.g. "ventas", "proveedores")
 * @param {string} action - The action required (e.g. "view", "add", "edit", "delete")
 */
export default function requirePermission(viewName, action) {
  return async (req, res, next) => {
    try {
      // 1. Owners bypass all permission checks
      if (req.user?.userType === "owner") {
        return next();
      }

      // 2. Fetch the user's latest permissions directly from DB
      // We do this to ensure immediate revocation, rather than trusting the JWT
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { permissions: true, active: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Check active again just in case
      if (user.active === false) {
        return res.status(403).json({
          error:
            "Cuenta desactivada. Contacte a soporte o al dueño del negocio.",
          inactive: true,
        });
      }

      // 3. Evaluate permissions JSON
      // If permissions object exists and has the view/action set to true
      const perms = user.permissions || {};
      
      // Admins bypass all view checks as well
      if (perms?.admin === true) {
        return next();
      }
      const viewPerms = perms[viewName] || {};

      if (viewPerms[action] === true) {
        return next();
      }

      // 4. Deny access
      let errorMessage = "No tienes permisos para realizar esta acción.";
      switch (action) {
        case "view":
          errorMessage = "No tienes permisos para acceder a esta vista";
          break;
        case "add":
          errorMessage = "No tienes permisos para agregar información";
          break;
        case "edit":
          errorMessage = "No tienes permisos para editar esta información";
          break;
        case "delete":
          errorMessage = "No tienes permisos para eliminar esta información";
          break;
      }

      return res.status(403).json({ error: errorMessage });
    } catch (err) {
      console.error(`Permission check failed for ${viewName}:${action}`, err);
      return res.status(500).json({ error: "Error verificando permisos" });
    }
  };
}
