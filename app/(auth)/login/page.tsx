"use client"

// import { useRouter } from "next/router";
import { useState } from "react";
import { POST } from "../../api/admin/addUser/route";
import { redirectAfterLogin } from "../../api/auth/login/action";

export default function LoginPage() {

  // const router = useRouter();

  const [identifier , setIdentifier] = useState("");
  const [password , setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e : React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setError(null);

    try{
      const res = await fetch('../api/auth/login' , {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          identifier ,
          password
        })
      });
      let data;
      if(!res.ok){
        const errorData = await res.json(); 

        console.log(errorData.message); 

        throw new Error(errorData.message || 'Failed to create user'); 
      }

      await redirectAfterLogin()
    }catch(err : any){
      setError(err)
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h1 className="text-4xl font-bold mb-4">ServiceHub</h1>
        <p className="text-slate-300 text-lg mb-8">
          Smart service request management for modern teams.
        </p>

        <ul className="space-y-3 text-slate-300">
          <li>🛠 Track and assign service requests</li>
          <li>📊 Real-time performance insights</li>
          <li>👥 Secure role-based access</li>
        </ul>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-600 mb-6">
            Sign in to continue
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { redirectAfterLogin } from "../api/auth/login/action";

// export default function LoginPage() {
//   const router = useRouter();
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ identifier, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || data.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       // ✅ Login successful, now redirect based on permissions
//       await redirectAfterLogin();

//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
//       {/* Left Panel */}
//       <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
//         <h1 className="text-4xl font-bold mb-4">ServiceHub</h1>
//         <p className="text-slate-300 text-lg mb-8">
//           Manage service requests efficiently. Assign tasks, track progress, and resolve issues in real time.
//         </p>
//         <ul className="space-y-3 text-slate-300">
//           <li>🛠 Track and assign service requests</li>
//           <li>📊 Real-time performance insights</li>
//           <li>👥 Secure role-based access</li>
//         </ul>
//       </div>

//       {/* Right Panel */}
//       <div className="flex items-center justify-center bg-slate-50">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-semibold text-slate-900 mb-2">
//             Welcome back
//           </h2>
//           <p className="text-slate-600 mb-6">Sign in to continue</p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email or Username
//               </label>
//               <input
//                 type="text"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>
//         </div>
//       </div>

//     </div>
//   );
// }
