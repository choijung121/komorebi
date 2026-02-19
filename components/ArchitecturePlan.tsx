
import React from 'react';

const ArchitecturePlan: React.FC = () => {
  return (
    <div className="p-6 pb-24 h-full overflow-y-auto bg-gray-50">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">React Native Plan</h1>
        <p className="text-gray-500">Komorebi Mobile Core Architecture</p>
      </header>

      {/* Database & State */}
      <section className="mb-10">
        <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-code-branch text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Project Structure</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <ul className="text-sm text-gray-600 space-y-3 font-mono">
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/navigation/ <span className="ml-2 text-gray-400 font-sans">// Stack & Tab Navigators</span></li>
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/screens/ <span className="ml-2 text-gray-400 font-sans">// Feed, Vault, Drop, Profile</span></li>
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/components/ <span className="ml-2 text-gray-400 font-sans">// Atom & Molecule UI</span></li>
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/store/ <span className="ml-2 text-gray-400 font-sans">// Zustand/Redux for Room data</span></li>
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/hooks/ <span className="ml-2 text-gray-400 font-sans">// usePhotos, useRoomVibe</span></li>
            <li className="flex items-center"><i className="fa-solid fa-folder text-amber-400 mr-2"></i> src/services/ <span className="ml-2 text-gray-400 font-sans">// Gemini API & Firebase Bridge</span></li>
          </ul>
        </div>
      </section>

      {/* Dependencies */}
      <section className="mb-10">
        <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg text-white">
                <i className="fa-solid fa-cube text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Native Modules</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'expo-image', desc: 'Blurred placeholders' },
            { name: 'react-navigation', desc: 'Native Transitions' },
            { name: 'react-native-reanimated', desc: '60fps UI Logic' },
            { name: 'expo-av', desc: 'Audio Snippets' },
            { name: 'react-native-maps', desc: 'Shared Room Map' },
            { name: 'expo-haptics', desc: 'Mood Reactions' },
          ].map((lib, i) => (
            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs font-bold text-gray-900 mb-1">{lib.name}</p>
              <p className="text-[10px] text-gray-500">{lib.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON Schema */}
      <section className="mb-10">
        <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                <i className="fa-solid fa-brackets-curly text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900">State Schema (Zustand)</h2>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto shadow-xl">
          <pre className="text-emerald-400 text-[10px] leading-relaxed">
{`interface KomorebiState {
  user: UserProfile;
  activeRooms: Room[];
  currentDrop: Drop | null;
  
  // Actions
  fetchDailyFeed: () => Promise<void>;
  contributeToRoom: (photo: Photo) => void;
  unlockCapsule: (photoId: string) => void;
  updateVibe: (roomId: string, mood: Mood) => void;
}`}
          </pre>
        </div>
      </section>
      
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
        <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-1">Deployment Target</p>
        <p className="text-sm text-amber-900">Optimized for iOS 15+ & Android 12 (API 31)</p>
      </div>
    </div>
  );
};

export default ArchitecturePlan;
