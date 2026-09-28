import { useEffect, useState } from 'react'
import { ImagePlus } from 'lucide-react'

export default function ImageSlot({ src, alt = '', className = '', fit = 'cover' }) {
  const [failed, setFailed] = useState(!src)
  useEffect(() => setFailed(!src), [src])

  if (failed) {
    return (
      <div className={`img-slot ${className}`} role="img" aria-label={alt || 'Imagen pendiente'}>
        <ImagePlus size={26} strokeWidth={1.5} />
        <span>{src ? `public${src}` : 'Imagen pendiente'}</span>
      </div>
    )
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={{ objectFit: fit }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}