
import React, { useState, useMemo, useEffect } from 'react';
import { AppTab, Room, Photo } from './types';
import { currentUser, mockRooms, mockPhotos } from './mockData';
import FeedCard from './components/FeedCard';
import RoomVault from './components/RoomVault';
import ArchitecturePlan from './components/ArchitecturePlan';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Splash Screen Simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter for today's feed
  const todayPhotos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockPhotos.filter(p => p.timestamp.startsWith(today));
  }, []);

  // Filter for flashbacks
  const flashbacks = useMemo(() => {
    const today = new Date();
    return mockPhotos.filter(p => {
      const pDate = new Date(p.timestamp);
      return pDate.getDate() === today.getDate() && 
             pDate.getMonth() === today.getMonth() && 
             pDate.getFullYear() < today.getFullYear();
    });
  }, []);

  const selectedRoom = useMemo(() => 
    mockRooms.find(r => r.id === selectedRoomId), [selectedRoomId]
  );

  const roomPhotos = useMemo(() => 
    mockPhotos.filter(p => p.roomId === selectedRoomId), [selectedRoomId]
  );

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
        <div className="w-24 h-24 bg-black rounded-[32px] flex items-center justify-center animate-bounce shadow-2xl mb-8">
            <span className="text-white font-black text-4xl">K</span>
        </div>
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Komorebi</h1>
            <p className="text-gray-400 text-sm mt-1 animate-pulse">Capturing light between leaves...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PLAN:
        return <ArchitecturePlan />;
      
      case AppTab.ROOMS:
        return (
          <div className="p-6 pb-24 h-full overflow-y-auto bg-gray-50/50 pt-12">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Rooms</h1>
              <p className="text-gray-500">Your private sanctuaries</p>
            </header>
            <div className="space-y-5">
              {mockRooms.map(room => (
                <div 
                  key={room.id} 
                  onClick={() => setSelectedRoomId(room.id)}
                  className="group relative h-48 rounded-[32px] overflow-hidden cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                  <img src={room.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{room.name}</h3>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-user-group mr-2 text-[10px]"></i>
                        {room.memberIds.length} Members • {room.vibe}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 bg-white/50 transition-all active:scale-95">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">New Private Room</span>
              </button>
            </div>
          </div>
        );

      case AppTab.DROP:
        return (
            <div className="p-6 pb-24 h-full flex flex-col items-center justify-center text-center bg-white pt-12">
                <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mb-8 relative">
                    <i className="fa-solid fa-bolt-lightning text-5xl text-amber-500 animate-pulse"></i>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-20"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Start a Drop</h2>
                <p className="text-gray-500 mb-10 max-w-xs text-sm leading-relaxed">Instantly share photos with everyone at your current location for a limited time.</p>
                <div className="w-full space-y-3 px-4">
                    {mockRooms.map(room => (
                        <button key={room.id} className="w-full p-5 bg-white border border-gray-100 rounded-3xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                            <img src={room.coverImage} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-800">{room.name}</p>
                                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Ready for Drop</p>
                            </div>
                            <i className="fa-solid fa-circle-play text-gray-200 text-2xl"></i>
                        </button>
                    ))}
                </div>
            </div>
        );

      case AppTab.HOME:
      default:
        return (
          <div className="pb-24 h-full overflow-y-auto bg-white pt-12">
            {/* Home Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-2xl px-6 py-5 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                        <span className="text-white font-black text-xl">K</span>
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">Komorebi</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily Summary</span>
                    </div>
                </div>
                <div className="relative">
                    <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="Me" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                </div>
            </div>

            {/* Daily Feed */}
            <div className="px-6 py-6">
              {flashbacks.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Flashbacks</h2>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md">Past Memories</span>
                  </div>
                  <div className="flex space-x-5 overflow-x-auto pb-6 -mx-2 px-2 scroll-smooth no-scrollbar">
                    {flashbacks.map(photo => (
                      <div key={photo.id} className="flex-shrink-0 w-44 h-64 rounded-3xl overflow-hidden relative shadow-2xl transition-transform hover:scale-105 active:scale-95">
                        <img src={photo.url} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                            <i className="fa-solid fa-clock-rotate-left text-white/50 text-xs"></i>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-[10px] font-black text-white/60 mb-1 uppercase tracking-tighter">
                            {new Date(photo.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm font-bold leading-tight line-clamp-2">{photo.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
                    Today's Story
                    <div className="ml-3 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </h2>
                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black">View All</button>
              </div>
              
              {todayPhotos.length > 0 ? (
                todayPhotos.map(photo => (
                  <FeedCard 
                    key={photo.id} 
                    photo={photo} 
                    room={mockRooms.find(r => r.id === photo.roomId)}
                    uploader={photo.uploaderId === currentUser.id ? currentUser : { id: 'u-2', name: 'Sam Chen', avatar: 'https://picsum.photos/seed/u2/200/200', joinedRooms: [] }}
                  />
                ))
              ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 mx-2">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-6 text-gray-200">
                    <i className="fa-solid fa-camera-retro text-2xl"></i>
                  </div>
                  <p className="text-gray-500 font-bold text-sm">Nothing shared yet today.</p>
                  <p className="text-gray-400 text-xs mt-1">Start a conversation with a photo.</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white relative flex flex-col shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Simulation of Phone Notch / Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white/50 backdrop-blur-md z-[60] flex items-center justify-between px-8 text-[11px] font-bold text-gray-900">
        <span>9:41</span>
        <div className="flex items-center space-x-2">
            <i className="fa-solid fa-signal"></i>
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-battery-full"></i>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden pt-4">
        {renderContent()}
      </div>

      {/* Navigation Bar - Mobile HIG Optimized */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-gray-50 px-10 pt-4 pb-8 flex items-center justify-between z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => { setActiveTab(AppTab.HOME); setSelectedRoomId(null); }}
          className={`flex flex-col items-center group transition-transform active:scale-90 ${activeTab === AppTab.HOME ? 'text-black' : 'text-gray-300'}`}
        >
          <div className={`mb-1 transition-all ${activeTab === AppTab.HOME ? 'scale-110' : ''}`}>
            <i className={`fa-solid fa-house-chimney text-xl`}></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button 
          onClick={() => { setActiveTab(AppTab.ROOMS); setSelectedRoomId(null); }}
          className={`flex flex-col items-center group transition-transform active:scale-90 ${activeTab === AppTab.ROOMS ? 'text-black' : 'text-gray-300'}`}
        >
          <div className={`mb-1 transition-all ${activeTab === AppTab.ROOMS ? 'scale-110' : ''}`}>
            <i className="fa-solid fa-shapes text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Rooms</span>
        </button>
        <button 
          onClick={() => { setActiveTab(AppTab.DROP); setSelectedRoomId(null); }}
          className={`flex flex-col items-center group transition-transform active:scale-90 ${activeTab === AppTab.DROP ? 'text-black' : 'text-gray-300'}`}
        >
          <div className={`mb-1 transition-all ${activeTab === AppTab.DROP ? 'scale-110' : ''}`}>
            <i className="fa-solid fa-bolt-lightning text-xl text-amber-500"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Drop</span>
        </button>
        <button 
          onClick={() => { setActiveTab(AppTab.PLAN); setSelectedRoomId(null); }}
          className={`flex flex-col items-center group transition-transform active:scale-90 ${activeTab === AppTab.PLAN ? 'text-black' : 'text-gray-300'}`}
        >
          <div className={`mb-1 transition-all ${activeTab === AppTab.PLAN ? 'scale-110' : ''}`}>
            <i className="fa-solid fa-mobile-screen-button text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Dev</span>
        </button>
      </nav>

      {/* Room Detail Stack Simulation */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 animate-in slide-in-from-right duration-300">
            <RoomVault 
            room={selectedRoom} 
            photos={roomPhotos} 
            onBack={() => setSelectedRoomId(null)} 
            />
        </div>
      )}
      
      {/* Home Indicator Simulation */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 rounded-full z-50"></div>
    </div>
  );
};

export default App;
