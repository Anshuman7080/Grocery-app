'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'


export default function ItemFormModal({ activeForm, onClose ,categoryList}) {
  console.log("categoryList is",categoryList)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    if (activeForm !== 'Item') {
      setName('')
      setPrice('')
      setStock('')
      setImageFile(null)
      setCategoryId('')
    }
  }, [activeForm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !price || !stock || !imageFile || !categoryId) {
      return toast.error('Please fill all fields.')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('stock', stock)
      formData.append('image', imageFile)
      formData.append('categoryId', categoryId)

        const res = await fetch('/api/addItems', {
      method: 'POST',
      body: formData,
      })

      console.log("Items  response is",res);

      if (res.status === 200) {
        toast.success('Item added successfully!')
        onClose()
      } else {
        toast.error(res.data.error || 'Upload failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Add Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500"
              placeholder="Item name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                placeholder="Price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                placeholder="Stock"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            >
              <option value="">Select Category</option>
              {categoryList?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              {loading ? 'Uploading...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
