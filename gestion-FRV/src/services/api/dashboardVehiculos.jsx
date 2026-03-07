import apiBase from "../../utils/apiBase";
const BASE_URL = `${apiBase}/locales`;

export const getVehiculos = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/vehiculos`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching vehiculos");
    return await res.json();
};

export const createVehiculo = async (localId, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/vehiculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear vehículo");
    }
    return await res.json();
};

export const updateVehiculo = async (localId, id, payload) => {
    const res = await fetch(`${BASE_URL}/${localId}/vehiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar vehículo");
    }
    return await res.json();
};

export const deleteVehiculo = async (localId, id) => {
    const res = await fetch(`${BASE_URL}/${localId}/vehiculos/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar vehículo");
    }
    return await res.json();
};

export const getUsuariosLocal = async (localId) => {
    const res = await fetch(`${BASE_URL}/${localId}/usuarios`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching usuarios");
    return await res.json();
};

export const uploadVehiculoImage = async (localId, file) => {
    const fd = new FormData();
    fd.append("imagen", file);
    const res = await fetch(`${BASE_URL}/${localId}/vehiculos/upload`, {
        method: "POST",
        credentials: "include",
        body: fd,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al subir imagen");
    }
    const data = await res.json();
    const beURL = import.meta.env.VITE_API_BASE
        ? import.meta.env.VITE_API_BASE.replace("/api", "")
        : "http://localhost:3000";
    return `${beURL}${data.imageUrl}`;
};
