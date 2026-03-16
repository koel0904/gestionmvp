import { useWebPush } from "../../services/api/notifications.jsx";

export default function Notification({ userId }) {
    // In your actual app, you may want to grab the logged-in user's ID from Context/Store
    // so you don't have to pass it manually from parent components.
    const activeUserId = userId || "default-user-id";

    const { isSupported, isSubscribed, loading, error, subscribe, sendTestNotification } = useWebPush(activeUserId);

    if (!isSupported) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
                <p>Las notificaciones Push no son compatibles con este navegador.</p>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-xl shadow-sm bg-white max-w-md w-full">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Notificaciones</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {isSubscribed ? (
                <div className="flex flex-col gap-4">
                    <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg">
                        <p className="font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ¡Estás suscrito a las notificaciones!
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            Recibirás alertas en este dispositivo.
                        </p>
                    </div>

                    <button
                        onClick={sendTestNotification}
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg font-semibold transition flex justify-center items-center gap-2 ${loading
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Prueba'}
                        {!loading && (
                            <span className="material-symbols-outlined text-[18px]">
                                send
                            </span>
                        )}
                    </button>
                </div>
            ) : (
                <div>
                    <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                        Activa las notificaciones para mantenerte informado sobre tareas, vehículos y eventos importantes del local, incluso cuando la aplicación esté cerrada.
                    </p>
                    <button
                        onClick={subscribe}
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg font-semibold text-white transition flex justify-center items-center gap-2 ${loading
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Suscribiendo...
                            </>
                        ) : 'Activar Notificaciones'}
                    </button>
                </div>
            )}
        </div>
    );
}