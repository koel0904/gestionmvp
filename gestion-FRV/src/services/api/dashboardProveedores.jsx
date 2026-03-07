import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getProveedores = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/proveedores`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching proveedores");
    return await res.json();
};

export const createProveedor = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/proveedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create supplier");
    }
    return await res.json();
};

export const deleteProveedor = async (localId, proveedorId) => {
    const res = await fetch(`${BASE_URL}/${localId}/proveedores/${proveedorId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar proveedor");
    }
    return await res.json();
};
