import { Link } from "react-router-dom";
import { AppRoutes } from "../../types/routes";
import { button } from "../ui/button";

/** Guest CTA in the header — routes to the sign-in page. */
export default function SignInButton(): JSX.Element {
  return (
    <Link to={AppRoutes.login} className={button({ variant: "primary", size: "sm" })}>
      Sign in
    </Link>
  );
}
