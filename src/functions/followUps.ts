
import type { FollowUp } from "@/types/crm";

export function getUpcomingFollowUps(
  followUps: FollowUp[],
): FollowUp[] {
  const now = new Date();

  return followUps.filter((followUp) => {
    if (followUp.completed) {
      return false;
    }

    return new Date(followUp.due_date) >= now;
  });
}

export function getOverdueFollowUps(
  followUps: FollowUp[],
): FollowUp[] {
  const now = new Date();

  return followUps.filter((followUp) => {
    if (followUp.completed) {
      return false;
    }

    return new Date(followUp.due_date) < now;
  });
}

