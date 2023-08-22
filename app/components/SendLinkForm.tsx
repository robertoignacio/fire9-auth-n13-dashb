import React, { useState, ChangeEvent } from 'react';
import { auth } from "../../firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";

// instructions for firebase on how to construct the email link
const actionCodeSettings = {
    url: "http://localhost:3000/panel", // the URL to redirect to after a successful login
    handleCodeInApp: true, // whether to open the link in a mobile app or a web page in a mobile browser
};


// the React Component
export default function SendLinkForm() {
    type User = {
        email: string;
    }

    const [email, setEmail] = React.useState<User["email"]>("");

    // update the state of the email variable by dispatching an event when the value of the HTML input email changes
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update the state (a React object)
        setEmail(event.target.value)
        // passes the value to the email variable outside the function

    }

    // handles the submit event at the form submit button
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // prevent the default behavior of the submit event
        event.preventDefault();

        // send the link to the user’s email
        sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
            // The link was successfully sent. Inform the user.

            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // handle errors here
        });

        // do not pass the user’s email in the redirect URL parameters!
    }


    return (
        <div className="w-1/2 mx-auto">
        <h2 className="mt-4 text-center font-bold text-lg">Consultar documentos de avance</h2>
  
        <form onSubmit={handleSubmit}>
          <div className="my-2 flex flex-col">
            <div className="text-xs">
                <p>Escriba la dirección de e-mail correspondiente a su cuenta de Socio.</p>
                <p>No necesita contraseña.</p>
                <p>Se le enviará un enlace a su dirección de email, para ingresar</p>
            </div>
 
            <label className="mt-4 text-teal-800 font-serif">Dirección de e-mail</label>
            <input 
              onChange={handleEmailChange} 
              value={email}
              type="email" 
              placeholder="socio@email.com"
              className="my-2 bg-none border-2 border-teal-900 p-1 rounded-xl font-bold text-teal-800" 
              required
            />
  
            <button 
              type="submit"
              className="bg-teal-800 text-white font-bold p-2 rounded-xl mt-4">Enviar link de acceso</button>
            
            <div>
                <p>Update stage on the flow process</p>
                <p className="text-xs mt-4">Si no recibe el link de acceso, revise su carpeta de spam.</p>
                <p className="text-xs">Si el problema persiste, envíe un email a </p>
            </div>
  
            
          </div>
        </form>
      </div>
    )    
}