import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifySignupOtp } from "../api";
import AuthLeftPanel from "../components/AuthLeftPanel";

export default function VerifySignupOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* extract the email passed from SignupPage via navigation state */
  const location = useLocation();
  const email = location.state?.email;

  /* This is the important condition we are checking Here if suppose
  a user directly routes The verifyotppage and enters any random
  email then that email will not be verified because it is not taken
  from the sign up page and This user will be redirected to the signup
  page directly  */

  if (!email) {
    navigate("/signup");
    return null
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
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-4 relative overflow-hidden font-sans">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-[860px]">
        {/* left side authComponent */}
        <AuthLeftPanel />

        {/* Right side Login Card */}
        <div className="flex-1 flex justify-center animate-fade-up">
          <div className="bg-white border border-surface-400 rounded-3xl px-9 py-4 w-full max-w-[380px] shadow-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-accent rounded-t-3xl" />

            {/* Hero section with GuruAI logo and OTP header */}
            <div className="mb-3">
              <h1 className="font-display text-[2rem] font-semibold text-neutral-900 -tracking-[0.02em] leading-none mb-[0.35rem]">Guru<span className="text-primary-500">AI</span></h1>
              <p className="text-sm text-surface-700 m-0">
                We sent a 6-digit code to <span className="font-bold text-neutral-800">{email}</span>
              </p>
            </div>

            {/* Displaying the OTP verification errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-3 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/*through this form, the user will enter the OTP received on their email
and after verification they will be redirected to the login page */}
            <form onSubmit={handleOtpSubmit} className="flex flex-col">
              <div className="mb-1.5">
                <label className="block text-[0.72rem] font-bold tracking-[0.09em] uppercase text-accent-500 mb-2 text-center">Enter OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="peer w-full bg-transparent border-none border-b-[1.5px] border-surface-500 rounded-none py-1 font-sans text-[1.25rem] font-semibold text-neutral-900 outline-none transition-colors duration-250 ease-smooth placeholder:text-surface-600 text-center tracking-[0.5em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="000000"
                    autoFocus
                  />
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary-500 rounded-pill" />
                </div>
                <p className="text-xs text-surface-600 text-center mt-3">Check your email inbox. Code expires in 10 minutes.</p>
              </div>

              {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
              {/* updating the button to use the new btn-primary class */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-neutral-900 border-none rounded-xl py-3 px-6 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 transition-all duration-250 ease-smooth hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                ) : (
                  <>Verify & Complete Signup<span className="bg-white/20 rounded-full p-0.5 ml-1 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></>
                )}
              </button>

              {/*Option for the user to go back to signup page */}
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[0.72rem] font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </form>

            {/*Option for the user to jump LoginPage page */}
            <div className="flex items-center gap-[10px] my-2 before:content-[''] before:flex-1 before:h-[1px] before:bg-surface-400 after:content-[''] after:flex-1 after:h-[1px] after:bg-surface-400"><span className="text-[0.65rem] font-bold uppercase tracking-widest text-surface-600">or</span></div>
            <p className="text-center mt-0 text-sm text-surface-700 font-medium">
              Already have an account?{" "}
              <Link to="/login" title="Login" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
