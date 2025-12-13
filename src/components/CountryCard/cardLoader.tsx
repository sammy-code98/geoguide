export default function CardLoader(): JSX.Element {
  return (
    <div className="w-full rounded-lg shadow-md bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
      <div className="animate-pulse">
        <div>
          <div className="h-40 w-full bg-textWhite rounded-t-lg"></div>
        </div>
        <hr />
        <div className="p-5 space-y-4 w-full">
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
          <div className="h-2 w-full rounded bg-textWhite"></div>
        </div>
      </div>
    </div>
  );
}
