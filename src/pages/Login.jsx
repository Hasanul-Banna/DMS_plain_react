import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth';
import { fireToast } from '../utils/toastify';

export default function Login() {
  let navigate = useNavigate();
  const isAuthenticated = useAuth()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt with:', username, password);
    if (username === 'admin' && password === 'admin') {
      Cookies.set('auth_token', 'Valid_token_given!', { expires: 7 });
      fireToast('info', 'Welcome Admin!');
      navigate('/dashboard');
    } else {
      fireToast('error', 'Invalid credentials! n\ try username : admin ;  password : admin');
      setUsername('');
      setPassword('');
    }
    setLoading(false);

    // try {
    //   await login(username, password);
    //   router.push('/documents');
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="flex items-stretch max-h[500px]">
        <div className="bg-primary rounded shadow-md w-[450px] flex items-center ">
          <image src={'logo'} width={180} height={180} alt="logo" className="m-auto" />
        </div>
        <div className="">
          <form onSubmit={handleLogin} className="max-w-md mx-auto p-10 bg-base-100 shadow-lg rounded-lg">
            <p className="text-center font-semibold">Welcome!</p>
            <h1 className="text-2xl font-bold mb-4">Document Management System</h1>
            {/* <h2 className="text-2xl font-bold text-center mb-6">Login</h2> */}
            <div className="form-control mb-4">
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full mt-6 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}