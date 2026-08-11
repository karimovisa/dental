"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** First-visit brand intro: a large SmileCare mark scales in with the wordmark
 *  and tagline, holds briefly to put focus on the logo, then fades away to
 *  reveal the site. Shows once per browser session. */
export function IntroSplash() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sc_intro_seen")) return;
    sessionStorage.setItem("sc_intro_seen", "1");
    setShow(true);
    const timer = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onClick={() => setShow(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/brand/smilecare-mark.png"
            alt="SmileCare"
            className="size-40 object-contain sm:size-48"
            initial={{ opacity: 0, scale: 0.55, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <div className="flex flex-col items-center gap-3">
            <motion.span
              className="text-4xl font-bold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
            >
              <span className="text-foreground">Smile</span>
              <span className="text-primary">Care</span>
            </motion.span>
            <motion.span
              className="text-xs font-medium uppercase text-muted-foreground sm:text-sm"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ delay: 0.95, duration: 0.8, ease: EASE }}
            >
              Dental Clinic
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
