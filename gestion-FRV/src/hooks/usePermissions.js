import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";

/**
 * usePermissions - Custom hook to enforce RBAC
 * @param {string} viewName - The identifier for the view (e.g. "ventas", "proveedores")
 * @returns {object} An object containing the boolean flags and the interception helper
 */
export default function usePermissions(viewName) {
  const { user } = useAuth();

  // Owners bypass everything
  const isOwner = user?.role === "owner" || user?.type === "owner";

  // Permissions block
  const userPerms = user?.permissions || {};
  const viewPerms = userPerms[viewName] || {};

  const canView = isOwner || viewPerms.view === true;
  const canAdd = isOwner || viewPerms.add === true;
  const canEdit = isOwner || viewPerms.edit === true;
  const canDelete = isOwner || viewPerms.delete === true;

  /**
   * Helper to wrap click handlers on restricted buttons.
   * If the action is permitted, runs `onSuccess`.
   * If denied, fires `showToast` with the generic error payload.
   */
  const checkAccess = useCallback(
    (action, onSuccess, showToast) => {
      let hasAccess = false;
      let errorMessage = "No tienes permisos para realizar esta acción.";

      if (isOwner) {
        hasAccess = true;
      } else {
        switch (action) {
          case "view":
            hasAccess = canView;
            errorMessage = "No tienes permisos para acceder a esta vista";
            break;
          case "add":
            hasAccess = canAdd;
            errorMessage = "No tienes permisos para agregar información";
            break;
          case "edit":
            hasAccess = canEdit;
            errorMessage = "No tienes permisos para editar esta información";
            break;
          case "delete":
            hasAccess = canDelete;
            errorMessage = "No tienes permisos para eliminar esta información";
            break;
          default:
            hasAccess = false;
        }
      }

      if (hasAccess) {
        if (onSuccess) onSuccess();
      } else {
        if (showToast) showToast(errorMessage, "error");
      }
    },
    [isOwner, canView, canAdd, canEdit, canDelete],
  );

  return { canView, canAdd, canEdit, canDelete, checkAccess, isOwner };
}
