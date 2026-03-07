import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getInventario = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/inventario`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching inventario");
    return await res.json();
};

export const createInventario = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/inventario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear producto");
    }
    return await res.json();
};

export const updateInventario = async (localId, id, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/inventario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar producto");
    }
    return await res.json();
};

export const deleteInventario = async (localId, id) => {
    const res = await fetch(`${BASE_URL}/${localId}/inventario/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar producto");
    }
    return await res.json();
};

export const getProveedores = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/proveedores`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching proveedores");
    return await res.json();
};
