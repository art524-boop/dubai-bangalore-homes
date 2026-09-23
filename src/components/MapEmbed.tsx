export function MapEmbed({
  lat,
  lng,
  title,
  className = "h-72",
}: {
  lat: number;
  lng: number;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      title={`Map of ${title}`}
      loading="lazy"
      className={`w-full rounded-sm border border-border ${className}`}
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`}
    />
  );
}
