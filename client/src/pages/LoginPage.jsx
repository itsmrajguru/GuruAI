import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import AuthLeftPanel from "../components/AuthLeftPanel";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  /* validates credentials — if valid, backend issues JWT tokens directly */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-[860px]">

        {/* left side authComponent */}
        <AuthLeftPanel />

        {/* Right Side Login Card */}
        <div className="flex-1 flex justify-center animate-fade-up">
          <div className="bg-white border border-surface-400 rounded-3xl px-9 py-4 w-full max-w-[380px] shadow-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-accent rounded-t-3xl" />

            {/* Hero section with GuruAI logo and login header */}
            <div className="mb-3">
              <h1 className="font-display text-[2rem] font-semibold text-neutral-900 -tracking-[0.02em] leading-none mb-[0.35rem]">Guru<span className="text-primary-500">AI</span></h1>
              <p className="text-sm text-surface-700 m-0">Welcome back. Please login to continue.</p>
            </div>

            {/* Displaying the login failed errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/*through this form, we will take the email and password
from the user and log them in directly */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mb-1.5">
                <label className="block text-[0.72rem] font-bold tracking-[0.09em] uppercase text-accent-500 mb-1">Email</label>
                <div className="relative">
                  <input
                    className="peer w-full bg-transparent border-none border-b-[1.5px] border-surface-500 rounded-none py-1 font-sans text-[0.9375rem] text-neutral-900 outline-none transition-colors duration-250 ease-smooth placeholder:text-surface-600"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary-500 rounded-pill" />
                </div>
              </div>

              <div className="mb-1.5">
                <label className="block text-[0.72rem] font-bold tracking-[0.09em] uppercase text-accent-500 mb-1">Password</label>
                <div className="relative">
                  <input
                    className="peer w-full bg-transparent border-none border-b-[1.5px] border-surface-500 rounded-none py-1 font-sans text-[0.9375rem] text-neutral-900 outline-none transition-colors duration-250 ease-smooth placeholder:text-surface-600 pr-8"
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    minLength={6}
                  />
                  {/* lets add the circular Loading ring In the button section With the help of SVG image And at a line and points*/}
                  <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-1 flex" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a7045" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a7045" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary-500 rounded-pill" />
                </div>
              </div>

              {/*Option for the user to change the password */}
              <div className="flex justify-end -mt-1 mb-4">
                <Link to="/forgot-password" title="Forgot password?" className="text-[0.72rem] font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider">
                  Forgot password?
                </Link>
              </div>

              {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
              <button type="submit" className="w-full bg-neutral-900 border-none rounded-xl py-2.5 px-6 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 transition-all duration-250 ease-smooth hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</>
                ) : (
                  <>Login<span className="bg-white/20 rounded-full p-0.5 ml-1 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></>
                )}
              </button>
            </form>


            {/*Option for the user to jump signup page */}
            <p className="text-center mt-2 text-sm text-surface-700 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">Create Account</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}