type PlaceCardT = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function PlaceCard({ title, description, imageUrl }: PlaceCardT) {
  return (
    <div className="relative group overflow-hidden rounded-lg border border-border h-80 md:h-96">
      <img
        alt={title}
        src={imageUrl}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Purposeful overlay for text legibility over the photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute top-4 left-4">
        <span className="text-xs font-medium bg-white/90 text-stone-800 px-2.5 py-1 rounded-full">
          Top destination
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h4 className="text-lg md:text-xl font-semibold text-white line-clamp-1">{title}</h4>
        <p className="text-sm text-white/85  mt-1">{description}</p>
      </div>
    </div>
  )
}
