'use client'

import { useEffect, useRef, useState } from 'react'
import type * as Three from 'three'
import { content } from '@/lib/content'

type VideoMemoryProps = {
  onDone: () => void
  /** The song steps aside for the whole screen, not just while the clip runs. */
  hushSong: () => void
  resumeSong: () => void
}

type Stage = 'intro' | 'playing' | 'closing'

/** How long the room sits dark, song already hushed, before the clip starts. */
const ENTER_MS = 1500
/** How long the picture takes to open out of a slit and fill the window. */
const OPEN_MS = 2400
/** How long the room stays dark after the clip before the next page. */
const CLOSE_MS = 2600

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * True only on a phone-sized touch screen currently held upright. A laptop
 * window that happens to be taller than it is wide must not trigger this.
 */
function isUprightPhone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(
    '(orientation: portrait) and (pointer: coarse) and (max-width: 900px)'
  ).matches
}

export default function VideoMemory({ onDone, hushSong, resumeSong }: VideoMemoryProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Set the moment she presses play; the render loop animates from it. */
  const openedAt = useRef<number | null>(null)
  const exitTimer = useRef<number | null>(null)

  const [stage, setStage] = useState<Stage>('intro')
  const [missing, setMissing] = useState(false)
  // Only shown if the browser refuses to start the clip on its own.
  const [blocked, setBlocked] = useState(false)
  // If WebGL is unavailable the clip still has to play, just as a plain video.
  const [flat, setFlat] = useState(false)
  // The clip is widescreen, so a phone held upright is asked to turn first.
  const [upright, setUpright] = useState(isUprightPhone)

  useEffect(() => {
    const portrait = window.matchMedia('(orientation: portrait)')
    const update = () => setUpright(isUprightPhone())
    portrait.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      portrait.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // The room goes quiet the moment she walks into it.
  useEffect(() => {
    hushSong()
  }, [hushSong])

  // Then, after a beat of darkness, the clip starts by itself. A phone held
  // upright waits until it has been turned.
  useEffect(() => {
    if (stage !== 'intro' || missing || upright) return
    const id = window.setTimeout(() => {
      setStage('playing')
      openedAt.current = performance.now()
      videoRef.current?.play().catch(() => setBlocked(true))
    }, ENTER_MS)
    return () => window.clearTimeout(id)
  }, [stage, missing, upright])

  useEffect(() => {
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
    }
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    const video = videoRef.current
    if (!mount || !video) return

    let disposed = false
    let stop = () => {}

    import('three')
      .then((THREE) => {
        if (disposed) return
        // Non-null copies, so the nested render and resize closures stay typed.
        const host: HTMLDivElement = mount
        const el: HTMLVideoElement = video

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#000000')

        const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 100)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        host.appendChild(renderer.domElement)

        const texture = new THREE.VideoTexture(el)
        texture.colorSpace = THREE.SRGBColorSpace

        const plane = () => new THREE.PlaneGeometry(1, 1)

        const screen = new THREE.Mesh(plane(), new THREE.MeshBasicMaterial({ map: texture }))

        // Warm spill around the picture, painted once into a canvas texture.
        const glowCanvas = document.createElement('canvas')
        glowCanvas.width = glowCanvas.height = 256
        const gtx = glowCanvas.getContext('2d')!
        const grad = gtx.createRadialGradient(128, 128, 8, 128, 128, 128)
        grad.addColorStop(0, 'rgba(255, 216, 198, 0.9)')
        grad.addColorStop(1, 'rgba(255, 216, 198, 0)')
        gtx.fillStyle = grad
        gtx.fillRect(0, 0, 256, 256)
        const glow = new THREE.Mesh(
          plane(),
          new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(glowCanvas),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0,
          })
        )
        glow.position.z = -0.05

        // A white flare for the moment the projector catches.
        const flash = new THREE.Mesh(
          plane(),
          new THREE.MeshBasicMaterial({ color: '#fff6e8', transparent: true, opacity: 0 })
        )
        flash.position.z = 0.03

        scene.add(glow, screen, flash)

        // The clip decides the screen's shape; portrait and landscape both fit.
        let screenW = 5.6
        let screenH = 3.15
        // Where the whole picture is visible, and where it covers the window.
        let zFit = 6
        let zFill = 4

        function distances() {
          const vFov = (camera.fov * Math.PI) / 180
          const tan = 2 * Math.tan(vFov / 2)
          const byHeight = screenH / tan
          const byWidth = screenW / (tan * camera.aspect)
          zFit = Math.max(byHeight, byWidth) * 1.12
          zFill = Math.min(byHeight, byWidth)
        }

        function layout(source: HTMLVideoElement) {
          const ratio =
            source.videoWidth && source.videoHeight ? source.videoWidth / source.videoHeight : 16 / 9
          screenH = 3.15
          screenW = screenH * ratio

          screen.scale.set(screenW, screenH, 1)
          flash.scale.set(screenW, screenH, 1)
          glow.scale.set(screenW * 2.4, screenH * 2.4, 1)
          distances()
        }

        const onMeta = () => layout(el)
        el.addEventListener('loadedmetadata', onMeta)
        layout(el)

        function resize() {
          const w = host.clientWidth
          const h = host.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          distances()
        }
        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(host)

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let raf = 0

        function frame() {
          raf = requestAnimationFrame(frame)

          const started = openedAt.current
          const t =
            started === null ? 0 : reduced ? 1 : clamp01((performance.now() - started) / OPEN_MS)

          // The picture opens out of a slit while the camera walks in until it
          // fills the window edge to edge.
          const widen = easeOut(clamp01(t / 0.7))
          const walk = easeInOut(t)

          screen.scale.x = screenW * (0.015 + 0.985 * widen)
          flash.scale.x = screen.scale.x
          ;(glow.material as Three.MeshBasicMaterial).opacity = 0.45 * widen
          ;(flash.material as Three.MeshBasicMaterial).opacity =
            t > 0 && t < 0.28 ? Math.sin((t / 0.28) * Math.PI) * 0.5 : 0

          camera.position.z = zFit + (zFill - zFit) * walk

          renderer.render(scene, camera)
        }
        frame()

        stop = () => {
          cancelAnimationFrame(raf)
          observer.disconnect()
          el.removeEventListener('loadedmetadata', onMeta)
          renderer.dispose()
          texture.dispose()
          scene.traverse((o) => {
            const m = o as Three.Mesh
            m.geometry?.dispose?.()
            const mat = m.material as Three.Material | undefined
            mat?.dispose?.()
          })
          renderer.domElement.remove()
        }
      })
      .catch(() => setFlat(true))

    return () => {
      disposed = true
      stop()
    }
  }, [])

  /** Only used when the browser blocked the automatic start. */
  function play() {
    setBlocked(false)
    openedAt.current = performance.now()
    videoRef.current?.play().catch(() => setBlocked(true))
  }

  /**
   * When the clip ends the room goes dark on its own and hands over to the next
   * page — there is nothing left for her to press.
   */
  function finish() {
    setStage('closing')
    resumeSong()
    exitTimer.current = window.setTimeout(onDone, CLOSE_MS)
  }

  return (
    <div className="cinema-room">
      {stage === 'intro' && <h2 className="hand-lg cinema-title">{content.video.title}</h2>}

      <div ref={mountRef} className={`cinema-stage ${flat ? 'is-hidden' : ''}`} />

      <video
        ref={videoRef}
        className={flat ? 'cinema-flat' : 'cinema-source'}
        src={content.video.src}
        controls={flat && stage === 'playing'}
        playsInline
        preload="metadata"
        onEnded={finish}
        onError={() => setMissing(true)}
      />

      {missing && (
        <div className="cinema-overlay">
          <p className="hand cinema-note">{content.video.missing}</p>
          <button onClick={onDone} className="btn">
            {content.video.cta}
          </button>
        </div>
      )}

      {stage === 'intro' && !missing && upright && (
        <div className="cinema-overlay">
          <span className="cinema-rotate" aria-hidden />
          <p className="cinema-ask">{content.video.rotate}</p>
        </div>
      )}

      {blocked && !missing && (
        <div className="cinema-overlay">
          <p className="cinema-ask">{content.video.blocked}</p>
          <button onClick={play} className="btn">
            {content.video.yes}
          </button>
        </div>
      )}

      {stage === 'closing' && (
        <div className="cinema-blackout">
          <p className="hand cinema-note">{content.video.after}</p>
        </div>
      )}
    </div>
  )
}
