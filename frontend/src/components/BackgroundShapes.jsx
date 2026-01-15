export default function BackgroundShapes() {
  return (
    <>
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large gradient blob - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-purple-400/30 rounded-full blur-3xl animate-blob"></div>
        
        {/* Medium gradient blob - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-primary-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        
        {/* Small gradient blob - center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Additional decorative shapes */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-blob animation-delay-1000"></div>
        
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-blob animation-delay-3000"></div>
      </div>
    </>
  );
}