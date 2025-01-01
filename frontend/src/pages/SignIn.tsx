import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";

export default function SignIn() {
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
