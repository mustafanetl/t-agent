import { PlannerWizard } from '@/components/planner-wizard';

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Your AI trip planner</h1>
        <p className="text-sm text-white/60">
          Premium itinerary generation with structured, trustworthy guidance.
        </p>
      </div>
      <PlannerWizard />
    </div>
  );
}
