import "./index.css";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { ProductCatalog } from "./components/ProductCatalog";

export function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
