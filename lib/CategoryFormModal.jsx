'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'


export default function CategoryFormModal({ activeForm, onClose }) {
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeForm !== 'Category') {
      setName('')
      setImageFile(null)
    }
  }, [activeForm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !imageFile) return alert('Please fill all fields')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('image', imageFile)

       const res = await fetch('/api/addCategory', {
            method: 'POST',
               body: formData,
              })


      toast.sucess('Category created successfully!')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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
              {loading ? 'Creating...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
