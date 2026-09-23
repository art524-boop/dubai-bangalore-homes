import { whatsappUrl } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl("Hello Concrest, I'd like to speak with an advisor.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs tracking-[0.14em] uppercase text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.32-1.94 1.36-.5.06-1.12.08-1.8-.12-.42-.12-.96-.3-1.66-.6-2.92-1.26-4.82-4.2-4.96-4.4-.14-.2-1.18-1.58-1.18-3.02 0-1.44.76-2.14 1.02-2.44.26-.3.58-.38.78-.38.2 0 .38 0 .56.02.18 0 .42-.08.66.5.24.58.82 2 .9 2.14.08.14.12.3.02.5-.1.2-.14.32-.28.5-.14.18-.3.4-.42.52-.14.14-.28.3-.12.58.16.28.72 1.18 1.54 1.92 1.06.94 1.94 1.24 2.22 1.38.28.14.44.12.6-.08.16-.2.7-.82.88-1.1.18-.28.36-.24.6-.14.24.1 1.56.74 1.82.88.26.14.44.2.5.32.06.12.06.68-.18 1.36Z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}
