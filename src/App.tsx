import "./index.css";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import { CartProvider } from "./contexts/CartContext";

export function App() {
  return (
    <CartProvider>
      <div style={{ 
        padding: '2rem',
        minHeight: '100vh'
      }}>
        <ProductCatalog />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
