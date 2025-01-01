import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/blogs");
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin"></Auth>
      </div>
      <div className="invisible lg:visible">
        <Quote></Quote>
      </div>
    </div>
  );
}
