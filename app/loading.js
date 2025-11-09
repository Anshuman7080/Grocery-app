// app/loading.js
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-yellow-100 relative overflow-hidden">
      {/* Blurred background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      {/* Loader content */}
      <div className="z-10 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-50 mx-auto mb-6"></div>
        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Preparing your fresh picks…</h1>
        <p className="text-sm text-gray-500">Hang tight! Your grocery experience is loading.</p>
      </div>
    </div>
  );
}
