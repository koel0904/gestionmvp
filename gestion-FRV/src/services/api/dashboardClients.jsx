import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getClientes = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/clientes`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching clientes");
    return await res.json();
};

export const createCliente = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear cliente");
    }
    return await res.json();
};

export const updateCliente = async (localId, clienteId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/clientes/${clienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar cliente");
    }
    return await res.json();
};

export const deleteCliente = async (localId, clienteId) => {
    const res = await fetch(`${BASE_URL}/${localId}/clientes/${clienteId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar cliente");
    }
    return await res.json();
};
