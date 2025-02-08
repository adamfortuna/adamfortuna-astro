export default function pagesForCount(count: number, pageSize?: number): { params: { page: string } }[] {
  const perPage = pageSize || Number(import.meta.env.ARTICLES_PER_PAGE) || 25;

  // Calculate total number of pages, rounding up
  const totalPages = Math.ceil(count / perPage);

  // Generate an array of page numbers
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) }, // Page numbers start from 1
  }));
}