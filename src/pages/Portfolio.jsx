import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const presetStyles = {
    aurora: {
        name: "Classic Aurora",
        bg: "from-[#f0f4f8] via-[#e2eaf0] to-[#d6e0ea] dark:from-[#0b0f19] dark:via-[#0f111a] dark:to-[#171d2c]",
        blob1: "bg-blue-500/10 dark:bg-blue-600/5",
        blob2: "bg-purple-500/10 dark:bg-purple-600/5",
        indicator: "from-blue-400 to-purple-400",
    },
    cosmic: {
        name: "Cosmic Night",
        bg: "from-[#f5f3ff] via-[#e0e7ff] to-[#ddd6fe] dark:from-[#090514] dark:via-[#0c0d1c] dark:to-[#170a25]",
        blob1: "bg-indigo-500/10 dark:bg-indigo-500/5",
        blob2: "bg-pink-500/10 dark:bg-pink-500/5",
        indicator: "from-indigo-400 to-pink-400",
    },
    emerald: {
        name: "Emerald Oasis",
        bg: "from-[#f0f9ff] via-[#ecfdf5] to-[#d1fae5] dark:from-[#06100e] dark:via-[#0a1614] dark:to-[#0d221c]",
        blob1: "bg-teal-500/10 dark:bg-teal-500/5",
        blob2: "bg-emerald-500/10 dark:bg-emerald-500/5",
        indicator: "from-teal-400 to-emerald-400",
    },
    sunset: {
        name: "Sunset Horizon",
        bg: "from-[#fff7ed] via-[#fef3c7] to-[#ffedd5] dark:from-[#1c0d02] dark:via-[#1e1004] dark:to-[#2b1706]",
        blob1: "bg-amber-500/10 dark:bg-amber-500/5",
        blob2: "bg-rose-500/10 dark:bg-rose-500/5",
        indicator: "from-amber-400 to-rose-400",
    },
    wordpress: {
        name: "WordPress Premium",
        bg: "from-[#fbfbf9] via-[#f5f5f0] to-[#eaeae3] dark:from-[#0c0d0e] dark:via-[#111213] dark:to-[#151719]",
        blob1: "bg-amber-500/5 dark:bg-amber-600/5",
        blob2: "bg-slate-500/5 dark:bg-slate-700/5",
        indicator: "from-amber-500 to-slate-400",
    }
};

export default function Portfolio() {
    const navigate = useNavigate();

    // Theme state synchronization
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // Background Preset state synchronization (matches the dashboard background selected in console)
    const [bgPreset, setBgPreset] = useState(() => {
        return localStorage.getItem("bgPreset") || "aurora";
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setBgPreset(localStorage.getItem("bgPreset") || "aurora");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const currentPreset = presetStyles[bgPreset] || presetStyles.aurora;

    // Simulated Contact Form state
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
        }, 3000);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentPreset.bg} text-slate-800 dark:text-slate-100 transition-all duration-300 font-sans relative overflow-hidden`}>
            
            {/* Ambient Background Mesh Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={`absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full ${currentPreset.blob1} blur-[130px] transition-all duration-500`}></div>
                <div className={`absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full ${currentPreset.blob2} blur-[130px] transition-all duration-500`}></div>
            </div>
 
             {/* 1. Header/Navbar */}
             <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/50 dark:border-phoenix-border-dark relative z-10 select-none">
                 <div className="flex items-center gap-2.5 cursor-default">
                     <div className="w-8 h-8 bg-[#3874ff] rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20 transform hover:rotate-6 transition-all duration-300">
                         L
                     </div>
                     <span className="font-extrabold text-base tracking-widest text-slate-800 dark:text-white uppercase font-sans">
                         Lone.dev
                     </span>
                 </div>
 
                 <div className="flex items-center gap-6">
                     <a href="#skills" className="hidden sm:inline-block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition uppercase tracking-wider">
                         Skills
                     </a>
                     <a href="#projects" className="hidden sm:inline-block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition uppercase tracking-wider">
                         Showcase
                     </a>
                     <a href="#services" className="hidden sm:inline-block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition uppercase tracking-wider">
                         Services
                     </a>
 
                     {/* Theme Controller */}
                     <button
                         onClick={toggleTheme}
                         className="p-2 rounded-xl bg-white dark:bg-[#101424] border border-slate-200/60 dark:border-phoenix-border-dark hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 shadow-sm transition-all duration-200 cursor-pointer text-slate-700 dark:text-yellow-400 text-xs"
                         title={theme === "light" ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"}
                     >
                         {theme === "light" ? "🌙" : "☀️"}
                     </button>

 
                     {/* Console Gateway Button */}
                     <button
                         onClick={() => navigate("/login")}
                         className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-phoenix-border-dark px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all"
                     >
                         Sign In
                     </button>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center relative z-10 animate-fadeIn">
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold border border-emerald-200/50 dark:border-emerald-900/30 tracking-wider uppercase mb-8 shadow-sm select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available for Freelance & Remote Work (USD)
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase font-sans leading-tight">
                    Crafting High-Performance <br />
                    <span className="bg-gradient-to-r from-[#3874ff] to-[#a855f7] bg-clip-text text-transparent">Full-Stack SaaS</span> Systems
                </h1>
                
                <p className="mt-6 text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
                    Saya membantu klien global membangun aplikasi web satu halaman (SPA) berbasis React 19 yang premium, cepat, dan aman, yang terintegrasi secara mulus dengan RESTful API backend Laravel 12.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <a
                        href="#projects"
                        className="bg-[#3874ff] hover:bg-blue-600 text-white font-bold px-7 py-3 rounded-xl active:scale-[0.98] transition-all duration-200 text-[11px] uppercase tracking-widest shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                        Explore My Work
                    </a>
                    <a
                        href="#contact"
                        className="bg-white dark:bg-[#101424] hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-phoenix-border-dark font-bold px-7 py-3 rounded-xl active:scale-[0.98] transition-all duration-200 text-[11px] uppercase tracking-widest shadow-sm cursor-pointer"
                    >
                        Hire Me (Upwork)
                    </a>
                </div>
            </section>

            {/* 3. Skills Dashboard Section */}
            <section id="skills" className="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-200/50 dark:border-phoenix-border-dark/50">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Tech Stack & Expertise</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Sistem keahlian utama berskala global</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Frontend Card */}
                    <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-[#3874ff] dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-lg select-none mb-5">
                            ⚛️
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3">Frontend Architecture</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-4">
                            Pengembangan antarmuka berkecepatan tinggi yang responsif dan interaktif.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React 19", "Vite", "Tailwind CSS v4", "SPA", "JSX", "Axios"].map(s => (
                                <span key={s} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-phoenix-border-dark text-[8.5px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-wide">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Backend Card */}
                    <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/20 text-[#a855f7] dark:text-purple-400 rounded-xl flex items-center justify-center font-bold text-lg select-none mb-5">
                            ⚙️
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3">Backend Engine</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-4">
                            Pembangunan RESTful API tangguh yang terproteksi keamanan siber ketat.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Laravel 12", "PHP 8.x", "Sanctum Auth", "REST API", "Database Resource"].map(s => (
                                <span key={s} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-phoenix-border-dark text-[8.5px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-wide">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* DevOps & Database Card */}
                    <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-[#222e45] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg select-none mb-5">
                            💾
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3">Database & Deploy</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-4">
                            Integrasi basis data relasional MySQL teroptimasi dan deployment awan berkelanjutan.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["MySQL Schema", "Git Control", "Vercel", "Railway", "Environment Variables"].map(s => (
                                <span key={s} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-phoenix-border-dark text-[8.5px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-wide">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Featured Work Section (Gallery) */}
            <section id="projects" className="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-200/50 dark:border-phoenix-border-dark/50">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Featured Showcase</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Galeri proyek operasional siap saji</p>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                    
                    {/* Prime Project Card (Dashboard - Occupies 7 cols) */}
                    <div className="md:col-span-7 bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-[#222e45] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-[390px] relative overflow-hidden transition-all duration-300">
                        {/* Interactive glow effect in background */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
                        
                        <div>
                            <div className="flex justify-between items-center select-none">
                                <span className="text-[8px] bg-blue-50 dark:bg-blue-900/20 text-[#3874ff] dark:text-blue-400 px-3 py-1 rounded-full font-black uppercase border border-blue-200/50 dark:border-blue-900/30 tracking-widest font-mono">
                                    Featured Project
                                </span>
                                <span className="text-[7.5px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-emerald-500/30">
                                    Fully Functional
                                </span>
                            </div>

                            <h3 className="text-xl font-black mt-5 text-slate-900 dark:text-white tracking-tight uppercase font-sans">
                                Lonefolio SaaS Admin Portal
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-3">
                                Sistem manajemen otentikasi siber dengan layout Lone Admin premium. Terintegrasi secara riil menggunakan Laravel Sanctum JWT Token. Dilengkapi dengan deteksi server health check dan visualisasi grafik pertumbuhan data.
                            </p>

                            <div className="flex flex-wrap gap-2.5 mt-5 font-mono text-[9px] text-slate-500 dark:text-slate-500 font-bold select-none">
                                <span>#React19SPA</span>
                                <span>•</span>
                                <span>#Laravel12Sanctum</span>
                                <span>•</span>
                                <span>#MySQLSchema</span>
                            </div>
                        </div>

                        {/* Interactive Launch Button */}
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#3874ff] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl active:scale-[0.98] transition-all duration-200 text-[10px] uppercase tracking-widest shadow-sm cursor-pointer border-0 flex items-center justify-center gap-2"
                        >
                            Launch Console (Live Demo) 🚀
                        </button>
                    </div>

                    {/* Sidebar Simulated Projects Stack (Occupies 5 cols) */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Mini Project 2 */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-[#222e45] p-5 rounded-2xl shadow-sm hover:translate-y-[-2px] transition duration-200">
                            <span className="text-[8px] bg-purple-50 dark:bg-purple-900/20 text-[#a855f7] dark:text-purple-400 px-2.5 py-0.5 rounded-full font-extrabold uppercase border border-purple-200/35 tracking-wider font-mono">
                                Laravel Engine
                            </span>
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mt-2.5">
                                ZenStore RESTful E-Commerce API
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                                Skema API e-commerce tangguh dengan penanganan keranjang, transaksi stripe, invoice, dan caching Redis terenkripsi.
                            </p>
                        </div>

                        {/* Mini Project 3 */}
                        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-[#222e45] p-5 rounded-2xl shadow-sm hover:translate-y-[-2px] transition duration-200">
                            <span className="text-[8px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold uppercase border border-emerald-200/35 tracking-wider font-mono">
                                WebSockets SPA
                            </span>
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mt-2.5">
                                Nexus Real-Time Chat Engine
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                                Aplikasi pesan instan multi-room menggunakan React dan WebSockets dengan performa latensi kurang dari 10ms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Freelance Services Section */}
            <section id="services" className="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-200/50 dark:border-phoenix-border-dark/50">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Freelance Services</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Layanan premium untuk pasar internasional</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        ["🖥️ Custom Dashboards", "Pembangunan dashboard admin interaktif collapsible yang terintegrasi penuh ke database API."],
                        ["🔒 Secured API Systems", "Merancang arsitektur RESTful API super kokoh dilindungi Sanctum JWT Token dan Form Request."],
                        ["⚡ SPA Migrations", "Migrasi web model lama menjadi Single Page Application React yang modern, fluid, dan berkecepatan ultra."]
                    ].map(([title, desc]) => (
                        <div key={title} className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark p-6 rounded-2xl shadow-sm transition hover:scale-[1.01]">
                            <h4 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase tracking-wide mb-2.5">{title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Interactive Contact Card Form (Upwork Board) */}
            <section id="contact" className="max-w-4xl mx-auto px-6 py-16 pb-28 relative z-10 border-t border-slate-200/50 dark:border-phoenix-border-dark/50">
                <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 md:p-10 shadow-xl grid md:grid-cols-12 gap-8 items-center transition duration-300">
                    
                    {/* Left: Contact Info Info */}
                    <div className="md:col-span-5 select-none text-left">
                        <p className="text-[9px] uppercase tracking-widest text-[#3874ff] font-bold font-mono">
                            Get In Touch
                        </p>
                        <h3 className="mt-3 text-2xl font-black uppercase text-slate-800 dark:text-white leading-tight font-sans">
                            Let's Build Something Great
                        </h3>
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                            Apakah Anda memiliki gagasan SaaS Dashboard baru atau memerlukan sistem Laravel REST API siber? Hubungi saya hari ini untuk penawaran menarik!
                        </p>
                        <div className="mt-6 space-y-2.5 font-mono text-[9.5px] text-slate-400 dark:text-slate-500 font-extrabold">
                            <p className="flex items-center gap-2"><span>📧</span> contact@lone.dev</p>
                            <p className="flex items-center gap-2"><span>🌎</span> Jakarta, Indonesia (GMT+7)</p>
                            <p className="flex items-center gap-2"><span>💼</span> Available for Upwork Remote Contracts</p>
                        </div>
                    </div>

                        <div className="md:col-span-7">
                        {formSubmitted ? (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-6 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30 text-center font-bold text-xs select-none animate-fadeIn">
                                🚀 Message successfully sent! <br />
                                <span className="font-medium text-[10px] mt-1.5 inline-block text-slate-500">I will reply within 12 hours. Thank you!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Your Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-3.5 py-2.5 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-bold focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Your Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="client@company.com" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-3.5 py-2.5 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-bold focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Project Requirements</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder="Describe your SaaS project..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-phoenix-border-dark rounded-xl px-3.5 py-2.5 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 font-bold focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-[#3874ff] transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#3874ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all text-xs uppercase tracking-widest shadow-sm cursor-pointer border-0"
                                >
                                    Send Message 📧
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
