import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userInfo, logout } = useAuth();

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        Task Manager
      </Link>

      <div className="flex gap-4 items-center">
        {userInfo ? (
          <>
            <span>{userInfo.name}</span>

            <button
              onClick={logout}
              className="bg-white text-black px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}