export const VEHICLE_TYPES = ["sedan", "pick-up", "camion", "van"];

export const DEFAULT_IMAGES = {
    sedan:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=260&fit=crop",
    "pick-up":
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=260&fit=crop",
    camion:
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=260&fit=crop",
    van: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=260&fit=crop",
};

export const FRECUENCIA_OPTIONS = ["1 mes", "3 meses", "6 meses", "1 año"];

// ── Reusable image section ──
export const ImageSection = ({
    imagen,
    tipo,
    onImageChange,
    fileRef,
    isUploading,
    focusColor = "primary",
    uploadImage,
    setUploadingState,
}) => {
    const previewSrc = imagen || DEFAULT_IMAGES[tipo] || DEFAULT_IMAGES.sedan;
    const borderFocus =
        focusColor === "sky"
            ? "focus:border-sky-400/50"
            : "focus:border-primary/50";

    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
                Imagen del Vehículo
            </label>

            {/* Preview */}
            <div className="w-full h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <img
                    src={previewSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Upload + Remove row */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploading}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50 ${isUploading ? "animate-pulse" : ""}`}
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {isUploading ? "hourglass_top" : "upload_file"}
                    </span>
                    {isUploading ? "Subiendo..." : "Subir Archivo"}
                </button>
                {imagen && (
                    <button
                        type="button"
                        onClick={() => onImageChange("")}
                        className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                        Quitar
                    </button>
                )}
            </div>

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        uploadImage(file, setUploadingState, onImageChange);
                    }
                    e.target.value = "";
                }}
            />

            {/* URL input */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[16px]">
                    link
                </span>
                <input
                    type="url"
                    value={imagen}
                    onChange={(e) => onImageChange(e.target.value)}
                    placeholder="O pegar URL de imagen..."
                    className={`w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none ${borderFocus} focus:bg-white/10 transition-all`}
                />
            </div>
        </div>
    );
};
