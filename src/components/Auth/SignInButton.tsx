import { Link } from "react-router-dom";
import { AppRoutes } from "../../types/routes";

/** Guest CTA in the header — routes to the sign-in page. */
export default function SignInButton(): JSX.Element {
  return (
    <Link
      to={AppRoutes.login}
      className="py-2 px-4 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
    >
      Sign In
    </Link>
  );
}
