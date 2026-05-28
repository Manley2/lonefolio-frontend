export default function Sidebar({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) {
    const corePanels = [
        ["🏠", "Dashboard", "dashboard"],
        ["📈", "Analytics", "analytics"],
    ];

    const adminPanels = [
        ["👥", "Hiring & Users", "hiring"],
    ];

    const devPanels = [
        ["🛡️", "Security Hub", "security"],
        ["⚙️", "Settings", "settings"]
    ];

    const renderLinks = (items) => {
        return items.map(([icon, label, tabId]) => {
            const isActive = activeTab === tabId;
            return (
                <div
                    key={label}
                    onClick={() => setActiveTab(tabId)}
                    title={isCollapsed ? label : ""}
                    className={`flex items-center transition-all duration-200 cursor-pointer rounded-xl ${
                        isCollapsed ? "justify-center px-0 py-3" : "gap-3.5 px-4 py-3"
                    } ${
                        isActive
                            ? "bg-blue-50/80 dark:bg-[#16223f] text-[#3874ff] dark:text-blue-400 font-extrabold border-l-4 border-[#3874ff]"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/40 dark:hover:bg-slate-900/40 border-l-4 border-transparent"
                    }`}
                >
                    <span className="text-base select-none">{icon}</span>
                    {!isCollapsed && (
                        <span className="text-[11px] font-bold uppercase tracking-wider font-sans">
                            {label}
                        </span>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={`bg-white dark:bg-[#101424] border-r border-slate-200/60 dark:border-phoenix-border-dark h-screen p-4 flex flex-col justify-between select-none hidden lg:flex transition-all duration-300 ${
            isCollapsed ? "w-[78px]" : "w-64"
        }`}>
            <div>
                {/* Logo and title matching Phoenix */}
                <div className={`flex items-center mb-8 px-2 transition-all duration-300 ${
                    isCollapsed ? "justify-center" : "gap-3"
                }`}>
                    <div className="w-9 h-9 bg-[#3874ff] rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20 transform hover:rotate-6 transition-all duration-300 select-none">
                        L
                    </div>
                    {!isCollapsed && (
                        <span className="font-black text-base tracking-widest text-slate-800 dark:text-white uppercase font-sans bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
                            Lone
                        </span>
                    )}
                </div>

                <div className="space-y-6">
                    {/* CORE PANELS Section */}
                    <div>
                        {!isCollapsed ? (
                            <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2 select-none">
                                Core Panels
                            </p>
                        ) : (
                            <div className="border-b border-slate-100 dark:border-phoenix-border-dark my-3"></div>
                        )}
                        <nav className="space-y-1">
                            {renderLinks(corePanels)}
                        </nav>
                    </div>

                    {/* ADMIN PANEL Section */}
                    <div>
                        {!isCollapsed ? (
                            <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2 select-none">
                                Management
                            </p>
                        ) : (
                            <div className="border-b border-slate-100 dark:border-phoenix-border-dark my-3"></div>
                        )}
                        <nav className="space-y-1">
                            {renderLinks(adminPanels)}
                        </nav>
                    </div>

                    {/* DEV TOOLS Section */}
                    <div>
                        {!isCollapsed ? (
                            <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2 select-none">
                                System & Security
                            </p>
                        ) : (
                            <div className="border-b border-slate-100 dark:border-phoenix-border-dark my-3"></div>
                        )}
                        <nav className="space-y-1">
                            {renderLinks(devPanels)}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="flex flex-col gap-3">
                {/* Micro Version Status */}
                {!isCollapsed ? (
                    <div className="px-4 py-2 text-[8px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-widest border-t border-slate-100 dark:border-phoenix-border-dark pt-3">
                        VERSION v1.24.0
                    </div>
                ) : (
                    <div className="border-t border-slate-100 dark:border-phoenix-border-dark pt-2 flex justify-center text-[7px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                        V1.2
                    </div>
                )}

                {/* Sidebar Collapse Toggle Button */}
                <div className="flex justify-center border-t border-slate-100 dark:border-phoenix-border-dark pt-3">
                    <button
                        onClick={toggleSidebar}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#16223f]/50 border border-slate-200/60 dark:border-phoenix-border-dark text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a233a] transition-all flex items-center justify-center cursor-pointer active:scale-90"
                        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                    >
                        {isCollapsed ? "▶" : "◀"}
                    </button>
                </div>
            </div>
        </div>
    );
}

