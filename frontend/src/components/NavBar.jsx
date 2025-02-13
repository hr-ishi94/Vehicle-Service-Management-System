import { useNavigate } from "react-router-dom";
import { logo } from "../utils/constants"
import { Icon } from "@iconify/react"
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../axios/Auth";

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state)=>state.auth.user)

    
    const handleLogout = () => {
      dispatch(logoutUser())
        .then(() => {
          navigate("/login");
          localStorage.removeItem('access_token')
        })
        .catch((error) => {
          console.error("Logout failed", error);
        });
    };
  return (
    <div className=' fixed top-0 left-0 w-full text-white bg-zinc-900  py-3 px-16  flex items-center justify-between border-b-2 border-zinc-800 shadow-2xl max-sm:px-5' >
        <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 rounded-full border-white border-2 max-sm:w-5" />
            <h1 className="text-xl font-bold text-gray-400 ">MechanicON</h1>
        </div>
        
        <div className="flex gap-2 max-sm:text-sm">
            {user?.role !== 'operations' &&
            <>
            <a className=" px-2 py-2 rounded-lg cursor-pointer" href="#home">Home</a>
            <a className=" px-2 py-2 rounded-lg cursor-pointer" href="#service_history">Service History</a>
            </>
            }
            <h1 className="flex items-center gap-2 text-amber-500 uppercase text-sm font-semibold"><Icon icon="carbon:user-avatar-filled" width="32" height="32" />{user?.role}</h1>
            <button className="bg-amber-500 px-2 py-2 rounded-lg cursor-pointer" onClick={handleLogout}>Logout</button>
            
        </div>
    </div>

  )
}

export default NavBar