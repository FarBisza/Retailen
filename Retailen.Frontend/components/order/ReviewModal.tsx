import React, { useState } from 'react';
import { X, Star, Edit3 } from 'lucide-react';
import { Order, OrderItem } from '../../api/orderApi';
import { submitReview } from '../../api/reviewApi';

interface ReviewModalProps {
    order: Order;
    onClose: () => void;
    onReviewSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose, onReviewSuccess }) => {
    const [selectedItemForReview, setSelectedItemForReview] = useState<OrderItem | null>(
        order.items.length > 0 ? order.items[0] : null
    );
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const handleReviewSubmit = async () => {
        if (!selectedItemForReview) return;

        setReviewLoading(true);
        try {
            await submitReview(
                selectedItemForReview.productId.toString(),
                reviewRating,
                reviewComment
            );
            onReviewSuccess();
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Review failed:', err);
            alert('Failed to submit review. Please try again.');
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star size={32} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                        Write a Review
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Order #{order.id}
                    </p>
                </div>

                {order.items.length > 1 && (
                    <div className="mb-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            Select Product to Review
                        </label>
                        <select
                            value={selectedItemForReview?.productId || ''}
                            onChange={(e) => {
                                const item = order.items.find(
                                    (p) => p.productId === Number(e.target.value)
                                );
                                if (item) setSelectedItemForReview(item);
                            }}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900"
                        >
                            {order.items.map((item) => (
                                <option key={item.productId} value={item.productId}>
                                    {item.productName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedItemForReview && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 p-2 flex-shrink-0">
                            <img
                                src={selectedItemForReview.imageUrl || 'https://via.placeholder.com/100?text=No+Image'}
                                alt={selectedItemForReview.productName}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{selectedItemForReview.productName}</p>
                            <p className="text-xs text-gray-400">Qty: {selectedItemForReview.quantity}</p>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                        Your Rating
                    </label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={36}
                                    className={
                                        star <= reviewRating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-200'
                                    }
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        {reviewRating === 1 && 'Poor'}
                        {reviewRating === 2 && 'Fair'}
                        {reviewRating === 3 && 'Good'}
                        {reviewRating === 4 && 'Very Good'}
                        {reviewRating === 5 && 'Excellent!'}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Your Review (Optional)
                    </label>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={4}
                        className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-slate-900 resize-none"
                    />
                </div>

                <button
                    onClick={handleReviewSubmit}
                    disabled={reviewLoading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {reviewLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                        <>
                            <Edit3 size={18} />
                            Submit Review
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
