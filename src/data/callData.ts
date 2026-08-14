export interface Call {
id: number;
prospectId:  number;
date: string;
duration: number;
outcome: "Completed" | "No-Answer" | "Callback",
notes: string;
}

export const calls: Call[] = [
    {
        id: 1,
        prospectId: 1,
        date: "2026-08-14",
        duration: 15,
        outcome: "Completed",
        notes: "Discussed website redesign."
    },
    {
        id: 2,
        prospectId: 2,
        date: "2026-08-13",
        duration: 14,
        outcome: "Completed",
        notes: "Audited current website."
    },
    {
        id: 3,
        prospectId: 3,
        date: "2026-08-12",
        duration: 7,
        outcome: "No-Answer",
        notes: "No answer. Will try again later."
    },
    {
        id: 4,
        prospectId: 4,
        date: "2026-08-11",
        duration: 11,
        outcome: "Callback",
        notes: "Interested but asked for a callback next week."
    },
    {
        id: 5,
        prospectId: 5,
        date: "2026-08-10",
        duration: 22,
        outcome: "Completed",
        notes: "Discussed current website problems and potential improvements."
    },
    {
        id: 6,
        prospectId: 1,
        date: "2026-08-08",
        duration: 9,
        outcome: "Callback",
        notes: "Follow-up call regarding proposal."
    }
]