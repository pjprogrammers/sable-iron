"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import BookingDialog, { type BookingPrefill } from "@/components/BookingDialog";

type BookingContextValue = {
  openBooking: (prefill?: BookingPrefill) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return context;
}

type OpenState = {
  open: boolean;
  prefill: BookingPrefill;
  session: number;
};

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpenState>({
    open: false,
    prefill: {},
    session: 0,
  });
  const sessionRef = useRef(0);

  const openBooking = useCallback((prefill: BookingPrefill = {}) => {
    sessionRef.current += 1;
    setState({ open: true, prefill, session: sessionRef.current });
  }, []);

  const closeBooking = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      <div id="page-content">{children}</div>
      <AnimatePresence>
        {state.open ? (
          <BookingDialog
            key={state.session}
            prefill={state.prefill}
            onClose={closeBooking}
          />
        ) : null}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
