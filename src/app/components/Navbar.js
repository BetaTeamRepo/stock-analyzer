export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b shadow-sm">
      {/* Logo with text */}
      <div className="flex items-center gap-2">
        <img src="/BETA.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-lg font-bold">BetterM$ney</h1>
      </div>

      {/* Right-side text */}
      <div className="text-sm font-medium text-gray-600">Smart money, powered by AI</div>
    </div>
  );
}
  