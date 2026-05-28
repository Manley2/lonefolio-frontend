import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/login", { email, password });
            localStorage.setItem("token", response.data.data.token);
            navigate("/dashboard");
        } catch (error) {
            alert("Login gagal. Periksa email dan password.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-phoenix-bg-dark flex items-center justify-center p-6 text-slate-900 dark:text-slate-100 transition-all duration-300 relative overflow-hidden">
            {/* Soft background ambient mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-400/5 dark:bg-blue-600/5 blur-[120px]"></div>
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-400/5 dark:bg-purple-600/5 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-5xl bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark shadow-xl rounded-2xl overflow-hidden p-6 md:p-8 grid md:grid-cols-12 gap-6 md:gap-8 z-10 animate-fadeIn">
                
                {/* Left Side: SaaS Info Block */}
                <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-phoenix-border-dark rounded-xl p-8 md:p-10 text-slate-800 dark:text-white select-none">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#3874ff] font-bold font-mono">
                            Enterprise Console
                        </p>
                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-800 dark:text-white uppercase font-sans">
                            Lone Auth
                        </h1>
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                            Aplikasi autentikasi modern berbasis Laravel API, React, Sanctum Token, protected routes, dan role management.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#141824] border border-slate-200/40 dark:border-phoenix-border-dark p-4 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                        ⚡ Diotentikasi secara aman menggunakan Laravel Sanctum Bearer Token dan dilindungi dengan middleware otorisasi berbasis peran di backend.
                    </div>
                </div>

                {/* Right Side: Form Block */}
                <div className="md:col-span-7 flex flex-col justify-center p-4 md:p-8 relative">
                    {/* Back button */}
                    <button 
                        onClick={() => navigate("/")}
                        className="absolute top-0 right-4 md:right-8 p-2 text-[9px] font-extrabold text-[#3874ff] hover:text-blue-600 transition cursor-pointer select-none bg-blue-50 dark:bg-blue-955/20 border border-blue-100 dark:border-blue-900/30 rounded-xl uppercase tracking-wider shadow-sm active:scale-95"
                    >
                        ← Back to Portfolio
                    </button>

                    <div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase font-sans">
                            Sign In
                        </h2>
                        <p className="mt-2 text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Login untuk masuk ke dashboard portal.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <div>
                            <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full bg-[#3874ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all duration-200 text-xs uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Belum punya akun?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="font-black text-[#3874ff] dark:text-blue-450 hover:underline cursor-pointer uppercase tracking-wider"
                        >
                            Daftar Sekarang
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}