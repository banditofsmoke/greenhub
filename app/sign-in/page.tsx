import SignInForm from '../components/auth/SignInForm'
import React, { useEffect, useState } from 'react';

export default function SignInPage() {
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({});

  useEffect(() => {
    setEnvVars(process.env);
  }, []);

  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div>
        <h2>Environment Variables</h2>
        <ul>
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
      <SignInForm />
    </div>
  )
}