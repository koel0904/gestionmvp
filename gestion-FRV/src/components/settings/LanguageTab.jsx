import { useLang } from "../../context/LangContext";
import Section from "./Section";
import FieldRow from "./FieldRow";

const LANGUAGES = [
    {
        code: "en",
        flag: "🇺🇸",
        name: "English",
        description: "Interface in English (United States)",
    },
    {
        code: "es",
        flag: "🇪🇸",
        name: "Español",
        description: "Interfaz en Español",
    },
];

/**
 * LanguageTab — language selector and region/format settings.
 */
export default function LanguageTab() {
    const { lang, toggleLang } = useLang();

    return (
        <div className="flex flex-col gap-5">
            <Section title="Display Language">
                <div className="flex flex-col gap-3">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => lang !== l.code && toggleLang()}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer group ${lang === l.code
                                    ? "bg-white/[0.06] border-white/20 shadow-lg"
                                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10"
                                }`}
                        >
                            <span className="text-3xl shrink-0">{l.flag}</span>
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm font-semibold transition-colors ${lang === l.code ? "text-white" : "text-white/60"
                                        }`}
                                >
                                    {l.name}
                                </p>
                                <p className="text-[11px] text-white/30 mt-0.5">{l.description}</p>
                            </div>
                            {lang === l.code && (
                                <span className="material-symbols-outlined text-[18px] text-primary-light shrink-0">
                                    check_circle
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Region & Format">
                <div className="flex flex-col gap-4">
                    <FieldRow label="Date Format" icon="calendar_month">
                        <select className="glass-input rounded-xl px-4 py-3 text-sm text-white outline-none w-full appearance-none cursor-pointer">
                            <option className="bg-gray-900">MM/DD/YYYY</option>
                            <option className="bg-gray-900">DD/MM/YYYY</option>
                            <option className="bg-gray-900">YYYY-MM-DD</option>
                        </select>
                    </FieldRow>

                    <FieldRow label="Timezone" icon="schedule">
                        <select className="glass-input rounded-xl px-4 py-3 text-sm text-white outline-none w-full appearance-none cursor-pointer">
                            <option className="bg-gray-900">UTC-5 (Eastern)</option>
                            <option className="bg-gray-900">UTC-6 (Central)</option>
                            <option className="bg-gray-900">UTC-7 (Mountain)</option>
                            <option className="bg-gray-900">UTC-8 (Pacific)</option>
                            <option className="bg-gray-900">UTC+0 (GMT)</option>
                            <option className="bg-gray-900">UTC+1 (CET)</option>
                        </select>
                    </FieldRow>
                </div>
            </Section>
        </div>
    );
}
