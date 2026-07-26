import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to={user ? "/dashboard" : "/"} className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="2" width="16" height="18" rx="2" fill="var(--ink)" />
              <rect x="5.5" y="6.5" width="9" height="2.4" rx="1" fill="var(--highlight)" />
              <rect x="5.5" y="11" width="7" height="1.6" rx="0.8" fill="var(--bg)" />
            </svg>
          </span>
          StudyBuddy AI
        </Link>

        <nav className="navbar__links">
          {user ? (
            <>
              <span className="navbar__user">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn--ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn btn--primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
