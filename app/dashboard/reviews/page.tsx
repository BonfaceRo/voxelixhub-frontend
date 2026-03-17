'use client';

import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Zap, Search, Filter } from 'lucide-react';

interface Review {
  id: string;
  platform: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  responded: boolean;
  aiResponse: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    platform: 'Google',
    author: 'Thabo Nkosi',
    rating: 5,
    content: 'Excellent service! Bought my BMW X5 here and the team was incredibly helpful. Bonface made the process so easy and the AI follow-up system kept me informed every step of the way.',
    date: '2026-03-15',
    responded: false,
    aiResponse: 'Thank you so much Thabo for your wonderful review! We are thrilled to hear that your BMW X5 purchase was a great experience. Our team works hard to make every customer feel valued. We hope you are enjoying your new vehicle and look forward to serving you again!',
  },
  {
    id: '2',
    platform: 'Google',
    author: 'Priya Pillay',
    rating: 4,
    content: 'Great dealership with a wide selection of vehicles. The staff were friendly and knowledgeable. Only slight issue was waiting time but overall very happy with my Toyota Hilux purchase.',
    date: '2026-03-14',
    responded: true,
    aiResponse: 'Thank you Priya for your kind words! We are so glad you are happy with your Toyota Hilux. We appreciate your feedback about the waiting time and we are actively working to improve this. Please do not hesitate to contact us for any after-sales support.',
  },
  {
    id: '3',
    platform: 'Facebook',
    author: 'James van Wyk',
    rating: 5,
    content: 'Best car buying experience I have ever had. The AI chat system answered all my questions instantly even at midnight. Highly recommend Cape Town Auto to anyone looking for a quality vehicle.',
    date: '2026-03-13',
    responded: false,
    aiResponse: 'Wow James thank you for this amazing review! We are so happy our AI assistant was able to help you even outside business hours. That is exactly what we built it for. Enjoy your new VW Polo and please refer your friends and family to us!',
  },
  {
    id: '4',
    platform: 'Google',
    author: 'Nomsa Dlamini',
    rating: 3,
    content: 'Decent dealership but felt a bit rushed during the sales process. The car is good quality though and the after-sales team has been helpful with my questions.',
    date: '2026-03-12',
    responded: false,
    aiResponse: 'Thank you Nomsa for taking the time to share your feedback. We sincerely apologize if you felt rushed during the sales process. This is not the experience we want for our customers. We would love to make it right — please call us on 021 123 4567 so we can assist you personally.',
  },
  {
    id: '5',
    platform: 'Google',
    author: 'Ruan Botha',
    rating: 2,
    content: 'Had some issues with the paperwork process. Took much longer than expected and had to follow up multiple times. The car itself is fine but the admin side needs improvement.',
    date: '2026-03-10',
    responded: false,
    aiResponse: 'Dear Ruan, thank you for your honest feedback. We are very sorry to hear about the delays in your paperwork process. This is unacceptable and we take full responsibility. Please contact our manager directly on 021 123 4567 so we can resolve this immediately and ensure your full satisfaction.',
  },
];

const PLATFORM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Google:   { bg: 'bg-blue-500/20',   text: 'text-blue-400',   dot: '#4285F4' },
  Facebook: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', dot: '#1877F2' },
  Yelp:     { bg: 'bg-red-500/20',    text: 'text-red-400',    dot: '#FF1A1A' },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onRespond }: { review: Review; onRespond: (id: string) => void }) {
  const [showResponse, setShowResponse] = useState(false);
  const [editing, setEditing] = useState(false);
  const [response, setResponse] = useState(review.aiResponse);
  const platform = PLATFORM_STYLES[review.platform] || PLATFORM_STYLES.Google;

  return (
    <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
            {review.author.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-white">{review.author}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} />
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={['px-2.5 py-1 rounded-full text-xs font-semibold', platform.bg, platform.text].join(' ')}>
            {review.platform}
          </span>
          {review.responded && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
              Responded
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.content}</p>

      {!review.responded && (
        <div className="space-y-3">
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-semibold hover:bg-accent-500/20 transition-colors"
          >
            <Zap size={14} />
            {showResponse ? 'Hide AI Response' : 'View AI Response'}
          </button>

          {showResponse && (
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} className="text-accent-500" />
                <span className="text-xs font-semibold text-accent-500">AI Generated Response</span>
              </div>
              {editing ? (
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none h-28"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{response}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-3 py-1.5 rounded-lg border border-dark-100 text-gray-400 text-xs font-medium hover:bg-dark-200 transition-colors"
                >
                  {editing ? 'Preview' : 'Edit'}
                </button>
                <button
                  onClick={() => onRespond(review.id)}
                  className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
                >
                  Post Response
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {review.responded && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp size={13} className="text-green-400" />
            <span className="text-xs font-semibold text-green-400">Your Response</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{review.aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews]     = useState<Review[]>(MOCK_REVIEWS);
  const [search, setSearch]       = useState('');
  const [platform, setPlatform]   = useState('ALL');
  const [ratingFilter, setRating] = useState(0);

  const handleRespond = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, responded: true } : r)
    );
  };

  const filtered = reviews.filter((r) => {
    const matchSearch   = !search || r.author.toLowerCase().includes(search.toLowerCase()) || r.content.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === 'ALL' || r.platform === platform;
    const matchRating   = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchPlatform && matchRating;
  });

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const pending   = reviews.filter((r) => !r.responded).length;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Management</h1>
          <p className="text-gray-500 mt-1">Monitor and respond to reviews with AI</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
            <StarRating rating={Math.round(avgRating)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reviews',    value: String(reviews.length),                                        color: 'text-brand-400',  bg: 'bg-brand-500/20'  },
          { label: 'Average Rating',   value: avgRating.toFixed(1) + ' / 5',                                 color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
          { label: 'Pending Response', value: String(pending),                                               color: 'text-red-400',    bg: 'bg-red-500/20'    },
          { label: '5 Star Reviews',   value: String(reviews.filter((r) => r.rating === 5).length),          color: 'text-green-400',  bg: 'bg-green-500/20'  },
        ].map((s) => (
          <div key={s.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <div className={['w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg, s.color].join(' ')}>
              <Star size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={15} className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-1 bg-dark-300 border border-dark-100 rounded-lg p-1">
          {['ALL', 'Google', 'Facebook'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                platform === p ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
              ].join(' ')}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-dark-300 border border-dark-100 rounded-lg p-1">
          <button
            onClick={() => setRating(0)}
            className={['px-3 py-1.5 rounded-md text-xs font-semibold transition-all', ratingFilter === 0 ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'].join(' ')}
          >
            All Stars
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={['px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-0.5', ratingFilter === r ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'].join(' ')}
            >
              {r}<Star size={10} className="fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onRespond={handleRespond}
          />
        ))}
      </div>
    </div>
  );
}
