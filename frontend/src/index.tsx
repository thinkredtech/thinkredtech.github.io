// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// StrictMode temporarily disabled due to React 19 hook initialization timing issues
// Even after fixing lazy loading, Layout components with hooks are still affected
root.render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
