import StatCard from "../../components/analytics/StatCard";
import MiniBarChart from "../../components/analytics/MiniBarChart";
import ActivityFeed from "../../components/analytics/ActivityFeed";
import TopTable from "../../components/analytics/TopTable";

// ── Sample data (replace with real API calls when ready) ─────────────
const KPI_CARDS = [
    {
        title: "Total Revenue",
        value: "$24,300",
        change: "+12.5%",
        trend: "up",
        icon: "payments",
        gradient: "from-primary/30 to-primary/10",
        iconColor: "text-primary-light",
        glowClass: "glow-purple",
        border: "border-primary/20",
    },
    {
        title: "Orders",
        value: "1,284",
        change: "+8.2%",
        trend: "up",
        icon: "shopping_bag",
        gradient: "from-accent-orange/30 to-accent-orange/10",
        iconColor: "text-accent-orange",
        glowClass: "glow-orange",
        border: "border-accent-orange/20",
    },
    {
        title: "Customers",
        value: "573",
        change: "-3.1%",
        trend: "down",
        icon: "group",
        gradient: "from-blue-400/20 to-blue-300/5",
        iconColor: "text-blue-400",
        glowClass: "glow-mixed",
        border: "border-blue-400/20",
    },
    {
        title: "Avg. Order Value",
        value: "$18.92",
        change: "+0.4%",
        trend: "neutral",
        icon: "receipt_long",
        gradient: "from-white/10 to-white/5",
        iconColor: "text-white/70",
        glowClass: "glow-mixed",
        border: "border-white/10",
    },
];

const REVENUE_DATA = [
    { label: "Jan", value: 3200 },
    { label: "Feb", value: 4100 },
    { label: "Mar", value: 3700 },
    { label: "Apr", value: 5200 },
    { label: "May", value: 4800 },
    { label: "Jun", value: 6100 },
    { label: "Jul", value: 5500 },
];

const ORDERS_DATA = [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 68 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 91 },
    { label: "Fri", value: 113 },
    { label: "Sat", value: 78 },
    { label: "Sun", value: 34 },
];

const ACTIVITY_EVENTS = [
    {
        id: 1,
        icon: "add_shopping_cart",
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-400/10",
        title: "New order #1042",
        desc: "Customer: María López — $34.50",
        time: "2 min ago",
        badge: "Sale",
        badgeColor: "glass-badge-orange text-accent-orange",
    },
    {
        id: 2,
        icon: "person_add",
        iconColor: "text-primary-light",
        iconBg: "bg-primary/10",
        title: "New customer registered",
        desc: "Carlos Ramírez joined the platform",
        time: "18 min ago",
        badge: "New",
        badgeColor: "glass-badge-purple text-primary-light",
    },
    {
        id: 3,
        icon: "inventory",
        iconColor: "text-accent-orange",
        iconBg: "bg-accent-orange/10",
        title: "Low stock alert",
        desc: "Product: Café Americano — 5 left",
        time: "1 hr ago",
        badge: "Alert",
        badgeColor: "bg-red-500/20 border border-red-400/20 text-red-400",
    },
    {
        id: 4,
        icon: "payments",
        iconColor: "text-blue-400",
        iconBg: "bg-blue-400/10",
        title: "Payment received",
        desc: "Invoice #0981 — $210.00",
        time: "3 hr ago",
        badge: "Paid",
        badgeColor: "bg-emerald-500/20 border border-emerald-400/20 text-emerald-400",
    },
    {
        id: 5,
        icon: "local_shipping",
        iconColor: "text-white/60",
        iconBg: "bg-white/5",
        title: "Delivery dispatched",
        desc: "Order #1039 sent to client",
        time: "Yesterday",
    },
];

const TOP_PRODUCTS_ROWS = [
    ["Café Americano", "248 units", "$1,240"],
    ["Croissant", "192 units", "$576"],
    ["Latte", "174 units", "$1,044"],
    ["Sandwich Club", "139 units", "$972"],
    ["Agua Mineral", "98 units", "$196"],
];

const TOP_CUSTOMERS_ROWS = [
    ["María López", "34 orders", "$612"],
    ["Carlos Ramírez", "28 orders", "$504"],
    ["Sofía Torres", "21 orders", "$378"],
    ["Juan Pérez", "18 orders", "$324"],
];

// ── Period selector options ──────────────────────────────────────────
const PERIODS = ["7D", "30D", "90D", "1Y"];

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
import { useState } from "react";

export default function Analitics() {
    const [period, setPeriod] = useState("30D");

    return (
        <div className="flex flex-col gap-5">
            {/* ── Page header ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                        Business performance overview.
                    </p>
                </div>

                {/* Period selector */}
                <div className="glass-panel rounded-xl p-1 flex gap-1">
                    {PERIODS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${period === p
                                    ? "bg-white/[0.08] text-white border border-white/10 shadow"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── KPI cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_CARDS.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MiniBarChart
                    data={REVENUE_DATA}
                    title="Revenue"
                    subtitle={`Monthly · ${period}`}
                    color="purple"
                    height={130}
                />
                <MiniBarChart
                    data={ORDERS_DATA}
                    title="Orders"
                    subtitle={`Daily this week · ${period}`}
                    color="orange"
                    height={130}
                />
            </div>

            {/* ── Activity + Top Products ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Activity feed — takes 2 cols */}
                <div className="lg:col-span-2">
                    <ActivityFeed events={ACTIVITY_EVENTS} />
                </div>

                {/* Top products — 1 col */}
                <TopTable
                    title="Top Products"
                    icon="emoji_events"
                    color="orange"
                    columns={["Product", "Sold", "Revenue"]}
                    rows={TOP_PRODUCTS_ROWS}
                />
            </div>

            {/* ── Top customers ── */}
            <TopTable
                title="Top Customers"
                icon="star"
                color="purple"
                columns={["Customer", "Orders", "Spent"]}
                rows={TOP_CUSTOMERS_ROWS}
            />
        </div>
    );
}
