import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifySignupOtp } from "../api";

export default function VerifySignupOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* extract the email passed from SignupPage via navigation state */
  const location = useLocation();
  const email = location.state?.email;

  /* if user lands here without going through signup, send them back */
  if (!email) {
    navigate("/signup");
    return null;
  }

  /* This function verifies the OTP sent to the user's email during signup */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //step 1 : call the verifySignupOtp api with email and otp
      const data = await verifySignupOtp(email, otp);

      if (data && data.success) {
        //step 2 : on success, redirect to login page
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError(err.response?.data?.message || err.message || "Verification failed. Please try again.");
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

            {/* Hero section with GuruAI logo and OTP header */}
            <div className="text-center mb-8">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-16 w-16 rounded-full mx-auto mb-4 object-cover"
              />
              <span className="text-2xl font-black text-neutral-800 tracking-tight block">
                Career<span className="text-primary-500">Sync</span>
              </span>
              <p className="text-neutral-400 mt-2 text-sm font-medium">
                We sent a 6-digit code to <span className="font-bold text-neutral-600">{email}</span>
              </p>
            </div>

            {/* Displaying the OTP verification errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/*through this form, the user will enter the OTP received on their email
and after verification they will be redirected to the login page */}
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm text-center tracking-[0.5em] text-xl"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  placeholder="000000"
                  autoFocus
                />
                <p className="text-xs text-neutral-400 text-center mt-1">Check your email inbox. Code expires in 10 minutes.</p>
              </div>

              {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
              {/* updating the button to use the new btn-primary class */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? "Verifying..." : "Verify & Complete Signup"}
              </button>

              {/*Option for the user to go back to signup page */}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-xs font-bold text-neutral-400 hover:text-primary-500 transition-colors text-center"
              >
                ← Back to Sign Up
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
