export default function ProfileCard({
    user,
    avatarUploading,
    fileInputRef,
    handleAvatarChange,
    setIsEditProfileOpen,
    toggleDevRole,
}) {
    return (
        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[380px] transition-all duration-300">
            <div>
                {/* Modern square avatar wrapper with clean border */}
                <div className="relative group overflow-hidden rounded-2xl p-1 bg-slate-100 dark:bg-slate-900 aspect-square flex items-center justify-center border border-slate-200/60 dark:border-phoenix-border-dark">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-950 relative flex items-center justify-center">
                        {user?.avatar_url ? (
                            <img 
                                src={user.avatar_url} 
                                alt={user.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="text-5xl font-black text-white tracking-wider drop-shadow-lg select-none bg-gradient-to-br from-slate-800 to-slate-950 w-full h-full flex items-center justify-center">
                                {user?.name?.charAt(0) || "F"}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] opacity-100 group-hover:opacity-0 transition-all duration-300 pointer-events-none"></div>
                        
                        {/* Edit Photo Hover Overlay */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer text-white font-sans text-xs font-bold gap-1.5 rounded-xl select-none"
                            title="Ubah Foto Profil"
                        >
                            <span className="text-xl">📷</span>
                            <span>Edit Photo</span>
                        </div>

                        {avatarUploading && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                />

                <h2 className="text-2xl font-black mt-5 text-slate-800 dark:text-white truncate tracking-tight uppercase font-sans">{user?.name || "Developer"}</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs truncate font-semibold mt-1 font-mono">{user?.email}</p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-phoenix-border-dark px-4 py-2.5 rounded-xl text-xs text-center font-bold capitalize text-slate-500 dark:text-slate-400 tracking-widest select-none">
                    Role: <span className="text-[#3874ff] dark:text-blue-400 font-extrabold">{user?.role}</span>
                </div>
                <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-full bg-[#3874ff] text-white font-bold py-2.5 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-0"
                >
                    ✏️ Edit Profile
                </button>
                <button
                    onClick={toggleDevRole}
                    className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-bold py-2.5 rounded-xl active:scale-[0.98] transition-all duration-200 text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border border-slate-200 dark:border-phoenix-border-dark"
                >
                    🔄 Switch to {user?.role === "admin" ? "User" : "Admin"}
                </button>
            </div>
        </div>
    );
}

