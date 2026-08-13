export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "High" | "Medium" | "Low";
    status: "Pending" | "Completed";
    prospectId?: number;
    type: "Follow-up" | "Task";
}

export const tasks: Task[] = [
    {
        id: 1,
        title: "Call Greenfield Landscaping",
        description: "Discuss website improvements and enquiry process.",
        dueDate: "2026-08-12",
        dueTime: "10:00",
        priority: "High",
        status: "Pending",
        prospectId: 1,
        type: "Follow-up"
    },
    {
        id: 2,
        title: "Follow up with Northside Roofing",
        description: "Check whether they are interested in discussing a redesign.",
        dueDate: "2026-08-12",
        dueTime: "14:00",
        priority: "Medium",
        status: "Pending",
        prospectId: 2,
        type: "Follow-up"
    },
    {
        id: 3,
        title: "Send portfolio to Oak & Stone Kitchens",
        description: "Send relevant kitchen and premium-business website examples.",
        dueDate: "2026-08-12",
        dueTime: "16:00",
        priority: "Medium",
        status: "Pending",
        prospectId: 3,
        type: "Follow-up"
    },
    {
        id: 4,
        title: "Review Horizon Electrical notes",
        description: "Prepare talking points around their weak enquiry flow.",
        dueDate: "2026-08-13",
        dueTime: "09:30",
        priority: "Low",
        status: "Pending",
        prospectId: 4,
        type: "Task"
    },
    {
        id: 5,
        title: "Prepare Garden Rooms proposal",
        description: "Review requirements before preparing the proposal.",
        dueDate: "2026-08-13",
        dueTime: "11:00",
        priority: "High",
        status: "Pending",
        prospectId: 5,
        type: "Task"
    },
    {
        id: 6,
        title: "Contact Forge & Oak Builders",
        description: "Initial outreach regarding their lack of website presence.",
        dueDate: "2026-08-14",
        dueTime: "10:30",
        priority: "High",
        status: "Pending",
        prospectId: 6,
        type: "Follow-up"
    },
    {
        id: 7,
        title: "Update prospect notes",
        description: "Add notes from recent sales conversations.",
        dueDate: "2026-08-11",
        dueTime: "15:00",
        priority: "Low",
        status: "Completed",
        type: "Task"
    }
];