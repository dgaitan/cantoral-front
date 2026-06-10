import { Pagination } from "@heroui/react";
import { getVisiblePages } from "@/lib/utils/pagination";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function PaginationBar({ page, totalPages, onChange }: PaginationBarProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <Pagination>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous onPress={() => onChange(page - 1)} isDisabled={page === 1}>
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>
        {visiblePages.map((p, i) =>
          p === null ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => onChange(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}
        <Pagination.Item>
          <Pagination.Next onPress={() => onChange(page + 1)} isDisabled={page === totalPages}>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
