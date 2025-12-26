import { useAudioPlayer } from "expo-audio";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * SoundProvider
 * - Manages global sound and audio playback
 * - Plays, toggles, and resumes background music and effects
 */

// TODO: Fix

// ===== Sound files =====
const clickSound = require("../assets/sounds/button-click-sound.mp3");

type SoundContextType = {
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  playClickSound: (forcePlay?: boolean) => void;
};

const SoundContext = createContext<SoundContextType>({
  soundOn: true,
  setSoundOn: () => {},
  playClickSound: () => {},
});

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundOn, setSoundOn] = useState(true);
  const hasStarted = useRef(false);

  // ===== Audio players =====
  const clickPlayer = useAudioPlayer(clickSound);

  // ===== Play click sound =====
  const playClickSound = useCallback(
    (forcePlay = false) => {
      if (!soundOn && !forcePlay) return;
      try {
        clickPlayer.seekTo(0);
        clickPlayer.play();
      } catch (error) {
        console.error("Click sound error:", error);
      }
    },
    [soundOn, clickPlayer]
  );


  return (
    <SoundContext.Provider
      value={{
        soundOn,
        setSoundOn,
        playClickSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

// ===== Custom hook: useSound =====
export const useSound = () => useContext(SoundContext);
