import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeBackground = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const width = window.innerWidth
    const height = 200

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // 🎇 Create interactive particles
    const particleCount = 400
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const color = new THREE.Color()

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      color.setHSL(Math.random(), 0.6, 0.7)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // 🌈 Subtle lighting effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    // 🎮 Interactivity
    const mouse = { x: 0, y: 0 }
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    // 🌀 Animate particles
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)

      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.1
      particles.rotation.x = Math.sin(t * 0.1) * 0.1

      // Parallax movement
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
      camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // 🪄 Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      renderer.setSize(newWidth, height)
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', () => {})
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '200px',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default ThreeBackground
