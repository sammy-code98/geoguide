import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";


function MainLayout(): JSX.Element {
  return (
    <>
      <HelmentHeader title="Get Started" description="GeoGuide Getting Started" />
      <div className="overflow-y-auto md:overflow-y-hidden  md:flex relative h-screen justify-between items-center ">
        <div className="hidden md:block w-full xl:w-2/4 h-full bg-top bg-repeat-y	 bg-cover	 bg-[#3BBDF8] bg-[url('/src/assets/bgImg.jpg')]"></div>
        <div className="overflow-y-auto flex w-full h-full xl:w-2/4 flex-col items-center py-12 px-4 dark:bg-bgDark">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default MainLayout