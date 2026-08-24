
import type {
  Prospect,
  ProspectStatus,
} from "@/types/crm";

export function filterProspectsByStatus(
  prospects: Prospect[],
  status: ProspectStatus,
): Prospect[] {
  return prospects.filter(
    (prospect) => prospect.status === status,
  );
}

export function searchProspects(
  prospects: Prospect[],
  search: string,
): Prospect[] {
  const query = search.trim().toLowerCase();

  if (!query) {
    return prospects;
  }

  return prospects.filter((prospect) =>
    prospect.business_name
      ?.toLowerCase()
      .includes(query) ||
    prospect.contact_name
      ?.toLowerCase()
      .includes(query) ||
    prospect.email
      ?.toLowerCase()
      .includes(query),
  );
}

export function sortProspectsByDate(
  prospects: Prospect[],
): Prospect[] {
  return [...prospects].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime(),
  );
}

export function sortProspectsByName(
  prospects: Prospect[],
): Prospect[] {
  return [...prospects].sort((a, b) =>
    a.business_name.localeCompare(b.business_name),
  );
}

export function sortProspectsByValue(
  prospects: Prospect[],
): Prospect[] {
  return [...prospects].sort(
    (a, b) => b.value - a.value,
  );
}

