'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import { Pagination } from '@/components/Pagination';

export default function ReviewSection({ productId, initialReviews }: { productId: string, initialReviews: any[] }) {
  const { user } = useStore();
  const t = useTranslations('Product');
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError(t('loginToReview'));
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment, userName: user.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviews([...reviews, { _id: Date.now(), userName: user.name, rating, comment, createdAt: new Date().toISOString() }]);
      setComment('');
      setRating(5);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paginatedReviews = reviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="mt-32">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black">{t('customerReviews')}</h2>
        {!showForm && user && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all text-sm"
          >
            {t('writeReview')}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-stone-50 rounded-3xl p-8 mb-12 border border-stone-200">
          <h3 className="text-xl font-black mb-6">{t('writeReviewTitle')}</h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('ratingLabel')}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-orange-500 hover:scale-110 transition-transform"
                >
                  {star <= rating ? (
                    <HiStar className="w-8 h-8" />
                  ) : (
                    <HiOutlineStar className="w-8 h-8" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('commentLabel')}</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t('commentPlaceholder')}
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
            >
              {isSubmitting ? t('submitting') : t('submitMsg')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-8 py-3 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300 transition-all"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="bg-stone-50 rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
           <p className="text-stone-400 font-medium mb-6">{t('noReviews')}</p>
           {!user && (
               <p className="text-sm text-stone-500">{t('loginToReview')} <a href="/login" className="text-orange-600 font-bold hover:underline">login</a>.</p>
           )}
           {user && !showForm && (
             <button onClick={() => setShowForm(true)} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800">{t('writeReview')}</button>
           )}
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedReviews.map((review: any, index: number) => (
            <div key={review._id || index} className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                {review.userName?.charAt(0) || 'U'}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="font-bold text-stone-900 text-lg">{review.userName || t('anonymous')}</h4>
                  <span className="text-sm text-stone-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? <HiStar key={i} className="w-5 h-5" /> : <HiOutlineStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <p className="text-stone-600 text-base leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
          
          {reviews.length > ITEMS_PER_PAGE && (
            <Pagination 
              currentPage={currentPage} 
              totalItems={reviews.length} 
              itemsPerPage={ITEMS_PER_PAGE} 
              onPageChange={setCurrentPage} 
            />
          )}
        </div>
      )}
    </div>
  );
}