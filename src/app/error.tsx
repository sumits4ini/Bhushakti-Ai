"use client";

import React, { useEffect } from "react";
import { ErrorDisplay } from "@/components/common/ErrorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log telemetry processing failure for auditing
    console.error("BHUSHAKTI AI Route Failure:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <ErrorDisplay
        error={error}
        reset={reset}
        title="Application Exception"
        description="A telemetry pipeline or interface error occurred. You can retry the operation or return to the Command Center."
      />
    </div>
  );
}
