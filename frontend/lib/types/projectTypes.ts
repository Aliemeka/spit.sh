export interface Project {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  created_at: string;
  links_count: number;
}
