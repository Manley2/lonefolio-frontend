export default function StatusBadge({ status, type = "success" }) {
    const isSuccess = type === "success" || status === "Connected" || status === "Active" || status === "Stable" || status === "admin";
    
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider select-none ${
                isSuccess
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
                    : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30"
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-amber-550 animate-pulse"}`}></span>
            {status}
        </span>
    );
}
