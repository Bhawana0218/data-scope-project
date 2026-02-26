import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const today = new Date();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Local validation
    if (username === 'testuser' && password === 'Test123') {
      setTimeout(() => {
        onLogin({
           id: "1",
           username,
           joinDate: today.toISOString().split("T")[0],
        });
        navigate('/list');
        setLoading(false);
      }, 1000);
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 font-sans">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/001/987/748/original/abstract-template-blue-geometric-diagonal-overlap-layer-on-dark-blue-background-free-vector.jpg')",
    }}
  ></div>

  {/* Overlay for slightly darker background */}
  <div className="absolute inset-0 bg-black/20 z-0"></div>

  {/* Login Card */}
  <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-3xl rounded-xl shadow-2xl p-8 border border-white/20 hover:shadow-gray-200 transition-all">
    
    {/* Logo and Header */}
    <div className="text-center mb-6">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-inner">
        <img
          src="/DataScope.png"
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-100 mb-1">Welcome Back</h1>
      <p className="text-gray-200 text-sm">Sign in to your account</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-blue-400 to-purple-400 text-white py-2 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>

    <div className="mt-4 text-center">
      <p className="text-gray-300 text-sm">
        Demo Credentials:{" "}
        <span className="text-blue-300 font-mono">testuser / Test123</span>
      </p>
    </div>
  </div>
</div>

  );
};

export default Login;