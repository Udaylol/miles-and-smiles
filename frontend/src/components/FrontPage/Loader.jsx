export default function Loader({ progress }) {
  return (
    <div className="w-72 mt-2">
      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white text-sm mt-2 text-center">
        Loading {progress}%
      </p>
    </div>
  );
}
