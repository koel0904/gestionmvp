import { useTheme } from "../../context/ThemeContext";
import Section from "./Section";
import ToggleCard from "./ToggleCard";

/**
 * AppearanceTab — dark / light mode toggle with a live preview card.
 */
export default function AppearanceTab() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col gap-5">
            <Section title="Color Theme">
                <div className="flex flex-col gap-3">
                    <ToggleCard
                        icon="dark_mode"
                        title="Dark Mode"
                        description="Sleek dark interface — easy on the eyes."
                        active={theme === "dark"}
                        onToggle={() => theme !== "dark" && toggleTheme()}
                        accentClass="from-primary/40 to-primary-dark/40"
                    />
                    <ToggleCard
                        icon="light_mode"
                        title="Light Mode"
                        description="Clean and bright interface for well-lit environments."
                        active={theme === "light"}
                        onToggle={() => theme !== "light" && toggleTheme()}
                        accentClass="from-accent-orange/30 to-accent-orange-light/20"
                    />
                </div>
            </Section>

            <Section title="Preview">
                <div
                    className={`rounded-xl p-5 border transition-all duration-500 ${theme === "dark"
                            ? "bg-background-dark border-white/10"
                            : "bg-background-light border-black/10"
                        }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-accent-orange/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-white">
                                business_center
                            </span>
                        </div>
                        <p
                            className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-800"
                                }`}
                        >
                            BizManage
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {["Dashboard", "Analytics", "Settings"].map((item) => (
                            <span
                                key={item}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors duration-300 ${theme === "dark"
                                        ? "bg-white/5 border-white/10 text-white/60"
                                        : "bg-black/5 border-black/10 text-gray-600"
                                    }`}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
