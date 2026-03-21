"use client";

import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

const STEPS: Step[] = [
  {
    target: ".tour-new-project",
    content: "This is your primary action. Start here to create a new architectural portal for your client.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".tour-metrics",
    content: "Monitor your studio's growth here. Track project counts, total visitors, and lead conversion rates in real-time.",
    placement: "bottom",
  },
  {
    target: ".tour-sidebar-projects",
    content: "The Projects section is where you manage your entire portfolio, toggle live status, and copy public links.",
    placement: "right",
  },
  {
    target: ".tour-sidebar-leads",
    content: "All client data captured via your portal's verification walls will appear here for export and follow-up.",
    placement: "right",
  },
  {
    target: ".tour-recent-leads",
    content: "Quickly review the most recent inquiries from your active portals.",
    placement: "top",
  },
];

export function StudioTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run the tour if it hasn't been completed before
    const hasCompletedTour = localStorage.getItem("venus_tour_completed");
    if (!hasCompletedTour) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("venus_tour_completed", "true");
    }
  };

  return (
    <Joyride
      steps={STEPS}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#ca8a04", // gold-600
          textColor: "#3f3f46", // zinc-700
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
    />
  );
}
