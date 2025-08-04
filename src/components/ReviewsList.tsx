import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { StarRating } from './StarRating';
import { MessageSquare, User, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  profiles: {
    full_name?: string;
    profile_photo_url?: string;
  };
}

interface ReviewsListProps {
  carId: string;
  showTitle?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  carId,
  showTitle = true
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews with user profiles
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          created_at,
          profiles:user_id (
            full_name,
            profile_photo_url
          )
        `)
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setReviews(reviewsData || []);
      setTotalReviews(reviewsData?.length || 0);

      // Calculate average rating
      if (reviewsData && reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#000080]" />
            <h3 className="text-xl font-semibold">
              Reviews ({totalReviews})
            </h3>
          </div>
          
          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} showValue size="md" />
              <span className="text-sm text-gray-500">
                ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
      )}

      {totalReviews === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h4>
            <p className="text-gray-600">
              Be the first to share your experience with this car!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.profiles?.profile_photo_url ? (
                      <img
                        src={review.profiles.profile_photo_url}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#000080] flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getInitials(review.profiles?.full_name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">
                          {review.profiles?.full_name || 'Anonymous'}
                        </h4>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-medium text-gray-900 mb-2">
                        {review.title}
                      </h5>
                    )}

                    <p className="text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};