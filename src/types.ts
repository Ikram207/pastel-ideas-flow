export type Status = 'todo' | 'in_progress' | 'done';

export interface Idea {
  id: string;
  title: string;
  description: string;
  creatorFirstName: string;
  creatorLastName: string;
  startDate: string; // ISO
  dueDate: string;   // ISO
  status: Status;
  groups: string[];
  assignees: string[]; // user emails or names
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
