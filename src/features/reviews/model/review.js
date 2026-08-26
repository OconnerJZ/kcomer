export const normalizeReview = (review = {}) => ({
  id: review.id ?? null,
  userId: review.userId ?? review.user_id ?? null,
  businessId: review.businessId ?? review.business_id ?? null,
  userName:
    review.userName ||
    review.user_name ||
    review.customerName ||
    review.customer_name ||
    review.name ||
    "Usuario",
  avatar:
    review.avatar ||
    review.avatarUrl ||
    review.avatar_url ||
    review.user?.avatar ||
    review.user?.avatar_url ||
    "",
  comment: review.comment || review.content || review.review || review.description || "",
  rating: Number(review.rating ?? review.score ?? 0),
  createdAt: review.createdAt || review.created_at || null,
});

export const normalizeReviews = (reviews = []) =>
  Array.isArray(reviews) ? reviews.map(normalizeReview) : [];
