const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const normalizeReview = (review = {}) => ({
  id: review.id ?? null,
  userId: review.userId ?? review.user_id ?? null,
  businessId: review.businessId ?? review.business_id ?? null,
  orderId: review.orderId ?? review.order_id ?? null,
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
  verifiedOrder: Boolean(review.verifiedOrder ?? review.verified_order ?? review.orderId ?? review.order_id),
  categoryRatings: {
    food: numberOrNull(review.categoryRatings?.food ?? review.foodRating ?? review.food_rating),
    time: numberOrNull(review.categoryRatings?.time ?? review.timeRating ?? review.time_rating),
    presentation: numberOrNull(review.categoryRatings?.presentation ?? review.presentationRating ?? review.presentation_rating),
    accuracy: numberOrNull(review.categoryRatings?.accuracy ?? review.accuracyRating ?? review.accuracy_rating),
  },
  ownerResponse: review.ownerResponse || review.owner_response || null,
  createdAt: review.createdAt || review.created_at || null,
});

export const normalizeReviews = (reviews = []) =>
  Array.isArray(reviews) ? reviews.map(normalizeReview) : [];
