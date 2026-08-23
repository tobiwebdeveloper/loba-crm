// ============================================================
import type { Prospect } from "@/types/crm";
// ============================================================

//

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
  prospect: Omit<Prospect, "id" | "created_at">,
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
  prospect: Omit<Prospect, "id" | "created_at">,
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

export async function deleteProspect(
  id: number,
): Promise<void> {
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

export async function getCalls() {
    const response = await fetch("/api/calls")
    const calls = await response.json()

    return calls
}

export async function getCall(id) {
    const response = await fetch(`/api/calls/${id}`)
    const call = await response.json()

    return call
}

export async function createCall(call) {
    const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(call)
    })

    const createdCall = await response.json()
    return createdCall
}

export async function updateCall(id, call) {
    const response = await fetch(`/api/calls/${id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(call)
    })

    const updatedCall = await response.json()
    return updatedCall
}

export async function deleteCall(id) {
    await fetch(`/api/calls/${id}`,{
        method: "DELETE"
    })
}


// ============================================================
// Follow-ups
// ============================================================

export async function getFollowUps() {
    const response = await fetch("/api/follow-ups")
    const followUps = await response.json()

    return followUps
}

export async function getFollowUp(id) {
    const response = await fetch(`/api/follow-ups/${id}`)
    const followUp = await response.json()

    return followUp
    
}

export async function createFollowUp(followUp) {
    const response = await fetch("/api/follow-ups", {
          method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(followUp)
    })

    const createdFollowUp = await response.json()
    return createdFollowUp
}

export async function updateFollowUp(id, followUp) {
    const response = await fetch(`/api/follow-ups/${id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(followUp)

    })
    const updatedFollowUp = await response.json()
    return updatedFollowUp
}

export async function deleteFollowUp(id) {
    await fetch(`/api/follow-ups/${id}`,{
        method: "DELETE"
    })
}