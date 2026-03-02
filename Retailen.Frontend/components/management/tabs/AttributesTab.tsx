import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Attribute } from '../../../api/types';
import * as attributeApi from '../../../api/attributeApi';

interface AdminAttributesTabProps {
    onCreateAttribute: () => void;
}

export const AdminAttributesTab: React.FC<AdminAttributesTabProps> = ({
    onCreateAttribute,
}) => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAttributes = async () => {
            setLoading(true);
            try {
                const data = await attributeApi.getAllAttributes();
                setAttributes(data);
            } catch (err) {
                console.error('Failed to load attributes:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAttributes();
    }, []);

    return (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Global Attributes Registry
                </h3>
                <button
                    onClick={onCreateAttribute}
                    className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                >
                    <Plus size={14} /> New Attribute
                </button>
            </div>
            <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-50 text-[9px] font-black uppercase text-gray-400">
                    <tr>
                        <th className="px-8 py-4">ID</th>
                        <th className="px-8 py-4">Name</th>
                        <th className="px-8 py-4">Type</th>
                        <th className="px-8 py-4">Unit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-8 py-10 text-center text-gray-400">
                                Loading attributes...
                            </td>
                        </tr>
                    ) : attributes.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-8 py-10 text-center text-gray-400">
                                No attributes found
                            </td>
                        </tr>
                    ) : (
                        attributes.map((a) => (
                            <tr
                                key={a.id}
                                className="hover:bg-gray-50/20 transition-colors"
                            >
                                <td className="px-8 py-4 font-bold text-gray-400 text-xs">
                                    #{a.id}
                                </td>
                                <td className="px-8 py-4 font-black text-slate-900 text-xs">
                                    {a.name}
                                </td>
                                <td className="px-8 py-4 text-xs">{a.dataType}</td>
                                <td className="px-8 py-4 text-xs text-gray-500">
                                    {a.unit || '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
