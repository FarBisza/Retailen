import React, { useState, useEffect } from 'react';
import * as returnApi from '../../../api/returnApi';

export const AdminReturnsTab: React.FC = () => {
    const [returns, setReturns] = useState<returnApi.ReturnDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const loadReturns = async () => {
        setLoading(true);
        try {
            const result = await returnApi.getAllReturnsPaged(0, 20);
            setReturns(result.items);
            setTotalCount(result.totalCount);
        } catch (err) {
            console.error('Failed to load returns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReturns();
    }, []);


    const handleReturnStatusUpdate = async (
        returnId: number,
        newStatus: number,
        amount?: number
    ) => {
        try {
            await returnApi.updateReturnStatus(returnId, {
                returnStatusId: newStatus,
                refundAmount: amount,
            });
            loadReturns();
        } catch (err) {
            console.error('Return status update failed:', err);
            alert('Failed to update return status');
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Customer Return Requests
                </h3>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <span
                            key={s}
                            className={`px-3 py-1 text-[9px] font-black uppercase ${s === 1
                                ? 'bg-yellow-100 text-yellow-700'
                                : s === 2
                                    ? 'bg-green-100 text-green-700'
                                    : s === 3
                                        ? 'bg-red-100 text-red-700'
                                        : s === 4
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {
                                returnApi.RETURN_STATUS[
                                    s as keyof typeof returnApi.RETURN_STATUS
                                ]?.name
                            }
                        </span>
                    ))}
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-50 text-[9px] font-black uppercase text-gray-400">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Order</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                                Loading returns...
                            </td>
                        </tr>
                    ) : returns.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                                No return requests found
                            </td>
                        </tr>
                    ) : (
                        returns.map((r) => (
                            <tr
                                key={r.returnId}
                                className="hover:bg-gray-50/20 transition-colors"
                            >
                                <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                                    #{r.returnId}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600">
                                    {r.customerFirstName || r.customerEmail}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600">
                                    #{r.orderId}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600 max-w-[200px] truncate">
                                    {r.reason}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                                    ${r.refundAmount?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-[9px] font-black uppercase rounded ${r.returnStatusId === 1
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : r.returnStatusId === 2
                                                ? 'bg-green-100 text-green-700'
                                                : r.returnStatusId === 3
                                                    ? 'bg-red-100 text-red-700'
                                                    : r.returnStatusId === 4
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {returnApi.RETURN_STATUS[
                                            r.returnStatusId as keyof typeof returnApi.RETURN_STATUS
                                        ]?.name || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {r.returnStatusId === 1 && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    handleReturnStatusUpdate(r.returnId, 2, r.refundAmount)
                                                }
                                                className="px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase hover:bg-green-600"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await handleReturnStatusUpdate(r.returnId, 2, r.refundAmount);
                                                    await handleReturnStatusUpdate(r.returnId, 4, r.refundAmount);
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase hover:bg-blue-600"
                                            >
                                                Approve & Refund
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReturnStatusUpdate(r.returnId, 3)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {r.returnStatusId === 2 && (
                                        <button
                                            onClick={() =>
                                                handleReturnStatusUpdate(r.returnId, 4, r.refundAmount)
                                            }
                                            className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase hover:bg-blue-600"
                                        >
                                            Issue Refund
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {returns.length > 0 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Showing {returns.length} of {totalCount}
                    </span>
                    {returns.length < totalCount && (
                        <button
                            onClick={async () => {
                                try {
                                    const result = await returnApi.getAllReturnsPaged(returns.length, 20);
                                    setReturns(prev => [...prev, ...result.items]);
                                    setTotalCount(result.totalCount);
                                } catch (err) {
                                    console.error('Failed to load more returns:', err);
                                }
                            }}
                            className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                        >
                            Show More ({totalCount - returns.length} remaining)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
