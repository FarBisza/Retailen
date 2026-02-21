import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Mail, Calendar, Save, Edit3, Check } from 'lucide-react';
import { getMyProfile, updateMyProfile, CustomerProfile } from '../../api/profileApi';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Editable fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setSaved(false);
            getMyProfile()
                .then((p) => {
                    setProfile(p);
                    setFirstName(p.firstName || '');
                    setLastName(p.lastName || '');
                    setPhone(p.phone || '');
                    setAddress(p.address || '');
                    setCity(p.city || '');
                    setZipCode(p.zipCode || '');
                    setCountry(p.country || '');
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setEditing(false);
        }
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await updateMyProfile({
                firstName,
                lastName,
                phone,
                address,
                city,
                zipCode,
                country,
            });
            setProfile(updated);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const initials = profile
        ? `${(profile.firstName || '?')[0]}${(profile.lastName || '?')[0]}`
        : '?';

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center pointer-events-none">
                <div
                    className="bg-white w-full max-w-md mx-4 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            My Profile
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="px-8 py-20 text-center">
                            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs text-gray-400 mt-4 font-bold uppercase tracking-widest">
                                Loading profile...
                            </p>
                        </div>
                    ) : profile ? (
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Avatar + Name */}
                            <div className="px-8 py-6 flex items-center gap-5 bg-gray-50/50">
                                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                    <span className="text-xl font-black">{initials}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-black text-slate-900 truncate">
                                        {profile.firstName} {profile.lastName}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {profile.role || 'Customer'} · Since{' '}
                                        {profile.registeredAt
                                            ? new Date(profile.registeredAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="px-8 py-6 space-y-5">
                                {/* Email — read-only */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-2">
                                        <Mail size={10} /> Email
                                    </label>
                                    <input
                                        value={profile.email}
                                        disabled
                                        className="w-full border border-gray-100 bg-gray-50 p-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                                    />
                                </div>

                                {/* Name fields */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            disabled={!editing}
                                            className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                                ? 'border-gray-200 focus:border-slate-900'
                                                : 'border-gray-100 bg-gray-50 text-gray-600'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            disabled={!editing}
                                            className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                                ? 'border-gray-200 focus:border-slate-900'
                                                : 'border-gray-100 bg-gray-50 text-gray-600'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-2">
                                        <Phone size={10} /> Phone
                                    </label>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={!editing}
                                        placeholder={editing ? 'Enter phone number' : '—'}
                                        className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                            ? 'border-gray-200 focus:border-slate-900'
                                            : 'border-gray-100 bg-gray-50 text-gray-600'
                                            }`}
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-2">
                                        <MapPin size={10} /> Street Address
                                    </label>
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={!editing}
                                        placeholder={editing ? 'Enter street address' : '—'}
                                        className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                            ? 'border-gray-200 focus:border-slate-900'
                                            : 'border-gray-100 bg-gray-50 text-gray-600'
                                            }`}
                                    />
                                </div>

                                {/* City + Zip */}
                                <div className="flex gap-3">
                                    <div className="flex-[2]">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                            City
                                        </label>
                                        <input
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            disabled={!editing}
                                            placeholder={editing ? 'City' : '—'}
                                            className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                                ? 'border-gray-200 focus:border-slate-900'
                                                : 'border-gray-100 bg-gray-50 text-gray-600'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                            Zip Code
                                        </label>
                                        <input
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                            disabled={!editing}
                                            placeholder={editing ? 'Zip' : '—'}
                                            className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                                ? 'border-gray-200 focus:border-slate-900'
                                                : 'border-gray-100 bg-gray-50 text-gray-600'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                        Country
                                    </label>
                                    <input
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        disabled={!editing}
                                        placeholder={editing ? 'Country' : '—'}
                                        className={`w-full border p-3 text-sm font-bold outline-none transition-colors ${editing
                                            ? 'border-gray-200 focus:border-slate-900'
                                            : 'border-gray-100 bg-gray-50 text-gray-600'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-8 py-20 text-center">
                            <p className="text-sm text-gray-400 font-bold">Could not load profile</p>
                        </div>
                    )}

                    {/* Action Bar */}
                    {profile && !loading && (
                        <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
                            {editing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            // Reset to original values
                                            setFirstName(profile.firstName || '');
                                            setLastName(profile.lastName || '');
                                            setPhone(profile.phone || '');
                                            setAddress(profile.address || '');
                                            setCity(profile.city || '');
                                            setZipCode(profile.zipCode || '');
                                            setCountry(profile.country || '');
                                        }}
                                        className="flex-1 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Save size={12} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
                                >
                                    {saved ? (
                                        <>
                                            <Check size={12} /> Saved Successfully
                                        </>
                                    ) : (
                                        <>
                                            <Edit3 size={12} /> Edit Profile
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileModal;
