type PlaceCardT = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function PlaceCard({ title, description, imageUrl }: PlaceCardT) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-2xl md:h-96">
      <div className="relative w-full h-72 md:h-80 lg:h-full">
        <img
          alt={title}
          src={imageUrl}
          width="100%"
          height="100%"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="z-50 absolute top-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between">
            <div className="text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full flex-shrink-0">
              Top Destination
            </div>
          </div>
        </div>

        <div className="z-50 absolute bottom-0 left-0 right-0 p-6 bg-black/50">
          <div className="space-y-2">
            <div className="flex-1 pr-4">
              <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
                {title}
              </h4>
            </div>
            <p className="text-sm text-gray-200  opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
