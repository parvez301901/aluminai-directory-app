import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
