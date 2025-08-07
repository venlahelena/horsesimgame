import { NavLink } from "react-router-dom";
import "./TopNavigation.css";

const TopNavigation = () => {
  return (
    <nav className="top-nav">
      <div className="nav-container">
        <NavLink to="/" className="nav-link" end>
          Stable
        </NavLink>
        <span className="separator" />
        <NavLink to="/training" className="nav-link">
          Training
        </NavLink>
        <span className="separator" />
        <NavLink to="/races" className="nav-link">
          Races
        </NavLink>
        <span className="separator" />
        <NavLink to="/market" className="nav-link">
          Horse Market
        </NavLink>
        <span className="separator" />
        <NavLink to="/marketplace" className="nav-link">
          Marketplace
        </NavLink>
        <span className="separator" />
        <NavLink to="/profile" className="nav-link">
          User Profile
        </NavLink>
        <span className="separator" />
        <NavLink to="/profile" className="nav-link">
          Log out
        </NavLink>
      </div>
    </nav>
  );
};

export default TopNavigation;
