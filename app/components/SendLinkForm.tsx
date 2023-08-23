"use client";

import React, { useState, ChangeEvent } from 'react';
import { auth } from "../../firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";

// instructions for firebase on how to construct the email link
const actionCodeSettings = {
    url: "http://localhost:3000/panel", // the URL to redirect to after clicking the link in the email
    handleCodeInApp: true, // open the link on the web app page (even if it was clicked on a mobile device)
};

// ---------------------------------------------------------
// the React Component
export default function SendLinkForm() {
    type User = { email: string; }
    const [email, setEmail] = React.useState<User["email"]>("");
  
    // update the state of the email variable by dispatching an event when the value of the HTML input email changes
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update the state (a React object)
        setEmail(event.target.value)
        // passes the value to the email variable outside the handleEmailChange function
    }
    

    // ---------------------------------------------------------
    // what to do with the submit event at the form submit button.
    const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // prevent a page reload, which is the default behavior of the submit event
        event.preventDefault();

        /* 
         * basic sign-in flow:
         * 1. The SuperAdmin must first create the User at the Identity console. Known and verified email addresses.
         * (User creation by an Admin at the webapp level will be coded later)
         * 2. User actions of account creation and deletion are disabled at the server level for all Users.
         * 3. The visitor writes the email at the form html input email field.
         * 4. The visitor clicks the submit button.
         * 5. If the email exists at the User collection, then the server sends an email to the email address.
         * 6. If the email does not exist at the User collection, then the server raises an error HTTP 400 Bad Request.
         */

        // Inform the user about the status of the login flow
        const loginFlowStatus = document.getElementById("login-flow-status");

        // Attempts to send the email to the user
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then((response) => {
            // Promise: Will send the email link when the HTTP query returns that the email address submitted exists at the User collection.
            // The link was successfully sent. 
            if(response === undefined) {
              // will be undefined as a security measure
              loginFlowStatus!.textContent = "Se envió un enlace a su dirección de email. Revise su casilla de correo.";
              // the email template is terrible, but to get a custom template I will have to setup a STMP server

              // disable HTML input email field
              const emailInput = document.getElementById("email-input");
              emailInput!.setAttribute("disabled", "true");

              // disable HtmlElement button (should also block the submit event)
              const submitButton = document.getElementById("submit-button");
              submitButton!.setAttribute("disabled", "true");
              
              // clear the email input field
              setEmail("");

              // change the text of the submit button
              submitButton!.textContent = "Enlace enviado";

              // change style of the submit button
              submitButton!.classList.remove("bg-teal-800");
              submitButton!.classList.add("bg-teal-400");
            }

            // Save the email locally so you don't need to ask the user for it again
            // when they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            // window is a client object, not available at the server
          })
          .catch((error) => {
            // console.log(JSON.stringify(error)

            // Inform the user about the status of the login flow: error
            if(error.code) {
              loginFlowStatus!.textContent = "No se pudo enviar el enlace. La dirección de email no es la correcta.";
            }
          });
    }


    return (
        <div className="w-1/2 mx-auto">
        <h2 className="mt-4 text-center font-bold text-lg">Consultar documentos de avance</h2>
  
        <form onSubmit={handleEmailSubmit}>
          <div className="my-2 flex flex-col">
            <div className="text-xs">
                <p>Escriba la dirección de e-mail ya verificada, correspondiente a su cuenta de Socio. No necesita contraseña.</p>
                <p>Se le enviará un enlace a su dirección de email para ingresar</p>
            </div>
 
            <label className="mt-4 text-teal-800 font-serif">Dirección de e-mail</label>
            <input 
              id="email-input" 
              onChange={handleEmailChange} 
              value={email}
              type="email" 
              placeholder="nombre@dominio.com"
              className="my-2 bg-none border-2 border-teal-900 p-1 rounded-xl font-bold text-teal-800" 
              required
            />
  
            <button 
              id="submit-button" 
              type="submit"
              className="bg-teal-800 text-white font-bold p-2 rounded-xl mt-4">Enviar link de acceso</button>
            
            <div>
                <p id="login-flow-status" className="text-xs"></p>
            </div>
  
            
          </div>
        </form>
      </div>
    )    
}