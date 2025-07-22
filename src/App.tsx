import "./index.css";
import ProductCatalog from "./components/ProductCatalog";
import CartSummary from "./components/CartSummary";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <ProductProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <header className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  Furniture Store
                </h1>
                <CartSummary />
              </header>
              <main>
                <ProductCatalog />
              </main>
            </div>
          </div>
        </CartProvider>
      </ProductProvider>
    </ErrorBoundary>
  );
}

export default App;
