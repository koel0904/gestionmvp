import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const API_URL = "http://localhost:3000/api";

/**
 * EditForm — pass any object and it auto-generates one input per key.
 *
 * Props:
 *  - title        string   Heading (optional)
 *  - data         object   The object to edit, e.g. { name: "", lastname: "", phone: "" }
 *  - apiUrl       string   API path, e.g. "/locales/1/usuarios/5"
 *  - method       "PUT" | "PATCH"  (default "PUT")
 *  - onSuccess    fn(responseData)
 *  - onCancel     fn()
 *
 * Usage:
 *   <EditForm
 *     title="Edit User"
 *     data={{ name: "John", lastname: "Doe", phone: "555" }}
 *     apiUrl="/locales/1/usuarios/5"
 *     onSuccess={(d) => console.log(d)}
 *     onCancel={() => setEditing(false)}
 *   />
 */
export default function EditForm({ title, data = {}, apiUrl, method = "PUT", onSuccess, onCancel }) {
    const [form, setForm] = useState({});
    const [status, setStatus] = useState("idle"); // idle | saving | success | error
    const [error, setError] = useState("");

    useEffect(() => {
        setForm({ ...data });
        setStatus("idle");
    }, [data]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setStatus("idle");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("saving");
        setError("");

        try {
            const res = await fetch(`${API_URL}${apiUrl}`, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) { setStatus("error"); setError(json.error || "Something went wrong."); return; }
            setStatus("success");
            onSuccess?.(json);
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setStatus("error");
            setError("Network error. Check your connection.");
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5">
            {title && (
                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/[0.06] pb-3"
                    style={{ color: "var(--surface-text)" }}>
                    {title}
                </h3>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* One input per key in the object */}
                {Object.keys(form).map((key) => (
                    <div key={key} className="flex flex-col gap-1.5">
                        <label
                            htmlFor={key}
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--surface-text-muted)" }}
                        >
                            {key}
                        </label>
                        <input
                            id={key}
                            name={key}
                            type="text"
                            value={form[key] ?? ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="glass-input rounded-xl px-4 py-3 text-sm outline-none w-full"
                            style={{ color: "var(--surface-text)" }}
                        />
                    </div>
                ))}

                {/* Error */}
                {status === "error" && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 text-sm">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-[16px] ${status === "saving" ? "animate-spin" : ""}`}>
                            {status === "saving" ? "sync" : "save"}
                        </span>
                        {status === "saving" ? "Saving…" : "Save"}
                    </button>

                    {onCancel && (
                        <button type="button" onClick={onCancel}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-sm font-semibold cursor-pointer"
                            style={{ color: "var(--surface-text-muted)" }}>
                            <span className="material-symbols-outlined text-[16px]">close</span>
                            Cancel
                        </button>
                    )}

                    {status === "success" && (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Saved!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}

EditForm.propTypes = {
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    apiUrl: PropTypes.string.isRequired,
    method: PropTypes.oneOf(["PUT", "PATCH"]),
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};
