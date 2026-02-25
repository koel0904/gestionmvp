import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import Section from "./Section";
import FieldRow from "./FieldRow";

/**
 * ProfileTab — displays user avatar, editable info form, and account detail cards.
 *
 * Receives `user` from the parent (useAuth) so it stays a pure presentational component.
 */
export default function ProfileTab() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setSaved(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        // TODO: wire to API endpoint
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    return (
        <div className="flex flex-col gap-5">
            {/* ── Avatar + meta hero ── */}
            <Section>
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/50 to-accent-orange/30 border border-white/20 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-extrabold text-white tracking-tight">
                                {initials}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                            <span className="material-symbols-outlined text-[11px] text-white">check</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <h2 className="text-xl font-extrabold text-white tracking-tight truncate">
                            {user?.name || "User"}
                        </h2>
                        <p className="text-sm text-white/50 truncate">{user?.email || "—"}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="glass-badge-purple px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-light">
                                {user?.role || "user"}
                            </span>
                            <span className="glass-badge px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white/50">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* ── Edit form ── */}
            <Section title="Personal Information">
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <FieldRow label="Display Name" icon="badge">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none w-full"
                        />
                    </FieldRow>

                    <FieldRow label="Email Address" icon="mail">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none w-full"
                        />
                    </FieldRow>

                    <FieldRow label="Role" icon="work">
                        <input
                            type="text"
                            value={user?.role || "user"}
                            readOnly
                            className="glass-input rounded-xl px-4 py-3 text-sm text-white/40 outline-none w-full cursor-not-allowed"
                        />
                    </FieldRow>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-white text-sm font-semibold cursor-pointer transition-all duration-300 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">save</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                Saved successfully!
                            </span>
                        )}
                    </div>
                </form>
            </Section>

            {/* ── Account detail cards ── */}
            <Section title="Account Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: "Member since", value: "Feb 2025", icon: "calendar_today" },
                        { label: "Account status", value: "Active", icon: "verified_user" },
                        { label: "Plan", value: "Pro", icon: "star" },
                        { label: "Last login", value: "Today", icon: "history" },
                    ].map(({ label, value, icon }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                            <span className="material-symbols-outlined text-[18px] text-primary-light">
                                {icon}
                            </span>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                                    {label}
                                </p>
                                <p className="text-sm text-white font-semibold">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}

ProfileTab.propTypes = {};
