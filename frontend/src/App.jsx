import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"
import { useSelector } from "react-redux"
import { useEffect } from "react"

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log(user,'user')
  useEffect(() => {
    if (user) {
      if (user.role === 'operations') {
        navigate('/dashboard'); 
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  return (
    <div className="App font-mulish overflow-x-hidden">
       <Routes>
         <Route path='/login' element={<Login/>} />
         <Route path='/' element={user ? <Home /> : <Navigate to="/login" />} />
         <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />} />
       </Routes>


       <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
     </div>
        
  )
}

export default App
