export type SongsQuery = {
  page?: number;
  search?: string;
  tag_id?: number;
  author_id?: number;
  limit?: number;
  order_by?: "views" | "created_at" | "rand";
  order?: "asc" | "desc";
};
