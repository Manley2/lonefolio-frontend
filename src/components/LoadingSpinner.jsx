export default function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#e2eaf0] to-[#d6e0ea] dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#1f2937] flex items-center justify-center p-6 text-slate-900 dark:text-slate-100 transition-all duration-300">
            <div className="w-20 h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
}
