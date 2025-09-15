export interface IPaginationFormate {
  currentPage: number;
  itemsPage: number;
  totalItem: number;
  totalPage: number;
  isPreviousPage: boolean;
  isNextPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: IPaginationFormate;
}
