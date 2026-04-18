import { useState, useContext } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import authContext from "../context/authContext";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const { setUsername, setPassword, username, password, loginAccount, loading } = useContext(authContext);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <img 
          className="h-full w-full object-cover object-center md:object-bottom-right grayscale-10 brightness-[0.9]" 
          src="/image/escr-bg.jpg" 
          alt="Background"
          draggable={false} 
        />
        <div className="absolute inset-0 bg-black/20 md:hidden"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        
        <div className="w-full max-w-md transform transition-all duration-300 backdrop-blur-md bg-white/90 flex flex-col border border-white/40 shadow-2xl rounded-2xl p-6 sm:p-10">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-[#c43c2d] rounded-t-2xl"></div>

          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="flex items-baseline gap-2">
              <h2 className="font-semibold text-xl sm:text-2xl text-gray-700">Welcome to</h2>
              <h1 className="font-black text-4xl sm:text-5xl text-[#c43c2d] tracking-tighter">EAST</h1>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center">ESCR - Attendance Management System</p>
            <div className="h-1 sm:h-2 bg-gray-200 mt-4 w-full rounded-full overflow-hidden">
               <div className="h-full bg-Hnav w-full"></div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5 sm:gap-6 w-full">
            
            {/* Username Field */}
            <div className="relative group">
              <input 
                type="text" 
                id="username" 
                placeholder=" " 
                className="peer w-full border-b-2 border-gray-300 py-2 pt-4 focus:border-[#c43c2d] outline-none transition-colors bg-transparent placeholder-transparent text-gray-800"
                autoComplete="off"
                onChange={(e) => setUsername(e.currentTarget.value)}
                value={username}
              />
              <label 
                htmlFor="username"
                className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-focus:-top-1 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:text-[#c43c2d] peer-focus:text-sm select-none pointer-events-none"
              >
                Enter username account
              </label>
              <FaUser className="absolute right-2 top-4 text-gray-400 group-focus-within:text-[#c43c2d] transition-colors" />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input 
                type={showPass ? "text" : "password"} 
                id="password" 
                placeholder=" " 
                className="peer w-full border-b-2 border-gray-300 py-2 pt-4 focus:border-[#c43c2d] outline-none transition-colors bg-transparent placeholder-transparent text-gray-800"
                autoComplete="off"
                onChange={(e) => setPassword(e.currentTarget.value)}
                value={password}
              />
              <label 
                htmlFor="password"
                className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-1 peer-focus:text-[#c43c2d] peer-focus:text-sm select-none pointer-events-none"
              >
                Enter account password
              </label>
              
              <div className="absolute right-8 top-4 flex gap-3"></div>
              
              {password.length > 0 
              ? (
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 absolute right-2 top-4 hover:text-[#c43c2d] transition-colors"
                >
                  {!showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              )
              : <TbPassword className="absolute right-2 top-4 text-gray-400 group-focus-within:text-[#c43c2d] transition-colors" />
              }
              
            </div>

            <div className="flex justify-end">
              <span href="#" className="text-[10px] sm:text-xs text-right font-medium text-gray-600 hover:text-[#c43c2d] transition-colors">
                Forgot password? Contact Administrator
              </span>
            </div>

            <button 
              className="w-full bg-[#c43c2d] py-3 sm:py-4 text-white font-bold uppercase rounded-xl shadow-lg shadow-red-200 hover:bg-[#a32e22] active:scale-[0.98] transition-all mt-4 cursor-pointer"
              onClick={() => loginAccount()}
            >
              {loading
                ? "Logging in..."
                : "Log In"} 
            </button>
            <span className="text-xs font-medium text-slate-500 hover:text-[#c43c2d]">
              Need an account? 
              Contact School Administrator
            </span>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-8 sm:mt-10">
            © 2026 ESCR System • Secure Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;