import { useState } from "react";
import axios from "axios";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post(
      "http://localhost:8080/login",
      new URLSearchParams({
        username,
        password,
      })
    );
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Welcome Back
        </h1>
        <div className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-orange-400 to-green-500 text-white font-semibold py-3 rounded-lg hover:from-orange-500 hover:to-green-600 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
