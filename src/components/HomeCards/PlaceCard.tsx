type PlaceCardT = {
  title: string;
  description: string;
  imageUrl: string;
};

/** A printed postcard: framed photo, then a caption you'd write on the back. */
export default function PlaceCard({ title, description, imageUrl }: PlaceCardT) {
  return (
    <figure className="group h-full bg-surface border border-border rounded-lg p-3 transition-transform duration-200 ease-out-expo hover:-translate-y-0.5">
      <div className="relative overflow-hidden">
        <img
          alt={title}
          src={imageUrl}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-terracotta">
          Top destination
        </span>
      </div>
      <figcaption className="px-2 pt-5 pb-2">
        <h4 className="font-serif text-xl md:text-2xl font-semibold text-fg">{title}</h4>
        <p className="mt-2 text-muted leading-relaxed line-clamp-3">{description}</p>
      </figcaption>
    </figure>
  )
}
