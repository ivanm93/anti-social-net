const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file) {
  console.log('Cloud Name:', CLOUD_NAME)        // ← temporal
  console.log('Upload Preset:', UPLOAD_PRESET)  // ← temporal

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  console.log('Cloudinary response status:', res.status)  // ← temporal

  if (!res.ok) {
    const errorData = await res.json()
    console.error('Cloudinary error:', errorData)  // ← temporal
    throw new Error('Error al subir imagen a Cloudinary')
  }

  const data = await res.json()
  console.log('Cloudinary URL:', data.secure_url)  // ← temporal
  return data.secure_url
}