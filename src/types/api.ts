export interface DjangoResponse<T = unknown> {
  data: T;
  errors: Record<string, string[]> | null;
  success: boolean;
  status: number;
}

export type PaginatedData<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type PaginatedResponse<T> = DjangoResponse<PaginatedData<T>>;
