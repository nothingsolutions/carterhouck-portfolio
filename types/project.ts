export interface Project {
  id: string;
  images: string[];
  item: string;
  client: string;
  category: string;
  role: string;
  date: string;
  program: string;
  supplier: string;
  notes: string;
  status: "Complete" | "In Progress" | "Archived" | string;
}

