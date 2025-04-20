import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="container">
      <div className="btn">
        <Link to="/login">Login</Link>
      </div>
      <div className="btn">
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
