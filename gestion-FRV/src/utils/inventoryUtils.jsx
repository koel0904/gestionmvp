export const getStockColor = (stock, maxStock = 100) => {
    if (stock === 0)
        return {
            text: "text-red-500",
            bg: "bg-red-500/15",
            border: "border-red-500/30",
        };
    const pct = (stock / maxStock) * 100;
    if (pct <= 30)
        return {
            text: "text-orange-400",
            bg: "bg-orange-400/15",
            border: "border-orange-400/30",
        };
    if (pct <= 70)
        return {
            text: "text-yellow-400",
            bg: "bg-yellow-400/15",
            border: "border-yellow-400/30",
        };
    return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/15",
        border: "border-emerald-400/30",
    };
};
