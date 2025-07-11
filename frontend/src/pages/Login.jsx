// import { useState } from "react";
// import axios from "axios";

// export default function Login({ setToken }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState("");

//   const handleAuth = async () => {
//     const route = isSignup ? "/signup" : "/login";

//     try {
//       const res = await axios.post(
//         `http://localhost:8080${route}`,
//         {
//           email,
//           password,
//         }
//       );
//       localStorage.setItem("token", res.data.token);
//       setToken(res.data.token);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Authentication failed");

//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
//           {isSignup ? "Create an Account" : "Welcome Back"}
//         </h1>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 text-center">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           <input
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//           />
//           <input
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//           />

//           <button
//             onClick={handleAuth}
//             className="w-full bg-gradient-to-r from-orange-400 to-green-500 text-white font-semibold py-3 rounded-lg hover:from-orange-500 hover:to-green-600 transition"
//           >
//             {isSignup ? "Sign Up" : "Sign In"}
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             {isSignup ? "Already have an account?" : "New here?"}{" "}
//             <span
//               className="text-orange-600 font-semibold cursor-pointer"
//               onClick={() => setIsSignup(!isSignup)}
//             >
//               {isSignup ? "Sign In" : "Sign Up"}
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const res = await axios.post(`http://localhost:8080${endpoint}`, {
        email,
        password,
      });

      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        alert("Signup successful! You can now log in.");
        setIsSignup(false);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Authentication failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleAuth}>
          <input
            type="email"
            className="w-full px-4 py-2 mb-4 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
}
