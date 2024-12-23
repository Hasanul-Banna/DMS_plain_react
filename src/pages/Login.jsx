import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth';
import { fireToast } from '../utils/toastify';
import { AxiosInstance } from '../Auth/Interceptor';

export default function Login() {
  let navigate = useNavigate();
  const {setIsAuthenticated} = useAuth()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [logo, setLogo] = useState({});
  useEffect(() => {
    AxiosInstance.get('http://localhost:5000/api/logo')
      .then((response) => {
        console.log(response.data.data[0]);
        localStorage.setItem('logo', JSON.stringify(response.data?.data[0]?.file_path))
        setLogo(response.data.data.length ? response.data.data[0] : {})
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [])
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt with:', username, password);
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoading(false);
      Cookies.set('auth_token', 'Valid_token_given!', { expires: 7 });
      localStorage.setItem('loggedInUser', JSON.stringify({name:username}))
      fireToast('info', 'Welcome Admin!');
      navigate('/dashboard');
    } else {
      const payload = { email: username, password }
      AxiosInstance.post('http://localhost:5000/api/users/get-user-profile', payload)
        .then((response) => {
          setIsAuthenticated(true);
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.data[0]))
          console.log(response.data.data[0]);
          Cookies.set('auth_token', 'Valid_token_given!', { expires: 7 });
          fireToast('info', 'Welcome Admin!');
          setTimeout(() => {
            navigate('/dashboard');
          }, 300);
        })
        .catch((error) => {
          console.error(error.message);
          fireToast('error', 'Invalid credentials!');
        }).finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="flex items-stretch max-h[500px]">
        <div className="bg-teal-700 rounded shadow-md w-[450px] flex items-center ">
          <div className="m-auto">
            <img src={`http://localhost:5000/${logo.file_path}`} width={180} height={180} alt="logo" className="m-auto" />
          </div>
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
              className={`btn btn-primary w-full mt-6`}
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
