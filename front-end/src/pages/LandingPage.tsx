import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import PrompteerLogo from '../Prompteer-Logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-logo" onClick={() => navigate("/")}>
            <img src={PrompteerLogo} alt="Prompteer Logo" />
            <h4>Prompteer</h4>
          </li>
          <div className="nav-items-container">
            <li className="nav-item" onClick={() => navigate("/")}>Home</li>
            <li className="nav-item" onClick={() => navigate("/about")}>About</li>
            <li className="nav-item" onClick={() => navigate("/contact")}>Contact</li>
          </div>
        </ul>
      </nav>

      <div className="div1">
        <div className = "landing-header-text">
        <h1>Welcome to Prompteer</h1>
        <p>
          Optimize your prompts for ChatGPT with ease.
        </p>
        </div>
        <div className="button-div">
          <button className="buttons" onClick={() => navigate("/signup")}>Sign Up</button>
          <button className="buttons" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
