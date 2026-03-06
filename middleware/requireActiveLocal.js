import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware that blocks POST/PUT/DELETE operations on an inactive local.
 * Expects `req.params.id` or `req.params.localId` to contain the local ID.
 *
 * EXEMPT: PUT /api/locales/:id (local info edit) — handled by the route itself.
 */
async function requireActiveLocal(req, res, next) {
  const localId = req.params.localId || req.params.id;

  if (!localId) {
    return next(); // no local context, skip
  }

  try {
    const local = await prisma.local.findUnique({
      where: { id: localId },
      select: { active: true },
    });

    if (!local) {
      return res.status(404).json({ error: "Local no encontrado" });
    }

    if (local.active === false) {
      return res.status(403).json({
        error:
          "Este local está inactivo. No se permiten cambios hasta que un owner lo reactive.",
        localInactive: true,
      });
    }

    next();
  } catch (err) {
    console.error("Error checking local active status:", err);
    return res
      .status(500)
      .json({ error: "Error verificando estado del local" });
  }
}

export default requireActiveLocal;
