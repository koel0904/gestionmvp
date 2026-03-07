import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getUsuarios = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios`, { credentials: "include" });
    if (!res.ok) throw new Error("Error fetching usuarios");
    return await res.json();
};

export const updatePermissions = async (localId, userId, permissions) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios/${userId}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ permissions }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar permisos");
    }
    return await res.json();
};
