"use client";

import { isSignInWithEmailLink, signInWithEmailLink, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useEffect } from 'react';


// ---------------------------------------------------------
// the React Component
export default function DashboardPage() {

    // Because error ReferenceError: window is not defined
    useEffect(() => {
        // complete the sign-in on the landing page
        // At the landing page, confirm the incoming link is a sign-in with email link.
        if (isSignInWithEmailLink(auth, window.location.href)) {
            // get the email if available
            let email = window.localStorage.getItem('emailForSignIn');
            // window is a client object, not available at the server
    
            // If there is no email saved at the local storage
            // instead of email check:
            // build a boolean function to detect if the user is logged in. 
            // TBA
    
            if (!email) {
                // send the user back to the home page, TBA router nesting to protect the route
                window.location.href = "/";  
            }            
    
            // Promise to TypeScript that email value will never be null or undefined.
            signInWithEmailLink(auth, email!, window.location.href)
                .then((result) => {
                // Clear email from storage, without it becoming null or undefined
                window.localStorage.setItem('emailForSignIn', "");
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
                console.log("Sign-in successful");
                console.log(result);
                })
                .catch((error) => {
                    console.log(error.code);
            });
        }
    }, []); // empty array to run only once
    

    const handleLogOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign-out successful");
          }).catch((error) => {
            // An error happened.
            console.log("An error happened");
          });
    }

    // render the React Component
    return (
        <div className="w-1/2 mx-auto">
            <h1 className="mt-4 text-center font-bold text-lg">Documentos publicados</h1>
            <p className="text-xs">En esta página se publicarán los documentos de avance del proyecto</p>
            <button 
                onClick={handleLogOut}
                type="submit" 
                className="bg-teal-800 text-white font-bold p-2 rounded-xl mt-4">
                    Cerrar sesión
            </button>
        </div>

    )
}