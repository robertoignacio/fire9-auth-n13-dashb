"use client"

import React, { useState, ChangeEvent } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from "../firebaseConfig" // imported getAuth() from firebaseConfig

interface User {
  email: string;
  password: string;
}

// has to be capitalized because React
export default function LoginPage() {
  const [email, setEmail] = React.useState<User["email"]>("");

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
    };



  // dispatch an event when the value of the HTML input email changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // will give you access to all the values of the event
    setEmail(event.target.value)
  }

  // handle the submit event of the form
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
    // The link was successfully sent. Inform the user:
    // add innerHTML to the DOM to tell the user an email was sent

    // Save the email locally to localStorage so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
    // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  }

  // render the components
  return (
    <div className="w-1/3 mx-auto">
      <h2 className="mt-4 text-center font-bold text-2xl">Acceso</h2>

      <form onSubmit={handleSubmit}>
        <div className="my-2 flex flex-col">

          <p>Ingrese su dirección de e-mail. El botón enviará un link de acceso a su correo. No necesita contraseña.</p>
          <label className="text-teal-800 font-serif text-base tracking-wide">Dirección de e-mail</label>
          <input 
            onChange={handleEmailChange} 
            value={email}
            type="email" 
            placeholder="Dirección de e-mail"
            className="my-2 bg-none border-2 border-teal-900 p-1 rounded-xl font-bold text-teal-800" 
            required
          />

          <button 
            type="submit"
            className="bg-teal-800 text-white font-bold p-2 rounded-xl mt-4">Send</button>

          
        </div>
      </form>
    </div>
  )

}
