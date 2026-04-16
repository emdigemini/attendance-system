import { useContext } from "react"
import adminContext from "../context/admin/adminContext"

const LoginPage = () => {
  const { setUsername, setPassword, username, password, loginAdmin, loading } = useContext(adminContext);

  return (
    <div className={`${loading ? "cursor-progress" : "cursor-default"} min-h-screen w-full relative overflow-x-hidden`}>
      {/* Background Section */}
      <div className="fixed top-0 left-0 h-full w-full">
        <img 
          className="h-full w-full object-cover object-center grayscale-[0.2] brightness-[0.8]" 
          draggable={false}
          src="/image/escr-bg.jpg" 
          alt="ESCR Background" 
        />
      </div>

      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        <div className="relative z-10 w-full max-w-100 backdrop-blur-2xl bg-white/10 lg:bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden rounded-sm">
          
          <div className="h-1.5 w-full bg-red-700"></div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
                ADMIN<span className="text-yellow-400">PORTAL</span>
              </h1>
              <div className="h-0.5 w-12 bg-yellow-400 mt-1"></div>
              <p className="text-[10px] sm:text-[11px] text-red-500 mt-4 uppercase tracking-[0.2em] font-semibold">
                East Systems Colleges of Rizal
              </p>
            </div>

            <form 
              className="space-y-6" 
              onSubmit={(e) => { e.preventDefault(); loginAdmin(); }}
            >
              <div className="group">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1 block group-focus-within:text-red-500 transition-colors">
                  Access ID
                </label>
                <input 
                  type="text" 
                  placeholder="ADMIN_USER" 
                  autoComplete="username"
                  className="w-full bg-black/40 border-b border-white/30 p-2 text-white placeholder-white/20 outline-none focus:border-red-600 transition-all duration-300 font-mono tracking-widest text-sm"
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  value={username}
                />
              </div>
              
              <div className="group">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1 block group-focus-within:text-red-500 transition-colors">
                  Security Key
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  className="w-full bg-black/40 border-b border-white/30 p-2 text-white placeholder-white/20 outline-none focus:border-red-600 transition-all duration-300 font-mono tracking-widest text-sm"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  value={password}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-red-700 hover:bg-red-600 disabled:bg-gray-700 text-white text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase transition-all cursor-pointer duration-300 group mt-2 overflow-hidden shadow-lg"
              >
                <span className="relative z-10">
                  {loading ? "Processing..." : "Authorize Access"}
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </form>

            {/* Footer Section */}
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-6">
              <span className="text-[9px] text-gray-400 uppercase tracking-tighter order-2 sm:order-1">
                System v1.0.0
              </span>
              <a href="#" className="text-[9px] text-red-500 uppercase font-bold text-center sm:text-end hover:text-red-400 transition-colors order-1 sm:order-2">
                Please contact your developer 
                <br className="hidden sm:block" /> for an admin reset.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage