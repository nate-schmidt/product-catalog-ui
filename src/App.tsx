import "./index.css";
import { FlashSaleSection } from "./components/FlashSaleSection";
import { currentFlashSale } from "./data/flashSaleData";

export function App() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
            Welcome to ShopFlash ⚡
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your destination for incredible flash deals and unbeatable prices!
          </p>
        </div>
      </div>

      {/* Flash Sale Section */}
      <FlashSaleSection flashSale={currentFlashSale} />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mt-12 text-center border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          © 2025 ShopFlash. All flash sales are time-limited. Prices and availability subject to change.
        </p>
      </footer>
    </div>
  );
}

export default App;
