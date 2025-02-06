import React, { useState, useEffect } from 'react';
import { Gallery } from '../../components/gallery/index.jsx';
import { WindowProvider } from '../../components/window/index.jsx';

// Import images
import thumb02 from '../../media/hilbert-bell/top/1-0.2-50.gif';
import full02 from '../../media/hilbert-bell/top/1-0.2-1000.gif';
import thumb04 from '../../media/hilbert-bell/top/1-0.4-50.gif';
import full04 from '../../media/hilbert-bell/top/1-0.4-1000.gif';
import thumb06 from '../../media/hilbert-bell/top/1-0.6-50.gif';
import full06 from '../../media/hilbert-bell/top/1-0.6-1000.gif';
import thumb08 from '../../media/hilbert-bell/top/1-0.8-50.gif';
import full08 from '../../media/hilbert-bell/top/1-0.8-1000.gif';
import thumb09 from '../../media/hilbert-bell/top/1-0.9-50.gif';
import full09 from '../../media/hilbert-bell/top/1-0.9-1000.gif';


// Image data
const images = [
  {
    src: full02,
    thumbSrc: thumb02,
    alt: "Hilbert Bell Animation (0.2 parameter)",
    title: "Hilbert Bell - 0.2"
  },
  {
    src: full04,
    thumbSrc: thumb04,
    alt: "Hilbert Bell Animation (0.4 parameter)",
    title: "Hilbert Bell - 0.4"
  },
  {
    src: full06,
    thumbSrc: thumb06,
    alt: "Hilbert Bell Animation (0.6 parameter)",
    title: "Hilbert Bell - 0.6"
  },
  {
    src: full08,
    thumbSrc: thumb08,
    alt: "Hilbert Bell Animation (0.8 parameter)",
    title: "Hilbert Bell - 0.8"
  },
  {
    src: full09,
    thumbSrc: thumb09,
    alt: "Hilbert Bell Animation (0.9 parameter)",
    title: "Hilbert Bell - 0.9"
  }
];

export default function GalleryIndex() {
  return (
    <WindowProvider>
      <div className="flex flex-col items-center gap-4">
        <Gallery
          images={images.map(item => ({
            thumb: item.thumbSrc,
            full: item.src,
            alt: item.alt
          }))}
        />
        <a 
          href="/gallery/hilbert-bell" 
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mt-4"
        >
          View More Hilbert Bell Animations →
        </a>
      </div>
    </WindowProvider>
  );
}
