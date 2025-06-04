/**
 * Admin entry point for Instant Guest Post Request plugin.
 */
import { render } from "@wordpress/element";
import App from "./components/App";

import "./style.css";
// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("igpr-admin-app");
  if (container) {
    render(<App />, container);
  }
});
