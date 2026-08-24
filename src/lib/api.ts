
import type {
  Prospect,
  Call,
  FollowUp,
} from "@/types/crm";

// ============================================================
// Prospects
// ============================================================

export async function getProspects(): Promise<Prospect[]> {
  const response = await fetch("/api/prospects");

  if (!response.ok) {
    throw new Error("Failed to load prospects.");
  }

  return response.json();
}

export async function getProspect(id: number): Promise<Prospect> {
  const response = await fetch(`/api/prospects/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load prospect.");
  }

  return response.json();
}

export async function createProspect(
  prospect: Partial<Prospect>,
): Promise<Prospect> {
  const response = await fetch("/api/prospects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prospect),
  });

  if (!response.ok) {
    throw new Error("Failed to create prospect.");
  }

  return response.json();
}

export async function updateProspect(
  id: number,
  prospect: Partial<Prospect>,
): Promise<Prospect> {
  const response = await fetch(`/api/prospects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prospect),
  });

  if (!response.ok) {
    throw new Error("Failed to update prospect.");
  }

  return response.json();
}

export async function deleteProspect(id: number): Promise<void> {
  const response = await fetch(`/api/prospects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete prospect.");
  }
}

// ============================================================
// Calls
// ============================================================

export async function getCalls(): Promise<Call[]> {
  const response = await fetch("/api/calls");

  if (!response.ok) {
    throw new Error("Failed to load calls.");
  }

  return response.json();
}

export async function getCall(id: number): Promise<Call> {
  const response = await fetch(`/api/calls/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load call.");
  }

  return response.json();
}

export async function createCall(
  call: Partial<Call>,
): Promise<Call> {
  const response = await fetch("/api/calls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(call),
  });

  if (!response.ok) {
    throw new Error("Failed to create call.");
  }

  return response.json();
}

export async function updateCall(
  id: number,
  call: Partial<Call>,
): Promise<Call> {
  const response = await fetch(`/api/calls/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(call),
  });

  if (!response.ok) {
    throw new Error("Failed to update call.");
  }

  return response.json();
}

export async function deleteCall(id: number): Promise<void> {
  const response = await fetch(`/api/calls/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete call.");
  }
}

// ============================================================
// Follow-ups
// ============================================================

export async function getFollowUps(): Promise<FollowUp[]> {
  const response = await fetch("/api/follow-ups");

  if (!response.ok) {
    throw new Error("Failed to load follow-ups.");
  }

  return response.json();
}

export async function getFollowUp(id: number): Promise<FollowUp> {
  const response = await fetch(`/api/follow-ups/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load follow-up.");
  }

  return response.json();
}

export async function createFollowUp(
  followUp: Partial<FollowUp>,
): Promise<FollowUp> {
  const response = await fetch("/api/follow-ups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(followUp),
  });

  if (!response.ok) {
    throw new Error("Failed to create follow-up.");
  }

  return response.json();
}

export async function updateFollowUp(
  id: number,
  followUp: Partial<FollowUp>,
): Promise<FollowUp> {
  const response = await fetch(`/api/follow-ups/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(followUp),
  });

  if (!response.ok) {
    throw new Error("Failed to update follow-up.");
  }

  return response.json();
}

export async function deleteFollowUp(id: number): Promise<void> {
  const response = await fetch(`/api/follow-ups/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete follow-up.");
  }
}

