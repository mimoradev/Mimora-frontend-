// src/auth/recaptcha.js
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../firebase";



declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const setupRecaptcha = () => {
  try {
    const container = document.getElementById("recaptcha-container");
    if (!container) {
      console.warn("reCAPTCHA container not found in DOM");
      return;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  } catch (error) {
    console.error("Failed to setup reCAPTCHA:", error);
  }
};

export const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = undefined;
  }
};
