import { useState } from "react";

export default function Navbar({ theme, toggleTheme, handleLogout, activeTab, setActiveTab, user }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex items-center justify-between mb-8 select-none z-40 relative">
            {/* Mobile/Tablet title placeholder */}
            <div className="lg:hidden px-5 py-2 bg-[#ffffff] dark:bg-[#101424] rounded-xl shadow-sm border border-slate-200/60 dark:border-phoenix-border-dark font-extrabold text-slate-800 dark:text-white tracking-wider text-[11px] uppercase">
                Lone Admin
            </div>

            {/* Phoenix Signature Header Search Box */}
            <div className="hidden sm:flex items-center justify-between bg-white dark:bg-[#101424] border border-slate-200/60 dark:border-phoenix-border-dark px-4 py-2.5 rounded-xl w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all duration-200">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs select-none">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search Lone console..." 
                        className="bg-transparent border-0 outline-none text-[10px] text-slate-700 dark:text-slate-250 placeholder-slate-400 font-bold uppercase tracking-wider w-full select-none"
                        disabled
                    />
                </div>
                <kbd className="hidden md:inline-block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-phoenix-border-dark rounded px-1.5 py-0.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-normal leading-none shadow-sm">
                    ⌘K
                </kbd>
            </div>

            <div className="flex items-center gap-3">
                {/* Notification Bell Badge */}
                <div className="relative">
                    <button className="p-2.5 rounded-xl bg-white dark:bg-[#101424] border border-slate-200/60 dark:border-phoenix-border-dark hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm cursor-pointer text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white relative flex items-center justify-center">
                        <span className="text-xs">🔔</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border border-white dark:border-[#101424] animate-pulse"></span>
                    </button>
                </div>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#101424] border border-slate-200/60 dark:border-phoenix-border-dark hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 shadow-sm transition-all duration-200 cursor-pointer text-slate-750 dark:text-yellow-450 text-xs flex items-center justify-center"
                    title={theme === "light" ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"}
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
                
                {/* User Profile Avatar Dropdown */}
                {user && (
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition cursor-pointer select-none border border-transparent hover:border-slate-200/40 dark:hover:border-phoenix-border-dark"
                        >
                            {user.avatar_url ? (
                                <img 
                                    src={user.avatar_url} 
                                    alt={user.name} 
                                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-850"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#3874ff] text-white flex items-center justify-center font-black text-xs uppercase shadow-md select-none">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="hidden md:flex flex-col text-left pr-2">
                                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase leading-tight">
                                    {user.name.split(" ")[0]}
                                </span>
                                <span className="text-[7.5px] font-extrabold text-[#3874ff] uppercase tracking-widest leading-none">
                                    {user.role}
                                </span>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-[#101424] border border-slate-200/80 dark:border-phoenix-border-dark rounded-2xl shadow-xl z-50 p-4 animate-fadeIn">
                                    <div className="flex items-center gap-3 pb-3.5 mb-3 border-b border-slate-100 dark:border-phoenix-border-dark">
                                        {user.avatar_url ? (
                                            <img 
                                                src={user.avatar_url} 
                                                alt={user.name} 
                                                className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-800"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#3874ff] text-white flex items-center justify-center font-black text-sm uppercase select-none">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{user.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-tight truncate w-36">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <button 
                                            onClick={() => { setActiveTab("security"); setIsProfileOpen(false); }}
                                            className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition uppercase tracking-wider cursor-pointer"
                                        >
                                            🛡️ My Security Profile
                                        </button>
                                        <button 
                                            onClick={() => { setActiveTab("settings"); setIsProfileOpen(false); }}
                                            className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition uppercase tracking-wider cursor-pointer"
                                        >
                                            ⚙️ Developer Settings
                                        </button>
                                        <div className="border-t border-slate-100 dark:border-phoenix-border-dark my-2"></div>
                                        <button 
                                            onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                                            className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-955/20 text-[10px] font-black text-red-600 dark:text-red-400 transition uppercase tracking-wider cursor-pointer"
                                        >
                                            Logout Session
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

