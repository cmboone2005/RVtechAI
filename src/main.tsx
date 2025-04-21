import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { updateOnlineStatus } from "@/lib/local-storage";

// Set up online/offline status handlers
window.addEventListener("online", () => updateOnlineStatus(true));
window.addEventListener("offline", () => updateOnlineStatus(false));

// Initialize online status
updateOnlineStatus(navigator.onLine);

createRoot(document.getElementById("root")!).render(<App />);
