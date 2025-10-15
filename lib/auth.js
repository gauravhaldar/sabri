// Authentication utilities for frontend
import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
};

export const registerWithEmailAndPassword = async (userData) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
};

export const loginWithGoogle = async (googleToken) => {
  try {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: googleToken }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google login error:", error);
    return {
      success: false,
      message: "Google login failed. Please try again.",
    };
  }
};

export const logout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Logout failed.",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      message: "Failed to get user data.",
    };
  }
};

// Firebase Authentication functions
export const loginWithEmailAndPasswordFirebase = async (email, password) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send user data to backend to get JWT token
    const response = await fetch("/api/auth/firebase-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Firebase login error:", error);
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
};

export const registerWithEmailAndPasswordFirebase = async (userData) => {
  try {
    const userCredential = await firebaseCreateUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Send user data to backend to create user record and get JWT token
    const response = await fetch("/api/auth/firebase-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Firebase registration error:", error);
    return {
      success: false,
      message: error.message || "Registration failed. Please try again.",
    };
  }
};

export const loginWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Send user data to backend to get JWT token
    const response = await fetch("/api/auth/firebase-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Firebase Google login error:", error);
    return {
      success: false,
      message: error.message || "Google login failed. Please try again.",
    };
  }
};

export const logoutFirebase = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    return { success: true };
  } catch (error) {
    console.error("Firebase logout error:", error);
    return {
      success: false,
      message: "Logout failed.",
    };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
