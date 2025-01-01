import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";

export default function SignUp() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signup"></Auth>
      </div>
      <div className="invisible lg:visible">
        <Quote></Quote>
      </div>
    </div>
  );
}
