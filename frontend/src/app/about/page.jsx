'use client';

import { useState, useEffect } from 'react';

export default function About() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    content: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      setReviews([data, ...reviews]);
      setNewReview({ name: '', content: '', rating: 5 });
      setSuccess('Thank you for your review!');
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main heading */}
        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">
          About Tulip Bride
        </h1>

        {/* Story section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#4D3925]">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              At Tulip Bride, we believe every bride deserves to shine. Since 2024, we've dedicated ourselves to crafting unforgettable bridal moments, offering gowns and accessories that blend timeless elegance with modern flair.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our passionate team carefully curates each collection to help brides feel radiant, confident, and unique on their special day.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="./home.jpg"
              alt="Our bridal boutique"
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To help every bride find her dream dress with exceptional service and handpicked designs.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be the ultimate bridal destination for elegant, personalized, and unforgettable experiences.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Values</h3>
            <p className="text-gray-700">
              Quality, passion, attention to detail, and genuine care guide everything we do.
            </p>
          </div>
        </div>

        {/* Review Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-[#4D3925] text-center mb-4">
            Client Reviews
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Share your experience with us and help other brides find their perfect dress
          </p>

          {/* Review Form */}
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-pink-100">
              <h3 className="text-2xl font-semibold text-[#4D3925] mb-6 text-center">Share Your Experience</h3>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  {success}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newReview.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[5, 4, 3, 2, 1].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                      className={`p-2 rounded-full transition-all ${
                        newReview.rating === num 
                          ? 'bg-pink-100 text-pink-600' 
                          : 'text-gray-300 hover:text-pink-400'
                      }`}
                    >
                      <span className="text-2xl">★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={newReview.content}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                  placeholder="Share your experience with us..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#B76E79] text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-all transform hover:scale-[1.02] ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div className="space-y-8">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-white rounded-xl p-8 shadow-lg border border-pink-50 transform transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#4D3925] font-semibold">{review.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed pl-13">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
