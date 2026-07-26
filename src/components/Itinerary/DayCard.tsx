import {
  MdOutlineWbTwilight,
  MdOutlineWbSunny,
  MdOutlineNightlight,
  MdOutlineRestaurant,
  MdOutlineDirectionsBus,
} from "react-icons/md";
import type { ItineraryDay } from "../../types/itinerary";

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
      <Icon className="text-primary text-xl shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-black dark:text-textWhite">{label}</p>
        <p className="text-textGray dark:text-textWhite leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function DayCard({ day }: DayCardProps): JSX.Element {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex flex-col items-center justify-center leading-none">
          <span className="text-[10px] uppercase">Day</span>
          <span className="font-bold">{day.day}</span>
        </div>
        <h3 className="text-lg font-bold text-black dark:text-textWhite">{day.title}</h3>
      </div>

      <div className="space-y-3">
        <Slot Icon={MdOutlineWbTwilight} label="Morning" text={day.morning} />
        <Slot Icon={MdOutlineWbSunny} label="Afternoon" text={day.afternoon} />
        <Slot Icon={MdOutlineNightlight} label="Evening" text={day.evening} />

        {day.food.length > 0 && (
          <div className="flex gap-3">
            <MdOutlineRestaurant className="text-primary text-xl shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-black dark:text-textWhite">Food</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {day.food.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {item}
                  </span>
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
  );
}
