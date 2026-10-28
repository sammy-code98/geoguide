import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { PiCloudSlashDuotone, PiSignpostDuotone } from "react-icons/pi";
import { AppRoutes } from "../types/routes";
import { Button, button } from "../components/ui/button";
import { ErrorPostcard } from "../components/ui/error-postcard";


export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-bg flex items-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to={AppRoutes.getStarted}
          className="inline-block mb-8 font-serif text-2xl font-semibold tracking-tight text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          GeoGuide
        </Link>
        {notFound ? (
          <ErrorPostcard
            as="h1"
            tone="sea"
            icon={<PiSignpostDuotone />}
            stampLabel="Lost"
            title="This page isn't on the map"
            message="The address you followed doesn't lead anywhere. It may have moved, or the link was mistyped."
            action={
              <>
                <Link to={AppRoutes.getStarted} className={button()}>
                  Back to home
                </Link>
                <Link to={AppRoutes.countries} className={button({ variant: "outline" })}>
                  Explore countries
                </Link>
              </>
            }
          />
        ) : (
          <ErrorPostcard
            as="h1"
            icon={<PiCloudSlashDuotone />}
            title="Something went wrong on our side"
            message="This page hit an unexpected problem while loading. Reloading usually fixes it."
            action={
              <>
                <Button onClick={() => window.location.reload()}>Reload the page</Button>
                <Link to={AppRoutes.getStarted} className={button({ variant: "outline" })}>
                  Back to home
                </Link>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
