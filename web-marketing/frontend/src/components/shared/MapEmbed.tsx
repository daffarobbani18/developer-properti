interface MapEmbedProps {
  /**
   * Google Maps embed URL
   * Format: https://www.google.com/maps/embed?pb=...
   */
  embedUrl: string;
  /**
   * Custom height (default: 450px)
   */
  height?: string;
  /**
   * Custom className for wrapper
   */
  className?: string;
}

export default function MapEmbed({
  embedUrl,
  height = '450px',
  className = '',
}: MapEmbedProps) {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg shadow-md ${className}`}
      style={{ height }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Location"
      ></iframe>
    </div>
  );
}
