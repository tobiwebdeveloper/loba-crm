
import type { Call } from "@/types/crm";

export function getCallsForProspect(
  calls: Call[],
  prospectId: number,
): Call[] {
  return calls.filter(
    (call) => call.prospect_id === prospectId,
  );
}



