export const getSheltersSortOrderBy = (
  sortBy?: string
): { createdAt?: 'asc' | 'desc' } => {
  switch (sortBy) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'newest':
      return { createdAt: 'desc' };
    default:
      return {};
  }
};

export const getPetsSortOrderBy = (
  sortBy?: string
): { publishedAt?: 'asc' | 'desc' } => {
  switch (sortBy) {
    case 'oldest':
      return { publishedAt: 'asc' };
    case 'newest':
      return { publishedAt: 'desc' };
    default:
      return {};
  }
};
