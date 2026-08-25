import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" text="Loading BHUSHAKTI AI Disaster Intelligence Telemetry..." />
    </div>
  );
}
