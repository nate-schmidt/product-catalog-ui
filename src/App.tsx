import "./index.css";
import { CartIcon } from "./components/CartIcon";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      {/* Cart icon fixed at top-right */}
      <div className="absolute top-4 right-4 z-20">
        <CartIcon />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Hello World! 👋
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
          One day I hope to be an ecommerce website.
        </p>
      </div>
    </div>
  );
}

export default App;
