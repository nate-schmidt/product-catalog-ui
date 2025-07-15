import "./index.css";

/**
 * Main App Component
 * 
 * @component
 * @description The root component of the product catalog application. Currently displays
 * a placeholder message but is designed to be the entry point for the ecommerce platform.
 * 
 * Future Features:
 * - Product catalog display
 * - Shopping cart functionality
 * - User authentication
 * - Order management
 * - Payment processing
 * 
 * @example
 * ```tsx
 * // Basic usage in index.tsx
 * import { App } from './App';
 * 
 * ReactDOM.render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>,
 *   document.getElementById('root')
 * );
 * ```
 * 
 * @returns {JSX.Element} The main application component
 */
export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
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
