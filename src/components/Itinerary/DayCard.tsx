import {
  MdOutlineWbTwilight,
  MdOutlineWbSunny,
  MdOutlineNightlight,
  MdOutlineRestaurant,
  MdOutlineDirectionsBus,
} from "react-icons/md";
import type { ItineraryDay } from "../../types/itinerary";
import { Badge } from "../ui/badge";

interface DayCardProps {
  day: ItineraryDay;
}

function Slot({
  Icon,
  label,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="text-primary text-xl shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="font-medium text-fg">{label}</p>
        <p className="text-fg/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function DayCard({ day }: DayCardProps): JSX.Element {
  return (
    <div className="relative pl-6 pb-8 last:pb-0">
      {/* Timeline marker (line is drawn by the parent's left border) */}
      <span
        className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-bg"
        aria-hidden="true"
      />

      <div>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Day {day.day}
          </span>
          <h3 className="font-serif text-xl font-semibold text-fg">{day.title}</h3>
        </div>

        <div className="space-y-3">
          <Slot Icon={MdOutlineWbTwilight} label="Morning" text={day.morning} />
          <Slot Icon={MdOutlineWbSunny} label="Afternoon" text={day.afternoon} />
          <Slot Icon={MdOutlineNightlight} label="Evening" text={day.evening} />

          {day.food.length > 0 && (
            <div className="flex gap-3">
              <MdOutlineRestaurant className="text-primary text-xl shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-fg">Food</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {day.food.map((item) => (
                    <Badge key={item} variant="primary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Slot
            Icon={MdOutlineDirectionsBus}
            label="Getting around"
            text={day.transportation}
          />
        </div>
      </div>
    </div>
  );
}
