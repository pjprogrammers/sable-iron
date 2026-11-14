"use client";

import type { ReactNode } from "react";
import { useBooking } from "@/components/BookingProvider";
import type { BookingPrefill } from "@/components/BookingDialog";

type BookButtonProps = BookingPrefill & {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export default function BookButton({
  children,
  className = "btn btn--solid",
  location,
  service,
  barber,
  ...rest
}: BookButtonProps) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      className={className}
      onClick={() => openBooking({ location, service, barber })}
      {...rest}
    >
      {children}
    </button>
  );
}
