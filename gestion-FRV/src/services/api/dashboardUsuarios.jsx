import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getUsuarios = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching usuarios");
    return await res.json();
};

export const createUsuario = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al invitar usuario");
    }
    return await res.json();
};

export const updateUsuario = async (localId, userId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar usuario");
    }
    return await res.json();
};

export const deleteUsuario = async (localId, userId) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios/${userId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar usuario");
    }
    return await res.json();
};

export const getLocales = async () => {
    const res = await fetch(BASE_URL, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching locales");
    return await res.json();
};
