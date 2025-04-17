import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <p> Landing </p>
      <button onClick={() => navigate("/login")}> Login </button>
      <button onClick={() => navigate("/register")}> Register </button>
    </div>
  );
}
