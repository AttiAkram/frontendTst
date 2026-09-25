import { useState } from 'react'
import { img } from '../data/images'

interface Props {
  id: string
  alt: string
  w?: number
  className?: string
  priority?: boolean
  label?: string
}

/** Lazy photo with fade-in and a neutral fallback when the image can't load. */
export function Photo({ id, alt, w = 900, className = '', priority, label }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <span className={`photo photo--${state} ${className}`}>
      {state !== 'error' && (
        <img
          src={img(id, w)}
          srcSet={`${img(id, Math.round(w / 2))} ${Math.round(w / 2)}w, ${img(id, w)} ${w}w, ${img(id, w * 2)} ${w * 2}w`}
          sizes={`(max-width: 760px) 100vw, ${w}px`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
        />
      )}
      {state === 'error' && <span className="photo__fallback">{label ?? alt}</span>}
    </span>
  )
}
