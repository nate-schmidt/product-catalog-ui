import "./index.css";

/*
 * App Component
 * -------------
 * This is the top-level React component rendered by the application.
 *
 * Responsibilities
 * • Display a welcoming hero section that greets visitors with a heading and
 *   short subtitle.
 * • Provide a centred, responsive layout that looks good on both mobile and
 *   desktop screens.
 * • Showcase TailwindCSS utility classes in action – the component itself does
 *   not hold any business logic; instead, it focuses purely on presentational
 *   concerns.
 *
 * Visual structure
 * <div> (max width container, centred)
 * └─ <div> (flex column, vertically & horizontally centred)
 *    ├─ <h1> – main heading
 *    └─ <p> – subtitle/lead paragraph
 *
 * Styling highlights
 * • max-w-7xl – constrains the maximum width so the content does not stretch
 *   on large viewports.
 * • mx-auto – horizontally centres the outer container.
 * • p-8 – adds generous padding around the content.
 * • text-center – centres text for a clean hero look.
 * • text-white / text-gray-300 – provides good contrast against the dark
 *   background set globally in index.css.
 *
 * Export
 * The component is exported as a named export (`App`) and as the default export
 * so that it can be imported with either syntax:
 *   import { App } from "./App";
 *   // or
 *   import App from "./App";
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
