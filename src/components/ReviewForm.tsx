import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, MessageSquare, Star, Send, Edit, Trash2 } from 'lucide-react';

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  reviewerName: string;
  vehicleId?: string;
}

interface Review extends ReviewData {
  id: string;
  date: string;
  verified: boolean;
}

interface ReviewFormProps {
  vehicleId?: string;
  onSubmit: (review: ReviewData) => void;
  existingReviews?: Review[];
  onEditReview?: (reviewId: string, updatedReview: ReviewData) => void;
  onDeleteReview?: (reviewId: string) => void;
  currentUserName?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  vehicleId,
  onSubmit,
  existingReviews = [],
  onEditReview,
  onDeleteReview,
  currentUserName,
}) => {
  const [rating, setRating] = useState(0);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewData>();

  const onFormSubmit = async (data: ReviewData) => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const reviewData = {
      ...data,
      rating,
      vehicleId,
    };

    if (editingReview) {
      onEditReview?.(editingReview, reviewData);
      setEditingReview(null);
    } else {
      onSubmit(reviewData);
    }

    reset();
    setRating(0);
    setShowForm(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review.id);
    setRating(review.rating);
    setValue('title', review.title);
    setValue('comment', review.comment);
    setValue('reviewerName', review.reviewerName);
    setShowForm(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      onDeleteReview?.(reviewId);
    }
  };

  const averageRating = existingReviews.length > 0
    ? existingReviews.reduce((sum, review) => sum + review.rating, 0) / existingReviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {existingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Customer Reviews ({existingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={averageRating} readonly showValue size="lg" />
              <span className="text-sm text-gray-600">
                Based on {existingReviews.length} review{existingReviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Reviews */}
      {existingReviews.length > 0 && (
        <div className="space-y-4">
          {existingReviews.map((review) => (
            <Card key={review.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{review.reviewerName}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{review.date}</span>
                    {currentUserName === review.reviewerName && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReview(review)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} readonly size="sm" />
                <h4 className="font-medium mt-2 mb-1">{review.title}</h4>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Review Button */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full"
          variant="outline"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </Button>
      )}

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Rating */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Overall Rating *
                </Label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
                {rating === 0 && (
                  <p className="text-red-500 text-sm mt-1">Please select a rating</p>
                )}
              </div>

              {/* Review Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Review Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience..."
                  {...register('title', {
                    required: 'Review title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters',
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Review Comment */}
              <div>
                <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                  Your Review *
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your detailed experience with this vehicle..."
                  rows={4}
                  {...register('comment', {
                    required: 'Review comment is required',
                    minLength: {
                      value: 20,
                      message: 'Review must be at least 20 characters',
                    },
                  })}
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                )}
              </div>

              {/* Reviewer Name */}
              <div>
                <Label htmlFor="reviewerName" className="text-sm font-medium mb-2 block">
                  Your Name *
                </Label>
                <Input
                  id="reviewerName"
                  placeholder="Enter your name..."
                  {...register('reviewerName', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.reviewerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.reviewerName.message}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting
                    ? 'Submitting...'
                    : editingReview
                    ? 'Update Review'
                    : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingReview(null);
                    reset();
                    setRating(0);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewForm;
