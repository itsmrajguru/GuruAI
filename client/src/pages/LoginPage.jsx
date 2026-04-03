import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-[#f0fbfe] font-sans">
      <div className="flex-1 flex items-center justify-center px-4 w-full py-12">
        <div className="w-full max-w-md relative z-10">
        {/* adding feature-card for consistent layout matched with home page */}
        <div className="feature-card p-10 w-full">

          {/* Hero section with GuruAI logo and login header */}
          <div className="text-center mb-8">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-16 w-16 rounded-full mx-auto mb-4 object-cover"
            />
            <span className="text-2xl font-black text-neutral-800 tracking-tight block">
              Guru<span className="text-primary-500">AI</span>
            </span>
            <p className="text-neutral-400 mt-2 text-sm font-medium">
              Welcome back! Please login to continue.
            </p>
          </div>

          {/* Displaying the login failed errors */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          {/*through this form, we will take the email and password
from the user and log them in directly */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/*Option for the user to change the password */}
            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>
            {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
            {/* updating the button to use the new btn-primary class */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-4 w-full py-3.5 text-base"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/*Option for the user to jump signup page */}
          <div className="text-center mt-8 text-sm text-neutral-400 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
);
}
