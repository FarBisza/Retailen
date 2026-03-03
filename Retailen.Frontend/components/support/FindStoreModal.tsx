import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Navigation } from 'lucide-react';

interface FindStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface StoreLocation {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    hours: string;
    type: 'warehouse' | 'showroom' | 'distribution';
    lat: number;
    lng: number;
}

const STORES: StoreLocation[] = [
    {
        id: 1,
        name: 'Retailen Central Warehouse',
        address: 'ul. Magazynowa 15',
        city: 'Warsaw',
        country: 'Poland',
        phone: '+48 22 123 4567',
        hours: 'Mon-Fri 8:00-18:00',
        type: 'warehouse',
        lat: 52.2297,
        lng: 21.0122,
    },
    {
        id: 2,
        name: 'Retailen Distribution Center',
        address: 'Industriestraße 42',
        city: 'Berlin',
        country: 'Germany',
        phone: '+49 30 987 6543',
        hours: 'Mon-Sat 7:00-20:00',
        type: 'distribution',
        lat: 52.5200,
        lng: 13.4050,
    },
    {
        id: 3,
        name: 'Retailen Showroom',
        address: '23 Oxford Street',
        city: 'London',
        country: 'United Kingdom',
        phone: '+44 20 7946 0958',
        hours: 'Mon-Sun 10:00-21:00',
        type: 'showroom',
        lat: 51.5074,
        lng: -0.1278,
    },
    {
        id: 4,
        name: 'Retailen Logistics Hub',
        address: 'Rue de la Logistique 8',
        city: 'Paris',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        hours: 'Mon-Fri 6:00-22:00',
        type: 'distribution',
        lat: 48.8566,
        lng: 2.3522,
    },
    {
        id: 5,
        name: 'Retailen Kraków Showroom',
        address: 'ul. Floriańska 10',
        city: 'Kraków',
        country: 'Poland',
        phone: '+48 12 345 6789',
        hours: 'Mon-Sat 10:00-20:00',
        type: 'showroom',
        lat: 50.0647,
        lng: 19.9450,
    },
    {
        id: 6,
        name: 'Retailen Nordic Center',
        address: 'Drottninggatan 55',
        city: 'Stockholm',
        country: 'Sweden',
        phone: '+46 8 123 456 78',
        hours: 'Mon-Fri 9:00-18:00',
        type: 'distribution',
        lat: 59.3293,
        lng: 18.0686,
    },
];

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
    warehouse: { label: 'Warehouse', color: 'bg-amber-100 text-amber-700' },
    showroom: { label: 'Showroom', color: 'bg-blue-100 text-blue-700' },
    distribution: { label: 'Distribution', color: 'bg-green-100 text-green-700' },
};

const FindStoreModal: React.FC<FindStoreModalProps> = ({ isOpen, onClose }) => {
    const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORES[0]);

    if (!isOpen) return null;

    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedStore.lng - 0.05}%2C${selectedStore.lat - 0.03}%2C${selectedStore.lng + 0.05}%2C${selectedStore.lat + 0.03}&layer=mapnik&marker=${selectedStore.lat}%2C${selectedStore.lng}`;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Find a Store</h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">{STORES.length} locations across Europe</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Map */}
                    <div className="flex-1 min-h-[250px] lg:min-h-0 bg-gray-100 relative">
                        <iframe
                            src={mapSrc}
                            className="w-full h-full border-0 absolute inset-0"
                            title="Store Location Map"
                        />
                    </div>

                    {/* Store List */}
                    <div className="w-full lg:w-[360px] overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-100 flex-shrink-0">
                        <div className="p-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 px-2">Locations</h3>
                            <div className="space-y-2">
                                {STORES.map((store) => {
                                    const typeStyle = TYPE_STYLES[store.type];
                                    const isSelected = selectedStore.id === store.id;
                                    return (
                                        <button
                                            key={store.id}
                                            onClick={() => setSelectedStore(store)}
                                            className={`w-full text-left p-4 rounded-lg transition-all ${isSelected
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'bg-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                    {store.name}
                                                </h4>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${isSelected ? 'bg-white/20 text-white' : typeStyle.color}`}>
                                                    {typeStyle.label}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className={isSelected ? 'text-white/60' : 'text-gray-400'} />
                                                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                                        {store.address}, {store.city}, {store.country}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={12} className={isSelected ? 'text-white/60' : 'text-gray-400'} />
                                                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                                        {store.phone}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className={isSelected ? 'text-white/60' : 'text-gray-400'} />
                                                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                                        {store.hours}
                                                    </span>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <a
                                                    href={`https://www.openstreetmap.org/?mlat=${store.lat}&mlon=${store.lng}#map=15/${store.lat}/${store.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Navigation size={12} /> Get Directions
                                                </a>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindStoreModal;
