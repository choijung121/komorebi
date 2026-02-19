
import React from 'react';
import { Photo, Room, User } from '../types';

interface FeedCardProps {
  photo: Photo;
  room?: Room;
  uploader?: User;
}

const FeedCard: React.FC<FeedCardProps> = ({ photo, room, uploader }) => {
  const isLocked = photo.unlockDate && new Date(photo.unlockDate) > new Date();

  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden mb-8 transition-all hover:shadow-xl active:scale-[0.99]">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={uploader?.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{uploader?.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{room?.name}</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-300">
            <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden mx-2 rounded-[24px]">
        <img 
          src={photo.url} 
          className={`w-full h-full object-cover transition-all duration-1000 ${isLocked ? 'blur-3xl scale-125 opacity-40' : 'group-hover:scale-105'}`}
          alt={photo.caption} 
        />
        
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/5 backdrop-blur-xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-5 border border-white/30 shadow-2xl">
              <i className="fa-solid fa-hourglass-half text-2xl text-white"></i>
            </div>
            <p className="text-white font-black text-xl mb-1 tracking-tight">Time Capsule</p>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Unlocks {new Date(photo.unlockDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        )}

        {photo.audioSnippetUrl && !isLocked && (
            <button className="absolute bottom-5 right-5 w-12 h-12 bg-black/40 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/60 shadow-2xl active:scale-90 transition-all">
              <i className="fa-solid fa-volume-high"></i>
            </button>
        )}
      </div>

      {/* Footer */}
      {!isLocked && (
        <div className="p-5">
          <div className="flex items-center space-x-5 mb-5">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
              <i className="fa-regular fa-heart text-xl"></i>
              <span className="text-[10px] font-black uppercase">12</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
              <i className="fa-regular fa-comment text-xl"></i>
              <span className="text-[10px] font-black uppercase">4</span>
            </button>
            <button className="text-gray-400 hover:text-amber-500 transition-colors ml-auto">
              <i className="fa-regular fa-bookmark text-xl"></i>
            </button>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed font-medium">
            <span className="font-black mr-2 text-gray-900">{uploader?.name}</span>
            {photo.caption}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {photo.aiTags.map(tag => (
              <span key={tag} className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded">#{tag.toLowerCase()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
