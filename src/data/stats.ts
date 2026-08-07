import type { Stat } from "@/types";

/** Headline trust metrics for the stats bar. */
export const stats: Stat[] = [
  {
    id: "stat-experience",
    label: "Years Experience",
    value: 10,
    suffix: "+",
    icon: "CalendarClock",
  },
  {
    id: "stat-patients",
    label: "Happy Patients",
    value: 5000,
    suffix: "+",
    icon: "Users",
  },
  {
    id: "stat-specialists",
    label: "Dental Specialists",
    value: 15,
    suffix: "+",
    icon: "Stethoscope",
  },
  {
    id: "stat-success",
    label: "Success Rate",
    value: 98,
    suffix: "%",
    icon: "TrendingUp",
  },
];
