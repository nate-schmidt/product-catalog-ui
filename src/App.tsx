import "./index.css";

/**
 * Root React component for the Product Catalog UI.
 *
 * This component currently renders a simple hero section that welcomes
 * visitors to the site. As the application grows, the `App` component will
 * evolve into the main layout shell that handles global concerns such as
 * routing, contextual providers (e.g. authentication, cart state), and any
 * top-level UI chrome (navigation, footer, etc.).
 *
 * Props: none
 * Returns: JSX.Element – the rendered hero section.
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
