"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignupPage() {
   
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("../api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    typeof data.error === "string"
                        ? data.error
                        : "Validation error. Please check inputs."
                );
                console.log(data.error)
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                            SR
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Create Account
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Service Request Management System
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Username</label>
                            <input
                                name="username"
                                required
                                className="input"
                                placeholder="john_doe"
                            />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="label">Mobile Number (optional)</label>
                            <input
                                name="mobileNo"
                                className="input"
                                placeholder="+91XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="label">Role</label>
                            <select name="roleCode" className="input" required>
                                <option value="">Select role</option>
                                <option value="CUSTOMER">Customer</option>
                                <option value="EMPLOYEE">Employee</option>
                            </select>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
            
        </>
    );
}