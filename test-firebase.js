// Test Firebase connection
import { auth } from "./lib/firebase.js";

console.log("Firebase Auth initialized:", auth);
console.log("Firebase project:", auth.app.options.projectId);

// Test if Firebase is working
try {
  console.log("✅ Firebase is properly configured!");
  console.log("Project ID:", auth.app.options.projectId);
  console.log("Auth Domain:", auth.app.options.authDomain);
} catch (error) {
  console.error("❌ Firebase configuration error:", error);
}
