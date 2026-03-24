import { useState, useEffect, useRef } from 'react'
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import content from '../data/content'

const MAX_FILE_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function PhotoWall() {
  const { photoWall, event } = content
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [uploaderName, setUploaderName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadState, setUploadState] = useState(null) // null | 'uploading' | 'success' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  // Listen to photos collection
  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(
      q,
      snap => {
        const items = []
        snap.forEach(d => items.push({ id: d.id, ...d.data() }))
        setPhotos(items)
        setLoadingPhotos(false)
      },
      err => {
        console.error('Photos error:', err)
        setLoadingPhotos(false)
      }
    )
    return () => unsub()
  }, [])

  const handleFile = (file) => {
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WebP file.')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setUploadError('')
    setUploadState('uploading')
    setUploadProgress(0)

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `photos/${timestamp}_${safeName}`
    const storageRef = ref(storage, storagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(Math.round(pct))
      },
      err => {
        console.error('Upload error:', err)
        setUploadError('Upload failed. Please try again.')
        setUploadState('error')
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          await addDoc(collection(db, 'photos'), {
            storageUrl: downloadURL,
            uploaderName: uploaderName.trim(),
            fileName: file.name,
            timestamp: serverTimestamp(),
          })
          setUploadState('success')
          setUploadProgress(100)
          // Reset form after brief pause
          setTimeout(() => {
            setUploadState(null)
            setUploaderName('')
            setUploadProgress(0)
          }, 3000)
        } catch (err) {
          console.error('Firestore write error:', err)
          setUploadError('Photo uploaded but record failed. Please try again.')
          setUploadState('error')
        }
      }
    )
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{
        background: '#0D0D0F',
        padding: '80px 0 60px',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div className="section-eyebrow">Community Gallery</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            The Future<br />
            <span style={{ color: '#FF4422' }}>Wall</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#888',
            lineHeight: 1.8,
            maxWidth: '560px',
          }}>
            Upload your photo from the night and become part of the Future Wall. Tag <strong style={{ color: '#FFB020' }}>#{event.hashtags[0]}</strong> on Instagram too.
          </p>
        </div>
      </section>

      {/* Upload section */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '600px', marginBottom: '64px' }}>
            <div className="section-eyebrow">Add Your Photo</div>
            <h2 style={{
              fontWeight: 900,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#F0F0EE',
              marginBottom: '24px',
            }}>
              Upload to the Future Wall
            </h2>

            {/* Optional name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '8px',
              }}>
                Your name (optional)
              </label>
              <input
                type="text"
                value={uploaderName}
                onChange={e => setUploaderName(e.target.value)}
                placeholder="First name or handle"
                className="form-input"
                style={{ background: '#1C1C1E', color: '#F0F0EE' }}
                disabled={uploadState === 'uploading'}
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => uploadState !== 'uploading' && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#00D4E8' : uploadState === 'success' ? '#4CAF50' : uploadState === 'error' ? '#FF4422' : '#2A2A2E'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: uploadState === 'uploading' ? 'wait' : 'pointer',
                background: dragOver ? 'rgba(0,212,232,0.05)' : '#1C1C1E',
                transition: 'all 0.2s ease',
              }}
            >
              {uploadState === 'uploading' ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⬆️</div>
                  <div style={{ fontWeight: 700, color: '#F0F0EE', marginBottom: '16px' }}>
                    Uploading... {uploadProgress}%
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    height: '6px',
                    background: '#2A2A2E',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    maxWidth: '200px',
                    margin: '0 auto',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${uploadProgress}%`,
                      background: '#00D4E8',
                      borderRadius: '3px',
                      transition: 'width 0.2s ease',
                    }} />
                  </div>
                </div>
              ) : uploadState === 'success' ? (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
                  <div style={{ fontWeight: 700, color: '#4CAF50', fontSize: '1rem' }}>
                    Photo added to the Future Wall!
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📸</div>
                  <div style={{
                    fontWeight: 700,
                    color: '#F0F0EE',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}>
                    Drop your photo here or click to upload
                  </div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>
                    JPG, PNG, WebP — up to {MAX_FILE_SIZE_MB}MB
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {uploadError && (
              <div style={{
                background: 'rgba(255,68,34,0.1)',
                border: '1px solid rgba(255,68,34,0.3)',
                borderRadius: '6px',
                padding: '12px 16px',
                color: '#FF4422',
                fontSize: '0.9rem',
                marginTop: '12px',
              }}>
                {uploadError}
              </div>
            )}

            {/* Instagram prompt */}
            <div style={{
              marginTop: '20px',
              background: 'rgba(255,176,32,0.06)',
              border: '1px solid rgba(255,176,32,0.2)',
              borderRadius: '8px',
              padding: '14px 18px',
              fontSize: '0.85rem',
              color: '#FFB020',
              lineHeight: 1.6,
            }}>
              📸 {photoWall.instagramPrompt}
            </div>
          </div>

          {/* Gallery */}
          <div className="section-eyebrow">
            {loadingPhotos ? 'Loading...' : `${photos.length} photo${photos.length !== 1 ? 's' : ''} on the wall`}
          </div>

          <h2 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#F0F0EE',
            marginBottom: '32px',
          }}>
            The Future Wall
          </h2>

          {loadingPhotos ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }} className="photo-grid">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{
                    width: '100%',
                    paddingBottom: '75%',
                    borderRadius: '8px',
                  }}
                />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div style={{
              background: '#1C1C1E',
              border: '1px dashed #2A2A2E',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              color: '#888',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</div>
              <div style={{ fontWeight: 700, color: '#F0F0EE', marginBottom: '8px' }}>
                The wall is empty — be the first!
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                Upload a photo above to start the Future Wall.
              </div>
            </div>
          ) : (
            /* Masonry grid using CSS columns */
            <div style={{
              columnCount: 3,
              columnGap: '16px',
            }} className="masonry-grid">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '16px',
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#1C1C1E',
                  }}
                >
                  <img
                    src={photo.storageUrl}
                    alt={photo.uploaderName ? `Photo by ${photo.uploaderName}` : 'Future Wall photo'}
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: '8px',
                    }}
                    loading="lazy"
                  />
                  {/* Watermark overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.85)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                  }}>
                    {photoWall.overlayText}
                  </div>
                  {/* Uploader name */}
                  {photo.uploaderName && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {photo.uploaderName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .masonry-grid {
            column-count: 2 !important;
          }
          .photo-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .masonry-grid {
            column-count: 1 !important;
          }
          .photo-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
