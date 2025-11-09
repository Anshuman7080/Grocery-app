'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SliderFormModal({ activeForm, onClose }) {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeForm!='Slider') {
      setName('')
      setFile(null)
    }
  }, [activeForm])

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return alert('Please select an image file.')

    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('image', file)

    const res = await fetch('/api/addSlider', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      toast.success('Slider added successfully!')
      onClose()
    } else {
      toast.error(data.error || 'Upload failed')
    }
  }



  return (
 <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Add Slider</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500"
              placeholder="Slider name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Uploading...' : 'Add Slider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
