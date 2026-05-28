import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            alert("Register berhasil! Silakan login.");
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Registrasi gagal. Pastikan data terisi dengan benar (password minimal 8 karakter).");
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
                            Join System
                        </p>
                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-800 dark:text-white uppercase font-sans">
                            Create Account
                        </h1>
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                            Mulai petualangan portofolio Anda. Daftarkan akun baru untuk mendapatkan token otorisasi Laravel Sanctum secara otomatis.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#141824] border border-slate-200/40 dark:border-phoenix-border-dark p-4 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                        ⚡ Seluruh informasi registrasi akan diamankan menggunakan algoritme enkripsi satu arah BCRYPT berkekuatan tinggi sebelum disimpan ke MySQL.
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
                            Sign Up
                        </h2>
                        <p className="mt-2 text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Daftarkan akun portofolio baru Anda.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-3.5 rounded-xl text-xs border border-red-100 dark:border-red-900/30 font-bold font-mono">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="mt-6 space-y-4">
                        <div>
                            <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-555 uppercase tracking-widest font-mono">
                                    Confirmation
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-4 py-3 outline-none text-xs text-slate-855 dark:text-white placeholder-slate-450 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full bg-[#3874ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all duration-200 text-xs uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Sudah punya akun?{" "}
                        <button
                            onClick={() => navigate("/")}
                            className="font-black text-[#3874ff] dark:text-blue-450 hover:underline cursor-pointer uppercase tracking-wider"
                        >
                            Masuk Di Sini
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}