
export default function index(): JSX.Element {
  return (
    <>
      <div className="max-w-sm bg-white border border-textGray rounded-lg shadow">
        <div >
          <img className="rounded-t-lg" src="https://nextui.org/images/hero-card-complete.jpeg" />
        </div>
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-light text-black">Counrty</h5>
          <p className="mb-3  font-normal text-black">Population :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
          <p className="mb-3  font-normal text-black">Region :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
          <p className="mb-3  font-normal text-black">Capital :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
        </div>
      </div>
    </>
  )
}
