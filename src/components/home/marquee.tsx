import { SparkleIcon } from "@/components/ui/icons";

const words = ["Crunchy", "Fruity", "Sour", "Sweet", "Freeze dried", "Made for sharing"];

function Row() {
  return (
    <ul className="flex shrink-0 items-center gap-8 pr-8">
      {words.map((word) => (
        <li key={word} className="flex items-center gap-8 whitespace-nowrap">
          <span className="bg-ink">{word}</span>
          <SparkleIcon size={22} className="text-sun" />
        </li>
      ))}
    </ul>
  );
}

/** A playful scrolling band of words. Purely decorative, so hidden from screen readers. */
export function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-x-clip py-6">
      <div className="-mx-4 -rotate-2 bg-ink py-4 shadow-lift">
        <div className="flex w-max animate-marquee font-display text-xl font-semibold tracking-wide text-white uppercase sm:text-2xl">
          <Row />
          <Row />
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
