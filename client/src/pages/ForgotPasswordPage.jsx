import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";
import AuthLeftPanel from "../components/AuthLeftPanel";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* This function call the forgotPassword axios,and just returns
    the response coming from the server,whether it may be error or success */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await forgotPassword(email);
            setMessage(res.message || "Password reset link sent to your email.");
            setEmail("");
        } catch (err) {
            setError(err.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-4 relative overflow-hidden font-sans">
            <div className="relative z-10 flex items-center gap-8 w-full max-w-[860px]">
                {/* left side authPanel*/}
                <AuthLeftPanel />

                {/* Right side forgotpassword Card */}
                <div className="flex-1 flex justify-center animate-fade-up">
                    <div className="bg-white border border-surface-400 rounded-3xl px-9 py-4 w-full max-w-[380px] shadow-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-accent rounded-t-3xl"/>
                        
                        {/* Hero section with guruAI logo and Forgot Password */}
                        <div className="mb-3">
                            <h1 className="font-display text-[2rem] font-semibold text-neutral-900 -tracking-[0.02em] leading-none mb-[0.35rem]">Guru<span className="text-primary-500">AI</span></h1>
                            <p className="text-sm text-surface-700 m-0">Forgot Password ?<br/><span className="text-xs">Enter your email to receive a reset link</span></p>
                        </div>

                        {/*Remainder :We need to add toaster from shadsn-ui,
to display the actual error as a popup */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-3 text-sm font-semibold text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-3 text-sm font-semibold text-center">
                                {message}
                            </div>
                        )}

                        {/*thorugh this form, we will take the email,
from the user and if email valid, take him to reset-password page */}
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <div className="mb-1.5">
                                <label className="block text-[0.72rem] font-bold tracking-[0.09em] uppercase text-accent-500 mb-2">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="peer w-full bg-transparent border-none border-b-[1.5px] border-surface-500 rounded-none py-1 font-sans text-[0.9375rem] text-neutral-900 outline-none transition-colors duration-250 ease-smooth placeholder:text-surface-600"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary-500 rounded-pill"/>
                                </div>
                            </div>
                            
                            {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-neutral-900 border-none rounded-xl py-3 px-6 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 transition-all duration-250 ease-smooth hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                            >
                                {loading ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending...</>
                                ) : (
                                    <>Send Reset Link<span className="bg-white/20 rounded-full p-0.5 ml-1 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></>
                                )}
                            </button>
                        </form>

                        {/*If the user remembers the password,
then it can return to the login page, from here */}
                        <div className="text-center mt-2 text-sm text-surface-700 font-medium">
                            Remember your password?{" "}
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
