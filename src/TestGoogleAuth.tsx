// src/TestGoogleAuth.tsx
import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

const TestGoogleAuth: React.FC = () => {
  const handleClick = async () => {
    console.log('Button clicked!');
    console.log('Auth:', auth);
    
    try {
      const provider = new GoogleAuthProvider();
      console.log('Provider created');
      
      console.log('Calling signInWithPopup...');
      const result = await signInWithPopup(auth, provider);
      
      console.log('Success!', result.user.email);
      alert(`Logged in as: ${result.user.email}`);
    } catch (error: any) {
      console.error('Error:', error.code, error.message);
      alert(`Error: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Google Sign In</h1>
      <button 
        onClick={handleClick}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Click to Test Google Sign In
      </button>
    </div>
  );
};

export default TestGoogleAuth;