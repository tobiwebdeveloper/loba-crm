export type ProspectStatus =
  | "new"
  | "contacted"
  | "interested"
  | "meeting"
  | "proposal"
  | "won"
  | "lost";

export interface Prospect {
  id: number
  business_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  status: ProspectStatus
  value: number
  notes: string
  created_at: string
}

export interface Call {
  id: number
  prospect_id: number
  date: string
  duration: number
  outcome: string
  notes: string
}

export interface FollowUp {
  id: number
  prospect_id: number
  due_date: string
  notes: string
  completed: boolean
}