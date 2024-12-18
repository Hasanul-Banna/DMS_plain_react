import { LogOut } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/auth";

export default function Navbar({ setSidebar }) {
  const { isUiLoading } = useAuth()
  const logout = () => {
    localStorage.removeItem('token');
  }
  return (
    <div className="flex-grow relative">
      {/* Main content */}
      <div className="navbar bg-base-100 border-b border-b-slate-300 shadow-md relative z-10">
        <div className="navbar-start">
          <button className="btn btn-ghost btn-circle" onClick={() => setSidebar(isSidebarHidden => !isSidebarHidden)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>

        <div className="navbar-end">
          <button className="btn btn-sm">
            <NavLink to="/login" className="flex gap-2 justify-center items-center" onClick={logout}>
              <LogOut size={15} />
              <span>Logout</span>
            </NavLink>
          </button>
        </div>
      </div>
      {isUiLoading && <div className="w-100 mt-[-14px] z-[1] relative ">
        <progress className="progress  w-100 "></progress>
      </div>}
    </div>
  )
}
