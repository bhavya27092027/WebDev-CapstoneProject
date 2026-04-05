import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, ShieldCheck, Clock } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white font-[Inter]">

            <nav className="flex justify-between items-center px-10 py-6">
                <h1 className="text-2xl font-bold font-[Poppins] tracking-wide">
                    CabPortal
                </h1>

                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 rounded-full border border-white/30 hover:bg-white hover:text-black transition"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="px-5 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                        Register
                    </button>
                </div>
            </nav>

            <section className="text-center mt-24 px-6">
                <h1 className="text-5xl md:text-6xl font-bold font-[Poppins] leading-tight mb-6">
                    Book Smarter. Travel Better.
                </h1>

                <p className="text-gray-400 max-w-xl mx-auto text-lg mb-10">
                    A seamless platform for companies and vendors to manage cab bookings efficiently and effortlessly.
                </p>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => navigate("/register")}
                        className="px-7 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition"
                    >
                        Get Started
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="px-7 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition"
                    >
                        Login
                    </button>
                </div>
            </section>

            <section className="mt-28 px-10">
                <h2 className="text-3xl font-bold text-center font-[Poppins] mb-12">
                    Powerful Features
                </h2>

                <div className="grid md:grid-cols-3 gap-10">

                    <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition">
                        <Car className="w-8 h-8 mb-4 text-indigo-400" />
                        <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
                        <p className="text-gray-400">
                            Quickly create and manage bookings with a clean interface.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition">
                        <ShieldCheck className="w-8 h-8 mb-4 text-indigo-400" />
                        <h3 className="text-lg font-semibold mb-2">Secure System</h3>
                        <p className="text-gray-400">
                            Authentication and role-based access for safety.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition">
                        <Clock className="w-8 h-8 mb-4 text-indigo-400" />
                        <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
                        <p className="text-gray-400">
                            Track booking status and updates instantly.
                        </p>
                    </div>

                </div>
            </section>

            <section className="mt-28 text-center px-6">
                <h2 className="text-3xl font-bold font-[Poppins] mb-4">
                    Start Your Journey Today
                </h2>

                <p className="text-gray-400 mb-6">
                    Join thousands of users managing cab bookings efficiently.
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition"
                >
                    Create Account
                </button>
            </section>

            <footer className="mt-24 border-t border-white/10 py-6 text-center text-gray-500">
                © 2026 CabPortal. All rights reserved.
            </footer>

        </div>
    );
};

export default Landing;