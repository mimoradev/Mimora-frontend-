import { useState } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier, type ConfirmationResult } from "firebase/auth";
import { auth } from "../firebase";

import PhoneInput from "../components/auth/PhoneInput";
import OTPInput from "../components/auth/OTPInput";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function OtpAuth() {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");

  // 🔹 SEND OTP
  const sendOtp = async () => {
    try {
      setError("");

      const fullPhone = `${countryCode}${phoneNumber}`;

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    }
  };

  // 🔹 VERIFY OTP
  const verifyOtp = async () => {
    try {
      setError("");

      const code = otp.join("");
      if (code.length !== 6) {
        setError("Enter valid OTP");
        return;
      }

      if (!window.confirmationResult) {
        setError("Please send OTP first");
        return;
      }

      const result = await window.confirmationResult.confirm(code);
      alert("Logged in UID: " + result.user.uid);
    } catch (err: any) {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div id="recaptcha-container"></div>

      {step === "phone" && (
        <>
          <PhoneInput
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodeChange={setCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            error={error}
          />

          <button onClick={sendOtp} className="btn-primary w-full">
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <OTPInput
            value={otp}
            onChange={setOtp}
            error={error}
          />

          <button onClick={verifyOtp} className="btn-primary w-full">
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
