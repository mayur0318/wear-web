import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';

export const ManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Populating the dummy data array exactly as requested
        const dummyData = [
            { _id: '1', customerName: 'John Doe', productName: 'Floral Shirt', rating: 4, comment: 'Great fit!', date: '2026-04-10' },
            { _id: '2', customerName: 'Alice Smith', productName: 'Cotton Hoodie', rating: 5, comment: 'So soft and warm!', date: '2026-04-12' },
            { _id: '3', customerName: 'Michael Brown', productName: 'Running Shoes', rating: 3, comment: 'A bit tight around the toes.', date: '2026-04-14' },
            { _id: '4', customerName: 'Sophia Wilson', productName: 'Denim Jacket', rating: 5, comment: 'Classic look, love the quality.', date: '2026-04-15' }
        ];
        setReviews(dummyData);
    }, []);

    const handleDeleteReview = (id) => {
        // Instantly update the UI by filtering the deleted review
        setReviews(reviews.filter(review => review._id !== id));
        toast.success("Review deleted successfully!");
    };

    const renderStars = (rating) => {
        return "⭐".repeat(rating);
    };

    return (
        <AdminLayout>
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
                
                <div className="mb-8 border-b border-gray-200 pb-6">
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Product Reviews Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Monitor and moderate customer feedback.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
                    <div className="overflow-x-auto w-full">
                        {/* Standard responsive Tailwind table structure */}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* Exactly 6 headers with bold, visible styling */}
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Review</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                                            {/* Exactly 6 matching TD elements for perfect alignment */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {review.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {review.productName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {renderStars(review.rating)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                "{review.comment}"
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {review.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right lg:text-left">
                                                <button 
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors font-bold text-xs uppercase"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                                            No reviews found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};
