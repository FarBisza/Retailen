import React, { useState } from 'react';
import { Edit3, Trash2, UserX, CheckCircle, Eye } from 'lucide-react';
import { User, getAllUsers, setUserActive, setUserRole, deleteUser } from '../../api/adminApi';

interface AdminUsersTabProps {
    users: User[];
    loading: boolean;
    isAdmin: boolean;
    activeTab: 'customers' | 'employees';
    onRefresh: (users: User[]) => void;
    onEditUser: (user: User) => void;
}

const roleColorMap: Record<string, string> = {
    'Admin': 'bg-purple-50 text-purple-600 border-purple-100',
    'Employee': 'bg-blue-50 text-blue-600 border-blue-100',
    'Supplier': 'bg-amber-50 text-amber-600 border-amber-100',
};
const roleIdMap: Record<string, number> = { 'Admin': 1, 'Customer': 2, 'Employee': 3, 'Supplier': 4 };

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
    users, loading, isAdmin, activeTab, onRefresh, onEditUser,
}) => {
    const [visibleCustomerCount, setVisibleCustomerCount] = useState(20);
    const [visibleStaffCount, setVisibleStaffCount] = useState(20);
    const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
        try {
            await setUserActive(userId, !currentStatus);
            onRefresh(
                users.map((u) =>
                    u.id === userId ? { ...u, isActive: !currentStatus } : u
                )
            );
            alert(currentStatus ? 'User has been blocked' : 'User has been activated');
        } catch (err) {
            console.error('Failed to update user status:', err);
            alert('Failed to update user status');
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        const newRoleId = roleIdMap[newRole];
        if (!newRoleId) return;
        try {
            await setUserRole(userId, newRoleId);
            const data = await getAllUsers();
            onRefresh(data);
            alert(`Role changed to ${newRole}`);
        } catch (err) {
            console.error('Failed to set role:', err);
            alert('Failed to update role');
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`Delete user ${user.firstName} ${user.lastName}?`)) return;
        try {
            await deleteUser(user.id);
            const data = await getAllUsers();
            onRefresh(data);
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('Failed to delete user');
        }
    };

    const customers = users.filter(u => u.role === 'Customer');
    const staff = users.filter(u => u.role !== 'Customer');

    // ─── CUSTOMERS VIEW ────────────────────────────────────────
    if (activeTab === 'customers') {
        return (
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        Customer Management
                    </h3>
                    <span className="text-[9px] font-bold text-gray-400">
                        {customers.length} Customers
                    </span>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                        <tr>
                            <th className="px-8 py-5">Profile</th>
                            <th className="px-8 py-5">Email Address</th>
                            <th className="px-8 py-5">Status</th>
                            {isAdmin && <th className="px-8 py-5 text-right">Management</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={isAdmin ? 4 : 3} className="px-8 py-10 text-center text-gray-400">
                                    Loading customers...
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 4 : 3} className="px-8 py-10 text-center text-gray-400">
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            customers.slice(0, visibleCustomerCount).map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/20 text-xs transition-colors">
                                    <td className="px-8 py-5 flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] ${u.isActive
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-gray-200 text-gray-400'
                                                }`}
                                        >
                                            {u.firstName?.charAt(0) || u.email?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900">
                                                {u.firstName} {u.lastName}
                                            </div>
                                            <div className="text-[9px] text-gray-400">ID: {u.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-400">
                                        {u.email}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${u.isActive ? 'text-green-600' : 'text-red-500'
                                                }`}>
                                                {u.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onEditUser(u)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-gray-200 text-gray-500 hover:text-slate-900 hover:border-slate-900 transition-colors"
                                                >
                                                    <Edit3 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${u.isActive
                                                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                                                        : 'border-green-200 text-green-600 hover:bg-green-50'
                                                        }`}
                                                >
                                                    {u.isActive ? (
                                                        <><UserX size={12} /> Block</>
                                                    ) : (
                                                        <><CheckCircle size={12} /> Activate</>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Show More / Counter */}
                {customers.length > 0 && (
                    <div className="flex items-center justify-between px-8 py-3 border-t border-gray-50">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing {Math.min(visibleCustomerCount, customers.length)} of {customers.length}
                        </span>
                        {visibleCustomerCount < customers.length && (
                            <button
                                onClick={() => setVisibleCustomerCount(prev => prev + 20)}
                                className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                            >
                                Show More ({customers.length - visibleCustomerCount} remaining)
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── EMPLOYEES VIEW ────────────────────────────────────────
    return (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Staff & Role Management
                </h3>
                <div className="flex items-center gap-3">
                    {!isAdmin && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                            <Eye size={10} /> View Only
                        </span>
                    )}
                    <span className="text-[9px] font-bold text-gray-400">
                        {staff.length} Staff Members
                    </span>
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                    <tr>
                        <th className="px-8 py-5">Profile</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5">Status</th>
                        {isAdmin && <th className="px-8 py-5 text-right">Management</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4} className="px-8 py-10 text-center text-gray-400">
                                Loading staff...
                            </td>
                        </tr>
                    ) : staff.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4} className="px-8 py-10 text-center text-gray-400">
                                No staff members found
                            </td>
                        </tr>
                    ) : (
                        staff.slice(0, visibleStaffCount).map((u) => {
                            const avatarColor = u.role === 'Admin' ? 'bg-purple-600' : u.role === 'Supplier' ? 'bg-amber-600' : 'bg-blue-600';
                            return (
                                <tr key={u.id} className="hover:bg-gray-50/20 text-xs transition-colors">
                                    <td className="px-8 py-5 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] text-white ${avatarColor}`}>
                                            {u.firstName?.charAt(0) || u.email?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900">
                                                {u.firstName} {u.lastName}
                                            </div>
                                            <div className="text-[9px] text-gray-400">ID: {u.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-400">{u.email}</td>
                                    <td className="px-8 py-5">
                                        {isAdmin ? (
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-sm border cursor-pointer appearance-none min-w-[100px] ${roleColorMap[u.role] || 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                            >
                                                {['Admin', 'Employee', 'Supplier'].map((r) => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-sm border inline-block ${roleColorMap[u.role] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {u.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${u.isActive ? 'text-green-600' : 'text-red-500'
                                                }`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEditUser(u)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-gray-200 text-gray-500 hover:text-slate-900 hover:border-slate-900 transition-colors"
                                                >
                                                    <Edit3 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${u.isActive
                                                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                                                        : 'border-green-200 text-green-600 hover:bg-green-50'
                                                        }`}
                                                >
                                                    {u.isActive ? <><UserX size={12} /> Deactivate</> : <><CheckCircle size={12} /> Activate</>}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-gray-200 text-red-400 hover:text-red-600 hover:border-red-300 transition-colors"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {/* Show More / Counter */}
            {staff.length > 0 && (
                <div className="flex items-center justify-between px-8 py-3 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Showing {Math.min(visibleStaffCount, staff.length)} of {staff.length}
                    </span>
                    {visibleStaffCount < staff.length && (
                        <button
                            onClick={() => setVisibleStaffCount(prev => prev + 20)}
                            className="bg-gray-100 text-slate-700 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm"
                        >
                            Show More ({staff.length - visibleStaffCount} remaining)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
