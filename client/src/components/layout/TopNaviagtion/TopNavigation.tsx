import { Link } from "react-router-dom";
import "./TopNavigation.css";

const TopNavigation = () => {
  return (
    <nav className="top-nav">
      <div className="nav-container">
        <Link to="/" className="nav-link">Stable</Link>
        <span className="separator"></span>
        <Link to="/training" className="nav-link">Training</Link>
        <span className="separator"></span>
        <Link to="/races" className="nav-link">Races</Link>
        <span className="separator"></span>
        <Link to="/market" className="nav-link">Horse Market</Link>
        <span className="separator"></span>
        <Link to="/marketplace" className="nav-link">Marketplace</Link>
        <span className="separator"></span>
        <Link to="/profile" className="nav-link">User Profile</Link>
      </div>
    </nav>
  );
};

export default TopNavigation;