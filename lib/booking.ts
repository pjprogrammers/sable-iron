import {
  LOCATIONS,
  SERVICE_DURATIONS,
  type DayKey,
  type Schedule,
} from "@/lib/data";

export const DAY_KEYS: DayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export const DAY_LABELS: Record<DayKey, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

const pad = (n: number) => String(n).padStart(2, "0");

export const isoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatMinutes = (minutes: number) => {
  const hour24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 >= 12 ? "pm" : "am";
  return `${hour12}${mins ? `:${pad(mins)}` : ""}${suffix}`;
};

export const formatTimeOption = (minutes: number) => {
  const hour24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${pad(mins)} ${suffix}`;
};

export const parseTimeValue = (value: string) => {
  const match = String(value).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
};

export const dateFromValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export type MiamiNow = {
  date: string;
  minutes: number;
  day: number;
};

export const miamiNow = (): MiamiNow => {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const find = (type: string) => {
      const part = parts.find((item) => item.type === type);
      return part ? part.value : "";
    };

    const year = Number(find("year"));
    const month = Number(find("month"));
    const day = Number(find("day"));

    return {
      date: `${year}-${pad(month)}-${pad(day)}`,
      minutes: (Number(find("hour")) % 24) * 60 + Number(find("minute")),
      day: new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay(),
    };
  } catch {
    return {
      date: isoDate(now),
      minutes: now.getHours() * 60 + now.getMinutes(),
      day: now.getDay(),
    };
  }
};

export const getSchedule = (location: string): Schedule | null => {
  const match = LOCATIONS.find((item) => item.name === location);
  return match ? match.schedule : null;
};

export const getHoursFor = (location: string, date: Date | null) => {
  const schedule = getSchedule(location);
  if (!schedule || !date) return null;
  return schedule[DAY_KEYS[date.getDay()]] || null;
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

export const formatDateLong = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

export const nextOpenDate = (location: string, fromValue: string) => {
  const schedule = getSchedule(location);
  const date = dateFromValue(fromValue) || new Date();
  if (!schedule) return isoDate(date);

  for (let i = 0; i < 14; i += 1) {
    if (schedule[DAY_KEYS[date.getDay()]]) return isoDate(date);
    date.setDate(date.getDate() + 1);
  }

  return isoDate(date);
};

export type SlotResult =
  | {
      status: "no-date";
      placeholder: "Choose a date";
      hint: string;
      warning: true;
      starts: number[];
    }
  | {
      status: "closed";
      placeholder: "Closed that day";
      hint: string;
      warning: true;
      starts: number[];
    }
  | {
      status: "none";
      placeholder: string;
      hint: string;
      warning: true;
      starts: number[];
    }
  | {
      status: "ok";
      placeholder: "Choose a time";
      hint: string;
      warning: false;
      starts: number[];
      hours: [number, number];
    };

export const buildSlots = (
  location: string,
  dateValue: string,
  service: string,
  now: MiamiNow = miamiNow(),
): SlotResult => {
  const date = dateFromValue(dateValue);
  const duration = SERVICE_DURATIONS[service] || 30;

  if (!date) {
    return {
      status: "no-date",
      placeholder: "Choose a date",
      hint: "Pick a date to see available times.",
      warning: true,
      starts: [],
    };
  }

  const hours = getHoursFor(location, date);
  if (!hours) {
    return {
      status: "closed",
      placeholder: "Closed that day",
      hint: `${location} is closed on ${formatDate(date)}. Choose another day or shop.`,
      warning: true,
      starts: [],
    };
  }

  const earliest = dateValue === now.date ? now.minutes + 30 : 0;
  const starts: number[] = [];

  for (let minutes = hours[0]; minutes + duration <= hours[1]; minutes += 30) {
    if (minutes >= earliest) starts.push(minutes);
  }

  if (!starts.length) {
    return {
      status: "none",
      placeholder:
        dateValue === now.date ? "No times left today" : "No times available",
      hint:
        dateValue === now.date
          ? `No times left today at ${location}. Try another day.`
          : `No ${duration}-minute ${service} slots fit on this day. Try another day or shop.`,
      warning: true,
      starts: [],
    };
  }

  return {
    status: "ok",
    placeholder: "Choose a time",
    hint: `${location} · ${formatDate(date)} · open ${formatMinutes(hours[0])}–${formatMinutes(hours[1])} · ${starts.length} time${starts.length === 1 ? "" : "s"} available`,
    warning: false,
    starts,
    hours,
  };
};

export type LocationStatus = {
  open: boolean;
  label: string;
};

export const getLocationStatus = (
  schedule: Schedule,
  now: MiamiNow = miamiNow(),
): LocationStatus => {
  const today = schedule[DAY_KEYS[now.day]];
  let label = "";
  let open = false;

  if (today && now.minutes >= today[0] && now.minutes < today[1]) {
    open = true;
    label = `Open now · until ${formatMinutes(today[1])}`;
  } else if (today && now.minutes < today[0]) {
    label = `Closed · opens ${formatMinutes(today[0])}`;
  } else {
    for (let offset = 1; offset <= 7; offset += 1) {
      const nextDay = (now.day + offset) % 7;
      const range = schedule[DAY_KEYS[nextDay]];
      if (!range) continue;
      const dayText =
        offset === 1 ? "tomorrow" : DAY_LABELS[DAY_KEYS[nextDay]];
      label = `Closed · opens ${dayText} ${formatMinutes(range[0])}`;
      break;
    }
  }

  if (!label) label = "Closed · opens soon";
  return { open, label };
};
