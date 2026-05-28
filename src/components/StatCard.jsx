export default function StatCard({ title, children, className = "" }) {
    return (
        <div className={`bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
            {title && <h2 className="font-bold text-slate-800 dark:text-white text-xs tracking-wider uppercase select-none mb-3">{title}</h2>}
            {children}
        </div>
    );
}
