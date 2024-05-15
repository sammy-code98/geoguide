import { Helmet } from "react-helmet-async";

function HelmentHeader({ title, description }: { title: string; description: string }) {
  return (
    <Helmet>
      <title>{title} | GeoGuide</title>
      <meta name="description" content={description || ""} />
    </Helmet>
  )
}

export default HelmentHeader