import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api";


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* This function calls the SignUpPage axios*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signupUser({ email, password });
      if (data && data.success) {
        setError("");
        /* redirect to the OTP verification page, passing email via navigation state
        so VerifySignupOtpPage knows which email to verify */
        navigate("/verify-signup-otp", { state: { email } });
      } else {
        setError(data.message || "Signup failed. Please check your details.");
      }
    } catch (err) {
      console.error("Signup Flow Error:", err);
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0fbfe] font-sans">
      <div className="flex-1 flex items-center justify-center px-4 w-full py-12">
        <div className="w-full max-w-md relative z-10">
          {/* adding feature-card class to match with home page dynamic ui */}
          <div className="feature-card p-10 w-full">

            {/* Hero section with GuruAI logo and Signup header*/}
            <div className="text-center mb-8">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-16 w-16 rounded-full mx-auto mb-4 object-cover"
              />
              <span className="text-2xl font-black text-neutral-800 tracking-tight block">
                Guru<span className="text-primary-500">AI</span>
              </span>
              <p className="text-neutral-400 mt-2 text-sm font-medium">Sign up to find your next opportunity.</p>
            </div>

            {/* Displaying the login failed errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/*through these 3 inputs, data will be sent to the axios and 
finally to databases via backend */}
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
                  placeholder="Enter your email address"
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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  minLength={6}
                />
                <p className="text-[10px] text-neutral-400 ml-1">Minimum 6 characters required</p>
              </div>
              {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
              {/* changing this to btn-primary to have consistent animations */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-4 w-full py-3.5 text-base"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            {/*Option for the user to jump LoginPage page */}
            <div className="text-center mt-8 text-sm text-neutral-400 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
