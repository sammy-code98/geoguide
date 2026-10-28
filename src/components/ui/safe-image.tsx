import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { PiMountainsDuotone } from "react-icons/pi";
import { cn } from "../../lib/cn";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
  fallbackIcon?: ReactNode;
}


const HAS_HEIGHT = /(^|\s|:)(h-|aspect-|size-)/;


export function SafeImage({
  src,
  alt = "",
  className,
  fallback,
  fallbackIcon,
  onError,
  ...rest
}: SafeImageProps): JSX.Element {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);


  useEffect(() => {
    setFailed(!src);
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0 && src) setFailed(true);
  }, [src]);

  if (failed) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          className,
          !HAS_HEIGHT.test(className ?? "") && "aspect-[4/3]",
          "flex items-center justify-center bg-surface-2 text-muted/60"
        )}
      >
        <span className="flex h-1/3 w-1/3 min-h-5 min-w-5 max-h-12 max-w-12 [&>svg]:h-full [&>svg]:w-full">
          {fallbackIcon ?? <PiMountainsDuotone />}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
