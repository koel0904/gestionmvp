import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getVentas = async (localId) => {
    console.log(BASE_URL);
    const res = await fetch(`${BASE_URL}/${localId}/ventas`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching ventas");
    return await res.json();
};

export const createVenta = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al registrar venta");
    }
    return await res.json();
};

export const updateVenta = async (localId, ventaId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/ventas/${ventaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar");
    }
    return await res.json();
};

export const deleteVenta = async (localId, ventaId) => {
    const res = await fetch(`${BASE_URL}/${localId}/ventas/${ventaId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar venta");
    }
    return await res.json();
};

export const getInventario = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/inventario`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching inventario");
    return await res.json();
};

export const getClientes = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/clientes`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching clientes");
    return await res.json();
};
