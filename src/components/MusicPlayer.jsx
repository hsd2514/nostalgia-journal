import React, { useState, useRef } from "react";

const MusicPlayer = ({ autoPlay }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay || false);
  const [volume, setVolume] = useState(0.05); // Default volume

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Play failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <div className="music-player">
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <audio
        ref={audioRef}
        src="music/background-music.mp3"
        loop
        autoPlay={autoPlay}
        onError={(e) => {
          console.error("Error playing audio:", e);
        }}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
