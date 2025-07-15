import "./index.css";
import { ProductCatalog } from "./components/ProductCatalog";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 relative z-10">
      <h1 className="text-5xl font-bold text-white mb-8 text-center">
        Product Catalog
      </h1>
      <ProductCatalog />
    </div>
  );
}

export default App;
