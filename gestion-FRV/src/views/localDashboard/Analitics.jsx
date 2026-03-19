import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import StatCard from "../../components/dashboard/analytics/StatCard";
import MiniBarChart from "../../components/dashboard/analytics/MiniBarChart";
import ActivityFeed from "../../components/dashboard/analytics/ActivityFeed";
import TopTable from "../../components/dashboard/analytics/TopTable";
import apiBase from "../../utils/apiBase";

export default function Analitics() {
  const { selectedLocal } = useLocal();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!selectedLocal) return;

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiBase}/locales/${selectedLocal.id}/analytics`,
          { credentials: "include" },
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [selectedLocal?.id]);

  if (!selectedLocal) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-white/20 mb-3">
          bar_chart
        </span>
        <p className="text-white/50 text-sm font-semibold">
          Selecciona un local para ver analytics
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-white/20 mb-3">
          error
        </span>
        <p className="text-white/50 text-sm font-semibold">
          Error al cargar los datos
        </p>
      </div>
    );
  }

  const { kpis, revenueChart, ordersChart, topProducts, topCustomers, activity } = data;

  const trendDir = (val) =>
    val > 0 ? "up" : val < 0 ? "down" : "neutral";

  const fmtChange = (val) =>
    `${val > 0 ? "+" : ""}${val}%`;

  const kpiCards = [
    {
      title: "Ingresos Totales",
      value: `$${Number(kpis.revenue || 0).toFixed(2)}`,
      change: fmtChange(kpis.revenueChange),
      trend: trendDir(kpis.revenueChange),
      icon: "payments",
      gradient: "from-primary/30 to-primary/10",
      iconColor: "text-primary-light",
      glowClass: "glow-purple",
      border: "border-primary/20",
    },
    {
      title: "Ventas",
      value: (kpis.orders || 0).toLocaleString(),
      change: fmtChange(kpis.ordersChange),
      trend: trendDir(kpis.ordersChange),
      icon: "shopping_bag",
      gradient: "from-accent-orange/30 to-accent-orange/10",
      iconColor: "text-accent-orange",
      glowClass: "glow-orange",
      border: "border-accent-orange/20",
    },
    {
      title: "Clientes",
      value: (kpis.customers || 0).toLocaleString(),
      change: null,
      trend: "neutral",
      icon: "group",
      gradient: "from-blue-400/20 to-blue-300/5",
      iconColor: "text-blue-400",
      glowClass: "glow-mixed",
      border: "border-blue-400/20",
    },
    {
      title: "Ticket Promedio",
      value: `$${Number(kpis.avgOrderValue || 0).toFixed(2)}`,
      change: fmtChange(kpis.avgOrderValueChange),
      trend: trendDir(kpis.avgOrderValueChange),
      icon: "receipt_long",
      gradient: "from-white/10 to-white/5",
      iconColor: "text-white/70",
      glowClass: "glow-mixed",
      border: "border-white/10",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-white/40 mt-0.5">
          Rendimiento de {selectedLocal.name}. Tendencias vs. mes anterior.
        </p>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MiniBarChart
          data={revenueChart}
          title="Ingresos"
          subtitle="Últimos 6 meses"
          color="purple"
          height={130}
        />
        <MiniBarChart
          data={ordersChart}
          title="Ventas"
          subtitle="Últimos 7 días"
          color="orange"
          height={130}
        />
      </div>

      {/* ── Activity + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityFeed events={activity} />
        </div>
        <TopTable
          title="Top Productos"
          icon="emoji_events"
          color="orange"
          columns={["Producto", "Vendidos", "Ingreso"]}
          rows={topProducts}
        />
      </div>

      {/* ── Top customers ── */}
      <TopTable
        title="Top Clientes"
        icon="star"
        color="purple"
        columns={["Cliente", "Ventas", "Total"]}
        rows={topCustomers}
      />
    </div>
  );
}
