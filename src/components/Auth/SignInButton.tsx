import { Link } from "react-router-dom";
import { AppRoutes } from "../../types/routes";
import { button } from "../ui/button";

export default function SignInButton(): JSX.Element {
  return (
    <Link to={AppRoutes.login} className={button({ variant: "primary", size: "sm" })}>
      Sign in
    </Link>
  );
}
