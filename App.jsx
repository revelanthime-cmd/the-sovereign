import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase-config';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { createRoot } from 'react-dom/client';

function SovereignApp() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({ current_king_name: "...", site_title: "CHARGEMENT", price: 1.00 });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    const unsub = onSnapshot(doc(db, 'global_state', 'main'), (snap) => {
      if (snap.exists()) {
        setState(snap.data());
      } else {
        setDoc(doc(db, 'global_state', 'main'), {
          current_king: "",
          current_king_name: "Personne",
          site_title: "THE SOVEREIGN",
          price: 1.00
        });
      }
    });
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());

  const takeControl = async () => {
    if (!user) return login();
    await updateDoc(doc(db, 'global_state', 'main'), {
      current_king: user.uid,
      current_king_name: user.displayName,
      price: state.price + 0.50 
    });
  };

  const updateTitle = (newTitle) => {
    if (user?.uid !== state.current_king) return;
    updateDoc(doc(db, 'global_state', 'main'), { site_title: newTitle });
  };

  const isKing = user?.uid === state.current_king;

  return (
    <div className={`min-h-screen ${isKing ? 'bg-zinc-900' : 'bg-black'} text-white font-mono flex flex-col items-center justify-center p-6 transition-all duration-1000`}>
      <div className="absolute top-6 left-6 text-[10px] opacity-40 uppercase tracking-widest">
        {user ? `Identified: ${user.displayName}` : 'Status: Unidentified'}
      </div>
      <div className="max-w-3xl w-full">
        {isKing ? (
          <input 
            className="w-full bg-transparent text-6xl md:text-8xl font-black uppercase text-center outline-none border-b-4 border-indigo-600 pb-4 mb-4"
            defaultValue={state.site_title}
            onBlur={(e) => updateTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-6xl md:text-8xl font-black uppercase text-center leading-none mb-4 tracking-tighter">
            {state.site_title}
          </h1>
        )}
        <p className="text-center text-sm md:text-xl opacity-50 mb-12 italic">
          Sous le contrôle de <span className="text-indigo-400 font-bold underline">@{state.current_king_name}</span>
        </p>
        <div className="flex justify-center">
          {!isKing ? (
            <button onClick={takeControl} className="bg-white text-black px-10 py-5 text-2xl font-bold uppercase hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[10px_10px_0px_0px_rgba(79,70,229,1)]">
              Prendre le trône ({state.price.toFixed(2)}€)
            </button>
          ) : (
            <div className="text-indigo-400 animate-pulse font-bold border-2 border-indigo-400 p-4 uppercase">Vous êtes le souverain du monde.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<SovereignApp />);
