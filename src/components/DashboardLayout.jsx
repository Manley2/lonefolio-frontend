import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const presetStyles = {
    aurora: {
        bg: "from-[#f0f4f8] via-[#e2eaf0] to-[#d6e0ea] dark:from-[#0b0f19] dark:via-[#0f111a] dark:to-[#171d2c]",
        blob1: "bg-blue-400/10 dark:bg-blue-600/5",
        blob2: "bg-purple-400/10 dark:bg-purple-600/5",
    },
    cosmic: {
        bg: "from-[#f5f3ff] via-[#e0e7ff] to-[#ddd6fe] dark:from-[#090514] dark:via-[#0c0d1c] dark:to-[#170a25]",
        blob1: "bg-indigo-400/10 dark:bg-indigo-500/5",
        blob2: "bg-pink-400/10 dark:bg-pink-500/5",
    },
    emerald: {
        bg: "from-[#f0f9ff] via-[#ecfdf5] to-[#d1fae5] dark:from-[#06100e] dark:via-[#0a1614] dark:to-[#0d221c]",
        blob1: "bg-teal-400/10 dark:bg-teal-500/5",
        blob2: "bg-emerald-400/10 dark:bg-emerald-500/5",
    },
    sunset: {
        bg: "from-[#fff7ed] via-[#fef3c7] to-[#ffedd5] dark:from-[#1c0d02] dark:via-[#1e1004] dark:to-[#2b1706]",
        blob1: "bg-amber-400/10 dark:bg-amber-500/5",
        blob2: "bg-rose-400/10 dark:bg-rose-500/5",
    },
    wordpress: {
        bg: "from-[#fbfbf9] via-[#f5f5f0] to-[#eaeae3] dark:from-[#0c0d0e] dark:via-[#111213] dark:to-[#151719]",
        blob1: "bg-amber-500/5 dark:bg-amber-600/5",
        blob2: "bg-slate-400/5 dark:bg-slate-700/5",
    }
};

export default function DashboardLayout({ children, theme, toggleTheme, handleLogout, activeTab, setActiveTab, bgPreset = "aurora", user }) {
    const currentPreset = presetStyles[bgPreset] || presetStyles.aurora;
    
    // Manage collapsible sidebar state persistent in localStorage
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", String(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentPreset.bg} text-slate-900 dark:text-slate-100 flex transition-all duration-300 font-sans relative overflow-hidden`}>
            {/* Extremely soft preset mesh blobs in background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full ${currentPreset.blob1} blur-[140px] transition-all duration-500`}></div>
                <div className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full ${currentPreset.blob2} blur-[140px] transition-all duration-500`}></div>
            </div>

            {/* Collapsible Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isCollapsed={isCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Main Content Area Docked Panel */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 transition-all duration-300">
                <div className="bg-phoenix-bg-light dark:bg-phoenix-bg-dark border-l border-slate-200/60 dark:border-phoenix-border-dark p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-between relative min-h-full transition-all duration-300">
                    <div>
                        {/* Navbar */}
                        <Navbar 
                            theme={theme} 
                            toggleTheme={toggleTheme} 
                            handleLogout={handleLogout} 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            toggleSidebar={toggleSidebar}
                            user={user}
                        />


                        {/* Child Content inside a premium micro-animated view */}
                        <div className="w-full">
                            {children}
                        </div>
                    </div>

                    {/* Footer styled beautifully like Phoenix */}
                    <div className="mt-16 pt-5 border-t border-slate-200/50 dark:border-phoenix-border-dark/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider select-none">
                        <div>
                            &copy; 2026 Lone Admin Console
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#3874ff]">
                            <span>Laravel 12.x Sanctum</span>
                            <span className="text-slate-350 dark:text-slate-700 font-sans">•</span>
                            <span>React 19.x Vite</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

