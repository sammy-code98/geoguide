import { useRouteError, NavLink } from "react-router-dom"

export default function ErrorPage():JSX.Element {
    const error = useRouteError()
    console.log(error);
    
  return (
    <div className="h-screen flex flex-col justify-center items-center  text-center">
        <h1 className="mb-4 text-8xl font-semibold text-primary">404</h1>
        <p className="mb-4 text-xl text-textGray">Oops! Looks like you're lost.</p>
        <div className="animate-bounce">
        <svg
          className="mx-auto h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          ></path>
        </svg>
        </div>
        <p className="mt-4 text-textGray">
        Let's get you back {" "}
        <NavLink to="/" className="text-primary font-semibold">
          home
        </NavLink>
        .
        </p>
    </div>
  )
}
