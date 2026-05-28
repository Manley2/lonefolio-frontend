

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

// Modular Reusable Components
import DashboardLayout from "../components/DashboardLayout";
import ProfileCard from "../components/ProfileCard";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminError, setAdminError] = useState("");
    const navigate = useNavigate();

    // activeTab holds the SPA multi-view state: dashboard, analytics, hiring, security, settings
    const [activeTab, setActiveTab] = useState("dashboard");

    // System Health Check states
    const [systemStatus, setSystemStatus] = useState(null);
    const [systemLoading, setSystemLoading] = useState(false);
    const [systemError, setSystemError] = useState("");

    // Simulated live metrics for server health check
    const [simulatedMetrics, setSimulatedMetrics] = useState({ cpu: 4, latency: 32 });
    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedMetrics({
                cpu: Math.floor(Math.random() * 8) + 3, // 3% to 10%
                latency: Math.floor(Math.random() * 20) + 20, // 20ms to 40ms
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [tokenCopied, setTokenCopied] = useState(false);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    const [bgPreset, setBgPreset] = useState(() => {
        return localStorage.getItem("bgPreset") || "aurora";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("bgPreset", bgPreset);
    }, [bgPreset]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchUser(token);
        fetchSystemStatus(token);
    }, []);

    useEffect(() => {
        if (user && user.role === "admin") {
            fetchAdminUsers();
        } else {
            setAdminUsers([]);
        }
    }, [user]);

    const fetchUser = async (token) => {
        try {
            const response = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data.data.user);
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    const fetchSystemStatus = async (token) => {
        setSystemLoading(true);
        try {
            const response = await api.get("/system-status", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSystemStatus(response.data.data);
            setSystemError("");
        } catch (error) {
            console.error("Gagal memuat status sistem:", error);
            setSystemError("Server API Offline");
        } finally {
            setSystemLoading(false);
        }
    };

    const fetchAdminUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await api.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdminUsers(response.data.data.users);
            setAdminError("");
        } catch (error) {
            setAdminError("Gagal mengambil data user (403 Forbidden).");
            console.error(error);
        }
    };

    const toggleDevRole = async () => {
        if (!user) return;
        const newRole = user.role === "admin" ? "user" : "admin";
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await api.patch(
                "/me/role",
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(response.data.data.user);
        } catch (error) {
            console.error("Gagal mengubah role dev:", error);
        }
    };

    const toggleUserRole = async (targetUser) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const newRole = targetUser.role === "admin" ? "user" : "admin";
        try {
            await api.patch(
                `/admin/users/${targetUser.id}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchAdminUsers();
        } catch (error) {
            console.error("Gagal mengubah role user lain:", error);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await api.post("/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        navigate("/");
    };

    const fileInputRef = useRef(null);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editPasswordConfirmation, setEditPasswordConfirmation] = useState("");
    const [editError, setEditError] = useState("");
    const [editSaving, setEditSaving] = useState(false);

    useEffect(() => {
        if (user && isEditProfileOpen) {
            setEditName(user.name);
            setEditEmail(user.email);
            setEditPassword("");
            setEditPasswordConfirmation("");
            setEditError("");
        }
    }, [isEditProfileOpen, user]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("File harus berupa gambar!");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran gambar maksimal 2MB!");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        const token = localStorage.getItem("token");
        if (!token) return;

        setAvatarUploading(true);
        try {
            const response = await api.post("/me/avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setUser(response.data.data.user);
        } catch (error) {
            console.error("Gagal mengunggah avatar:", error);
            alert("Gagal mengunggah avatar. Pastikan file valid.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setEditError("");

        if (editPassword !== editPasswordConfirmation) {
            setEditError("Konfirmasi password tidak cocok.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        setEditSaving(true);
        try {
            const response = await api.put(
                "/me",
                {
                    name: editName,
                    email: editEmail,
                    password: editPassword || null,
                    password_confirmation: editPasswordConfirmation || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(response.data.data.user);
            setIsEditProfileOpen(false);
        } catch (error) {
            console.error("Gagal mengupdate profil:", error);
            if (error.response?.data?.errors) {
                const errMsgs = Object.values(error.response.data.errors).flat().join(" ");
                setEditError(errMsgs);
            } else if (error.response?.data?.message) {
                setEditError(error.response.data.message);
            } else {
                setEditError("Gagal memperbarui profil. Silakan coba lagi.");
            }
        } finally {
            setEditSaving(false);
        }
    };

    const copyTokenToClipboard = () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        navigator.clipboard.writeText(token);
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 2000);
    };

    const wipeSessionAndForcedLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Calculate real dynamic Profile Completeness
    const getProfileCompleteness = () => {
        if (!user) return 0;
        let score = 0;
        if (user.name) score += 25;
        if (user.email) score += 25;
        if (user.avatar_url && !user.avatar_url.includes("ui-avatars.com")) score += 25;
        if (user.role) score += 25;
        return score;
    };

    const completeness = getProfileCompleteness();
    const isCustomAvatar = user?.avatar_url && !user.avatar_url.includes("ui-avatars.com");

    if (!user) {
        return <LoadingSpinner />;
    }


            
    return (
        <DashboardLayout 
            theme={theme} 
            toggleTheme={toggleTheme} 
            handleLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bgPreset={bgPreset}
            user={user}
        >
            
            {/* dynamic View render based on activeTab */}
            
            {activeTab === "dashboard" && (
                <div className="animate-fadeIn duration-200">
                    {/* Greeting Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
                        <div>
                            <p className="text-xs text-[#1d4ed8] dark:text-blue-400 font-bold tracking-widest uppercase">Fullstack Portfolio Project</p>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-2">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2">
                                Laravel API, React, Sanctum, MySQL, protected routes, and modern dashboard UI.
                            </p>
                            
                            {/* Live Stats Pills */}
                            <div className="flex flex-wrap gap-2.5 mt-4 items-center">
                                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-white dark:border-slate-700/50 px-3.5 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-[11px] text-slate-600 dark:text-slate-300 select-none">
                                    <span className="font-semibold">Sesi Aktif:</span>
                                    <StatusBadge status="Active" />
                                </div>
                                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-white dark:border-slate-700/50 px-3.5 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-[11px] text-slate-600 dark:text-slate-300 select-none">
                                    <span className="font-semibold">Koneksi Database:</span>
                                    <StatusBadge status={systemStatus ? systemStatus.db_status : "Checking..."} type={systemStatus?.db_status === "Connected" ? "success" : "pending"} />
                                </div>
                                {user.role === "admin" && (
                                    <div className="flex items-center gap-2 bg-purple-50 text-white dark:bg-purple-950/40 border border-purple-200/20 px-3.5 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-[11px] select-none">
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">Total DB Users:</span>
                                        <span className="font-extrabold text-purple-600 dark:text-purple-400">{adminUsers.length + 1}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Header Stats Widget styled exactly like Nixtio */}
                        <div className="flex items-center gap-8 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/50 p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-sm select-none">
                            <div className="text-center px-4 border-r border-slate-300/40 dark:border-slate-700/40">
                                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">4</h2>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-sans mt-0.5">Features</p>
                            </div>
                            <div className="text-center px-4 border-r border-slate-300/40 dark:border-slate-700/40">
                                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">100%</h2>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-sans mt-0.5">Auth Flow</p>
                            </div>
                            <div className="text-center px-4">
                                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">2</h2>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-sans mt-0.5">Roles Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Main Grid Layout (Asymmetric & Visual Variety) */}
                    <div className="grid lg:grid-cols-4 gap-6 mt-8">
                        {/* Profile Card (Left - 1 col) */}
                        <ProfileCard 
                            user={user}
                            avatarUploading={avatarUploading}
                            fileInputRef={fileInputRef}
                            handleAvatarChange={handleAvatarChange}
                            setIsEditProfileOpen={setIsEditProfileOpen}
                            toggleDevRole={toggleDevRole}
                        />

                        {/* Analytics Chart (Right - 3 cols) */}
                        <div className="lg:col-span-3">
                            <AnalyticsChart />
                        </div>

                        {/* Row 3: Metrics with Rich Visual Variety */}
                        
                        {/* 1. Completeness SVG Circular Ring Card */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between transition hover:translate-y-[-2px] duration-300">
                            <div>
                                <h3 className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider select-none">
                                    Profile Completeness
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 font-medium select-none">Kemajuan kelengkapan akun portofolio Anda</p>
                            </div>

                            <div className="flex items-center justify-center py-6 relative">
                                <svg className="w-36 h-36 transform -rotate-90 drop-shadow-[0_4px_12px_rgba(59,130,246,0.1)]" viewBox="0 0 100 100">
                                    {/* Track */}
                                    <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="7.5" fill="transparent" />
                                    {/* Progress Ring */}
                                    <circle cx="50" cy="50" r="40" stroke="url(#completenessGrad)" strokeWidth="8" fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * completeness) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="completenessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="100%" stopColor="#7c3aed" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                                    <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{completeness}%</span>
                                    <span className="text-[8px] font-extrabold text-[#1d4ed8] dark:text-blue-400 uppercase tracking-widest mt-1">Verified</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                {completeness === 100 
                                    ? "🎉 Sempurna! Profil Anda terisi penuh." 
                                    : "💡 Tips: Unggah foto profil Anda pada kartu sebelah kiri untuk mencapai status 100%!"
                                }
                            </div>
                        </div>

                        {/* 2. Live Server Console Card */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between transition hover:translate-y-[-2px] duration-300">
                            <div>
                                <div className="flex justify-between items-center select-none">
                                    <h3 className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        Live Server Health
                                    </h3>
                                    {/* Terminal dots */}
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                    </div>
                                </div>
                                <p className="text-slate-550 dark:text-slate-400 text-[10px] mt-0.5 font-medium select-none">Visualisasi status respons server API</p>
                            </div>

                            {systemLoading && !systemStatus ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Pinging...</span>
                                </div>
                            ) : systemError ? (
                                <div className="bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs border border-red-100 dark:border-red-900/20 font-bold font-mono">
                                    🚨 API SERVER OFFLINE
                                </div>
                            ) : (
                                <div className="space-y-2 py-4 font-mono text-[10px]">
                                    {[
                                        ["MySQL DB Connection", systemStatus?.db_status === "Connected" ? "ACTIVE" : "OFFLINE", systemStatus?.db_status === "Connected" ? "success" : "error"],
                                        ["Simulated CPU Load", `${simulatedMetrics.cpu}%`, simulatedMetrics.cpu > 8 ? "warning" : "success"],
                                        ["API Ping Latency", `${simulatedMetrics.latency} ms`, "info"],
                                        ["REST Framework", systemStatus?.laravel_version ? `Laravel ${systemStatus.laravel_version}` : "Laravel 12.x", "info"]
                                    ].map(([label, val, type], idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-phoenix-border-dark px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition">
                                            <span className="text-slate-400 dark:text-slate-500 font-semibold">{label}</span>
                                            <span className={`font-bold px-2 py-0.5 rounded-full text-[9px] ${
                                                type === "success" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20" :
                                                type === "error" ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20" :
                                                type === "warning" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20" :
                                                "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20"
                                            }`}>
                                                {val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 dark:border-phoenix-border-dark pt-3 select-none">
                                <span>STATUS CODE: 200 OK</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                        </div>

                        {/* 3. Security Passcard (Sanctum JWT Badge) */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between transition hover:translate-y-[-2px] duration-300 relative overflow-hidden">
                            {/* Decorative Cybernetic Chip Icon in background top-right */}
                            <div className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/25 flex items-center justify-center opacity-70 select-none">
                                <span className="text-amber-500 text-sm">💾</span>
                            </div>

                            <div>
                                <h3 className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider select-none">
                                    JWT Authorization Pass
                                </h3>
                                <p className="text-slate-550 dark:text-slate-400 text-[10px] mt-0.5 font-medium select-none">Kartu kunci keamanan Sanctum aktif</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-phoenix-border-dark shadow-inner mt-4 relative select-none">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                                        Clearance Level: Admin
                                    </div>
                                    <span className="text-[8px] bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-emerald-500/30">
                                        Secured
                                    </span>
                                </div>
                                <div className="space-y-1.5 font-mono text-[8px] text-slate-400">
                                    <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500 font-bold">PROVIDER:</span> <span className="text-slate-700 dark:text-white font-bold">Laravel Sanctum</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500 font-bold">CIPHER:</span> <span className="text-slate-700 dark:text-white font-bold">BCRYPT 12 rounds</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500 font-bold">PASSCARD ID:</span> <span className="text-amber-650 dark:text-amber-500 truncate w-24 text-right font-bold">Bearer {localStorage.getItem("token")?.slice(0, 10)}...</span></p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-1 select-none text-[10px] text-center text-slate-500 dark:text-slate-450 font-bold">
                                <p className="flex items-center justify-center gap-1">
                                    <span className="text-emerald-500">🛡️</span> Kunci Token Aktif & Terenkripsi
                                </p>
                            </div>
                        </div>

                        {/* 4. Onboarding Roadmap Timeline Card (Right - 1 col) */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark text-slate-800 dark:text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between transition hover:translate-y-[-2px] duration-300 relative overflow-hidden">
                            <div>
                                <div className="flex justify-between items-center select-none">
                                    <h2 className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white uppercase">Security Roadmap</h2>
                                    <span className="text-[9px] bg-blue-50 dark:bg-blue-950/20 text-[#3874ff] dark:text-blue-400 font-extrabold px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-900/30 tracking-wider font-mono">
                                        {2 + (isCustomAvatar ? 1 : 0) + (user.role === "admin" ? 1 : 0)}/4 DONE
                                    </span>
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold select-none leading-normal">
                                    Ikuti tahapan keamanan berikut untuk portofolio siap pasang.
                                </p>

                                {/* Stepper Timeline */}
                                <div className="mt-5 relative border-l border-slate-200 dark:border-phoenix-border-dark pl-5 space-y-4 select-none">
                                    {[
                                        ["Register & Login SPA", true],
                                        ["Sanctum Bearer Token", true],
                                        ["Upload Custom Avatar", isCustomAvatar],
                                        ["Promote to Administrator", user.role === "admin"]
                                    ].map(([task, isDone], idx) => (
                                        <div key={idx} className="relative">
                                            {/* Stepper node dot */}
                                            <span className={`absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold border transition ${
                                                isDone 
                                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20" 
                                                    : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-phoenix-border-dark text-slate-400 dark:text-slate-500 animate-pulse"
                                            }`}>
                                                {isDone ? "✓" : "⌛"}
                                            </span>
                                            <h4 className={`text-[10px] font-bold leading-none ${isDone ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>{task}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setIsDeployModalOpen(true)}
                                className="mt-6 w-full bg-[#3874ff] text-white font-bold py-2.5 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 text-xs shadow-sm cursor-pointer border-0"
                            >
                                ☁️ Ready to Deploy
                            </button>
                        </div>

                        {/* Project Overview Card (Bottom - Full width 4 cols) */}
                        <div className="lg:col-span-4 bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm transition hover:translate-y-[-2px] duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-black text-xl text-slate-800 dark:text-white tracking-tight uppercase select-none font-sans">Project Overview</h2>
                                <span className="bg-blue-50 dark:bg-blue-950/20 text-[#3874ff] dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm select-none">
                                    Fullstack SPA
                                </span>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mt-4">
                                {[
                                    ["Laravel 12 REST API", "ApiResponses, UserResource, Form Requests validation, Sanctum Bearer tokens.", "🔴"],
                                    ["React 19 SPA", "Vite build tool, clean modular components, DashboardLayout orchestration.", "🔵"],
                                    ["Tailwind CSS v4", "Curated HSL premium colors, sejuk glassmorphic styling, global theme variables.", "🟢"],
                                    ["MySQL Database Schema", "Users table, customized role management, optimized storage symlinks.", "🟡"]
                                ].map(([title, desc, emoji]) => (
                                    <div key={title} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-phoenix-border-dark rounded-xl p-5 hover:bg-slate-100 dark:hover:bg-slate-900 transition shadow-inner">
                                        <div className="flex items-center gap-2 select-none">
                                            <span className="text-sm">{emoji}</span>
                                            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight">{title}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "analytics" && (
                <div className="animate-fadeIn duration-200 space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            📈 SaaS Live Analytics Console
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Grafik pertumbuhan interaksi dan data analytics sistem secara real-time.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-[2.5rem] shadow-sm">
                        <AnalyticsChart />
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            ["Average Session Length", "4m 32s", "⏱️ Average user active session time", "+12.4%"],
                            ["Bounce Rate", "24.8%", "📉 Percentage of single-page sessions", "-4.5%"],
                            ["System Live Hits", "14,235 hits", "⚡ Total API requests successfully served", "+18.2%"],
                            ["Active Signups", `${adminUsers.length + 1} users`, "👥 Total database user registrations", "+100%"]
                        ].map(([title, val, desc, trend], idx) => (
                            <StatCard key={idx} title={title}>
                                <div className="flex justify-between items-baseline mt-2">
                                    <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{val}</span>
                                    <span className="text-xs font-bold text-emerald-500">{trend}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{desc}</p>
                            </StatCard>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "hiring" && (
                <div className="animate-fadeIn duration-200 space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            👥 User Management & Otorisasi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Pusat pemetaan pengguna terdaftar dan hak akses di backend Laravel.
                        </p>
                    </div>

                    {user.role === "admin" ? (
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <h2 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Admin Control Panel</h2>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-455 mt-0.5">
                                        Kelola pengguna dan ubah otorisasi API secara dinamis.
                                    </p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-900/30 select-none">
                                    🛡️ Admin Mode Active
                                </div>
                            </div>

                            {adminError ? (
                                <div className="bg-red-50 text-red-650 p-4 rounded-2xl text-xs border border-red-100">
                                    {adminError}
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm bg-white/90 dark:bg-slate-900/90">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                                                <th className="p-4 pl-6">Pengguna</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Tanggal Daftar</th>
                                                <th className="p-4">Hak Akses / Role</th>
                                                <th className="p-4 pr-6 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                            {adminUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <span className="text-2xl">👥</span>
                                                            <p className="font-medium text-xs dark:text-slate-500">Tidak ada pengguna lain terdaftar di database.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                adminUsers.map((u) => (
                                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                        <td className="p-4 pl-6 font-semibold flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                            {u.avatar_url ? (
                                                                <img 
                                                                    src={u.avatar_url} 
                                                                    alt={u.name} 
                                                                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-850 select-none pointer-events-none"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm select-none">
                                                                    {u.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <span>{u.name}</span>
                                                        </td>
                                                        <td className="p-4 font-mono text-xs text-slate-450 dark:text-slate-500">{u.email}</td>
                                                        <td className="p-4 text-xs text-slate-450 dark:text-slate-500">
                                                            {new Date(u.created_at).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                                    u.role === "admin"
                                                                        ? "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30"
                                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/55 dark:border-slate-700/50"
                                                                }`}
                                                            >
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 pr-6 text-right">
                                                            <button
                                                                onClick={() => toggleUserRole(u)}
                                                                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition duration-150 cursor-pointer ${
                                                                    u.role === "admin"
                                                                        ? "border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
                                                                        : "border-purple-200 dark:border-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 active:scale-95"
                                                                }`}
                                                            >
                                                                Ubah ke {u.role === "admin" ? "User" : "Admin"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-2xl space-y-6">
                            <span className="text-6xl block">🔒</span>
                            <h2 className="text-2xl font-black text-white tracking-tight">Administrative Access Restricted</h2>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Kontol akses halaman ini diproteksi oleh middleware <code className="bg-slate-950 text-blue-400 px-2 py-1 rounded font-mono">App\Http\Middleware\CheckRole</code> di REST API Laravel. Hanya akun dengan hak akses <code className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">admin</code> yang diizinkan memanggil database pengguna lain.
                            </p>

                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-left space-y-3">
                                <h4 className="text-xs font-bold text-slate-300">💡 Cara Menguji (Dev Switcher):</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Tekan tombol **Switch to Admin** di kartu profil sebelah kiri Anda atau gunakan tombol pintas fungsional di bawah ini untuk menaikkan role akun Anda secara instan ke Admin, memicu pembaruan state, dan membuka konsol kontrol ini secara real-time!
                                </p>
                            </div>

                            <button
                                onClick={toggleDevRole}
                                className="bg-[#1d4ed8] text-white hover:bg-blue-600 font-bold px-8 py-3 rounded-full active:scale-95 transition-all duration-200 text-xs shadow-md shadow-blue-500/10 cursor-pointer"
                            >
                                🔑 Promosikan Akun Saya Menjadi Admin
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "security" && (
                <div className="animate-fadeIn duration-200 space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            🛡️ Security Hub & Token Control
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Pusat pengelolaan kredensial akun, otorisasi Sanctum Bearer, dan validasi BCRYPT.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Sandboxed Profile Form directly on-page */}
                        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-4 select-none">
                                Sandboxed Profile Modification
                            </h3>

                            {editError && (
                                <div className="mb-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs border border-red-100 dark:border-red-900/30 font-semibold font-sans">
                                    ⚠️ {editError}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="mt-1 w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl px-4 py-3 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-[#1d4ed8] transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="mt-1 w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl px-4 py-3 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-[#1d4ed8] transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-3xl border border-slate-200/30 dark:border-slate-800/60 space-y-3">
                                    <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide select-none">
                                        Ganti Password (Opsional)
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider select-none">
                                                Password Baru
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Min. 8 karakter"
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                className="mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl px-4 py-2.5 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-[#1d4ed8] transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider select-none">
                                                Konfirmasi
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Konfirmasi"
                                                value={editPasswordConfirmation}
                                                onChange={(e) => setEditPasswordConfirmation(e.target.value)}
                                                className="mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl px-4 py-2.5 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-[#1d4ed8] transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={editSaving}
                                    className="bg-[#1d4ed8] text-white font-bold px-8 py-3 rounded-full hover:bg-blue-600 active:scale-95 transition-all duration-200 text-xs shadow-md shadow-blue-500/10 border border-blue-500 cursor-pointer disabled:opacity-50"
                                >
                                    {editSaving ? "Menyimpan... ⌛" : "Simpan Perubahan"}
                                </button>
                            </form>
                        </div>

                        {/* Sanctum Bearer Info Card */}
                        <div className="bg-[#0c1b40] dark:bg-slate-950 text-white rounded-[2rem] p-6 shadow-xl border border-blue-900/30 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight mb-2 select-none">Bearer Token Access</h3>
                                <p className="text-[11px] text-blue-200/70 leading-relaxed mb-4">
                                    Sanctum memberikan token acak bertipe Bearer yang disimpan secara mandiri di Local Storage. Token ini harus dikirimkan pada Header request Axios di frontend untuk mengakses rute API Laravel yang dilindungi.
                                </p>

                                <div className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-2xl font-mono text-[9px] text-blue-300">
                                    <p>🔑 Key: <span className="text-white">Authorization</span></p>
                                    <p className="truncate">🎫 Token: <span className="text-emerald-400">Bearer {localStorage.getItem("token")?.slice(0, 24)}...</span></p>
                                    <p>🛡️ Driver: <span className="text-white">Laravel Sanctum</span></p>
                                </div>
                            </div>

                            <button
                                onClick={copyTokenToClipboard}
                                className="mt-5 bg-blue-600 text-white hover:bg-blue-500 font-bold py-2.5 rounded-full text-xs shadow-md cursor-pointer transition active:scale-95"
                            >
                                {tokenCopied ? "Tersalin! ✓" : "📋 Salin Token Aktif"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="animate-fadeIn duration-200 space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            ⚙️ Developer & System Center
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Setelan sistem lokal, salin token otorisasi, dan aksi paksa pembersihan sesi pengujian.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        
                        {/* 1. Developer Actions */}
                        <StatCard title="Developer Testing Tools" className="md:col-span-2">
                            <p className="text-slate-450 dark:text-slate-500 text-xs font-medium leading-relaxed">
                                Menu khusus untuk pengujian portofolio. Anda dapat menyalin token Sanctum yang aktif saat ini untuk ditarik langsung ke Thunder Client / Postman guna menguji endpoint terproteksi rute Laravel API.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200/30 flex flex-col justify-between min-h-[160px]">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-white select-none">Copy Active Token</h4>
                                        <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">Salin token otorisasi Sanctum Bearer yang aktif ke clipboard untuk pengujian API eksternal.</p>
                                    </div>
                                    <button
                                        onClick={copyTokenToClipboard}
                                        className="mt-4 w-full bg-[#1d4ed8] text-white hover:bg-blue-600 font-bold py-2 rounded-full text-[11px] shadow-sm transition cursor-pointer active:scale-95"
                                    >
                                        {tokenCopied ? "Tersalin! ✓" : "📋 Salin Token Otorisasi"}
                                    </button>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200/30 flex flex-col justify-between min-h-[160px]">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-850 dark:text-white select-none">Forced Local Logout</h4>
                                        <p className="text-[10px] text-slate-455 mt-1 leading-relaxed">Hapus seluruh isi session Local Storage untuk mensimulasikan forced-logout dan menguji proteksi SPA routing.</p>
                                    </div>
                                    <button
                                        onClick={wipeSessionAndForcedLogout}
                                        className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-full text-[11px] shadow-sm transition cursor-pointer active:scale-95"
                                    >
                                        🚨 Hapus Sesi & Paksa Keluar
                                    </button>
                                </div>
                            </div>
                        </StatCard>

                        <StatCard title="Personalized Dashboard Background" className="md:col-span-2">
                            <p className="text-slate-450 dark:text-slate-500 text-xs font-medium leading-relaxed">
                                Pilih tema latar belakang premium untuk dashboard portofolio Anda. Setiap skema dirancang khusus untuk menghasilkan kedalaman visual glassmorphism yang spektakuler.
                            </p>

                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
                                {[
                                    { id: "aurora", label: "Classic Aurora", desc: "Default blue & purple glowing mesh", colors: ["#60a5fa", "#c084fc"] },
                                    { id: "cosmic", label: "Cosmic Night", desc: "Futuristic pink & indigo cyberpunk", colors: ["#6366f1", "#ec4899"] },
                                    { id: "emerald", label: "Emerald Oasis", desc: "Refreshing teal & green ecology", colors: ["#2dd4bf", "#34d399"] },
                                    { id: "sunset", label: "Sunset Horizon", desc: "Warm amber & rose evening glow", colors: ["#fbbf24", "#f43f5e"] },
                                    { id: "wordpress", label: "WordPress Premium", desc: "Elegant cream & luxury gold editorial", colors: ["#eab308", "#64748b"] }
                                ].map((preset) => {
                                    const isSelected = bgPreset === preset.id;
                                    return (
                                        <div
                                            key={preset.id}
                                            onClick={() => setBgPreset(preset.id)}
                                            className={`p-4 rounded-3xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                                                isSelected
                                                    ? "bg-[#1d4ed8]/10 dark:bg-blue-600/10 border-[#1d4ed8] dark:border-blue-500 scale-[1.02] shadow-sm"
                                                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors[0] }}></span>
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors[1] }}></span>
                                                </div>
                                                <h5 className="font-bold text-xs text-slate-800 dark:text-white mt-3.5 tracking-tight">{preset.label}</h5>
                                                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">{preset.desc}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold mt-3 self-start px-2 py-0.5 rounded-full ${
                                                isSelected
                                                    ? "bg-[#1d4ed8] text-white"
                                                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                            }`}>
                                                {isSelected ? "Aktif" : "Pilih"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </StatCard>

                        {/* 2. Technical Stack Card */}
                        <div className="bg-[#18223f] text-white rounded-[2rem] p-6 shadow-xl border border-slate-800 flex flex-col justify-between select-none">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight mb-2 select-none">System Parameters</h3>
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                                    Parameter teknis yang aktif dalam melayani lingkungan pengembangan lokal Anda:
                                </p>

                                <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-2xl font-mono text-[10px] text-slate-350">
                                    <p>🛡️ Cors policy: <span className="text-emerald-400">Allowed (*)</span></p>
                                    <p>🐘 Database connection: <span className="text-white">MySQL via PDO</span></p>
                                    <p>⚙️ App debug status: <span className="text-white">Active (True)</span></p>
                                    <p>🕒 Timezone set: <span className="text-white">{systemStatus?.timezone || "UTC"}</span></p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between text-[9px] font-bold text-slate-450 font-mono tracking-wider">
                                <span>PHP SERVER STATUS:</span>
                                <span className="text-emerald-400">ONLINE</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Panduan Deployment Cloud */}
            {isDeployModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
                    <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-slate-800/80 shadow-[0_24px_70px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden p-6 md:p-8 relative animate-scaleIn">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2 select-none">
                                ☁️ Cloud Deployment Guidelines
                            </h3>
                            <button
                                onClick={() => setIsDeployModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition text-2xl font-semibold cursor-pointer select-none"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-200/30">
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-1">
                                    <span>🌐</span> Frontend React Deployment (Vercel)
                                </h4>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1.5 text-slate-500 dark:text-slate-400">
                                    <li>Hubungkan akun GitHub Anda ke <span className="font-bold">Vercel</span>.</li>
                                    <li>Pilih repositori dan arahkan direktori root ke folder <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">frontend/</code>.</li>
                                    <li>Setel command build ke <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">npm run build</code> dan folder keluaran ke <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">dist</code>.</li>
                                    <li>Berkas <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">vercel.json</code> yang kami sediakan di dalam folder akan secara otomatis melayani SPA routing fallback pada rute kustom.</li>
                                </ol>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-200/30">
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-1">
                                    <span>🐳</span> Backend Laravel Deployment (Render / Railway)
                                </h4>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1.5 text-slate-500 dark:text-slate-400">
                                    <li>Buat Database MySQL di platform cloud Anda untuk mendapatkan kredensial database production.</li>
                                    <li>Buat Web Service baru di cloud, arahkan root direktori ke folder <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">backend/</code>.</li>
                                    <li>Tambahkan Environment Variables (<code className="font-mono text-[10px]">APP_KEY, DB_HOST, DB_PASSWORD, APP_ENV=production</code>, dll.) di dashboard cloud.</li>
                                    <li>Berkas <code className="bg-slate-150 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px]">Procfile</code> yang terpasang akan otomatis memicu PHP server pointing ke sub-folder <code className="font-mono text-[10px]">/public</code>.</li>
                                    <li>Tentukan command build post-deploy pada cloud Anda:
                                        <pre className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[10px] mt-2 overflow-x-auto">
                                            composer install --no-dev --optimize-autoloader && php artisan storage:link --force && php artisan migrate --force
                                        </pre>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                            <button
                                onClick={() => setIsDeployModalOpen(false)}
                                className="bg-[#1d4ed8] text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-600 active:scale-95 transition-all duration-200 text-xs shadow-md border border-blue-500 cursor-pointer select-none"
                            >
                                Tutup Panduan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}