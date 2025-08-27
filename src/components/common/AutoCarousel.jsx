import React, { useEffect, useState, useRef } from 'react'

/**
 * AutoCarousel
 * Props:
 *  - images: [{ src, alt, caption? }]
 *  - interval: ms between slides (default 4000)
 *  - transition: ms animation duration (default 600)
 */
export default function AutoCarousel({ images = [], interval = 4000, transition = 600 }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const count = images.length

  useEffect(() => {
    if (count <= 1) return
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % count)
    }, interval)
    return () => clearInterval(timerRef.current)
  }, [count, interval])

  if (!count) return null

  return (
    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-rose-100 bg-white shadow-sm">
      {/* Slides */}
      <div
        className="flex w-full"
        style={{ transform: `translateX(-${index * 100}%)`, transition: `transform ${transition}ms ease` }}
      >
        {images.map((img, i) => (
          <div key={i} className="w-full flex-shrink-0 aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] relative flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100">
            {/* eslint-disable-next-line */}
            <img
              src={img.src}
              alt={img.alt || ''}
              className="max-h-full max-w-full object-contain p-6 opacity-90 mix-blend-multiply"
              draggable={false}
            />
            {img.caption && (
              <div className="absolute bottom-3 left-4 right-4 text-xs sm:text-sm bg-rose-600/80 backdrop-blur text-white px-3 py-1.5 rounded shadow">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-5 bg-rose-600' : 'w-2.5 bg-rose-300 hover:bg-rose-400'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
