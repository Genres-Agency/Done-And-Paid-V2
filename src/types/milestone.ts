export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  tasks: Task[];
  progress: number;
}
