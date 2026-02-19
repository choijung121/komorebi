
import React, { useState, useEffect } from 'react';
import { Room, Photo, User } from '../types';
import { getVibeSummary } from '../services/geminiService';

interface RoomVaultProps {
  room: Room;
  photos: Photo[];
  onBack: () => void;
}

const RoomVault: React.FC<RoomVaultProps> = ({ room, photos, onBack }) => {
  const [vibeCheck, setVibeCheck] = useState('Generating vibe check...');

  useEffect(() => {
    const fetchVibe = async () => {
      const summary = await getVibeSummary(photos.map(p => ({ caption: p.caption, tags: p.aiTags })));
      setVibeCheck(summary);
    };
    fetchVibe();
  }, [photos]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Dynamic Header */}
      <div 
        className="h-64 relative bg-gray-900 transition-colors duration-1000"
        style={{ backgroundColor: room.color }}
      >
        <img src={room.coverImage} className="w-full h-full object-cover opacity-50" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold rounded-full border border-white/20">
              {room.vibe} VIBE
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-1">{room.name}</h1>
          <p className="text-white/80 text-sm line-clamp-1">{room.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Vibe Meter Section */}
        <div className="my-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Room Vibe Check</h3>
            <i className="fa-solid fa-sparkles text-amber-400"></i>
          </div>
          <p className="text-gray-600 text-sm italic italic leading-relaxed">
            "{vibeCheck}"
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex space-x-4 mb-8">
            <button className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:bg-gray-50">
                <i className="fa-solid fa-map-location-dot text-indigo-500 mb-2"></i>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Shared Map</span>
            </button>
            <button className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:bg-gray-50">
                <i className="fa-solid fa-users text-emerald-500 mb-2"></i>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Members</span>
            </button>
            <button className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:bg-gray-50">
                <i className="fa-solid fa-book-open text-amber-500 mb-2"></i>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Annual Book</span>
            </button>
        </div>

        {/* Gallery Grid */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">The Vault</h2>
            <span className="text-xs font-bold text-gray-400">{photos.length} MEDIA</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
            {photos.map(p => (
                <div key={p.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden group relative">
                    <img src={p.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                    {p.unlockDate && new Date(p.unlockDate) > new Date() && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <i className="fa-solid fa-lock text-white/70 text-sm"></i>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Persistent Upload Floating Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
        <i className="fa-solid fa-plus text-xl"></i>
      </button>
    </div>
  );
};

export default RoomVault;
