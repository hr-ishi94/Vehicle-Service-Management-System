import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../axios/Auth';
import { landing_page_img, logo } from '../utils/constants';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      
      const action = await dispatch(loginUser({ username, password }));
      
      if (action.payload && action.payload.role) {
        
        localStorage.setItem("access_token", action.payload.access_token);
        if (action.payload.role === 'operations') {
          navigate('/dashboard');
          
        } else {
          navigate('/'); 
        }
        toast.success('Login Successful')
      }else{
          toast.error("Invalid Credentials")

      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <section className="h-auto py-2 bg-black max-sm:h-screen max-sm:overflow-hidden">
  <div className="container sm:py-5 sm:px-10 max-sm:p-1 ">
    <div className="flex gap-5 h-full pt-10 max-sm:items-center max-sm:justify-center max-sm:h-screen">
      
      <div className="w-2/3 max-sm:h-screen max-sm:w-screen">
        <img
          src={landing_page_img}
          className="w-full rounded-3xl max-sm:h-full object-cover"
          alt="Phone image"
        />
      </div>

      <div className="flex flex-col items-center w-1/3 justify-around max-sm:fixed max-sm:top-5 max-sm:left-0  max-sm:w-full max-sm:px-4">
        <div className="flex items-center gap-5 ">
          <img src={logo} alt="logo" className="w-20 rounded-full" />
          <h1 className="text-gray-500 font-bold text-3xl">MechanicON</h1>
        </div>

        <div className="rounded-xl text-center border-2 w-full max-sm:bg-[rgba(255,255,255,0.1)] max-sm:opacity-90 max-sm:p-4 max-sm:mt-10 ">
          <h1 className="text-amber-700 font-bold text-lg uppercase mt-10">
            Staff login
          </h1>
          <form className="flex flex-col px-5 py-10" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              size="lg"
              className="mb-6 max-sm:bg-[rgba(255,255,255,0.6)] max-sm:text-black shadow-gray-100 text-white border-2 border-gray-200 rounded-xl px-2 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-6 shadow-gray-100 max-sm:bg-[rgba(255,255,255,0.6)] max-sm:text-black text-white border-2 border-gray-200 rounded-xl px-2 py-2"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="text-white bg-amber-500 py-3 rounded-xl uppercase font-semibold cursor-pointer"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default Login;
