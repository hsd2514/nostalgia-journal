import React from "react";
import sticker1 from "../assets/sticker1.png";
import sticker2 from "../assets/sticker2.png";
import sticker3 from "../assets/sticker3.png";
import sticker4 from "../assets/sticker4.png";

export default function FloatingStickers() {
  return (
    <div className="floating-stickers">
      <img
        src={sticker1}
        alt="Sticker 1"
        className="floating-sticker sticker1"
      />
      <img
        src={sticker2}
        alt="Sticker 2"
        className="floating-sticker sticker2"
      />
      <img
        src={sticker3}
        alt="Sticker 3"
        className="floating-sticker sticker3"
      />
      <img
        src={sticker4}
        alt="Sticker 4"
        className="floating-sticker sticker4"
      />
    </div>
  );
}
