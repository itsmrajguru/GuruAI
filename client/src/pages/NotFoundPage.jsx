import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">

      {/* 404 number */}
      <p className="text-8xl font-black tracking-tighter text-gray-200 leading-none select-none">
        404
      </p>

      {/* Thin line separator */}
      <div className="w-16 h-px bg-gray-300 my-6" />

      {/* Text */}
      <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-2">
        Page not found
      </h2>
    
      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Go Home
        </button>
       
      </div>

    </div>
  )
}

export default NotFoundPage