"use client";
// complete the sign in on landing page
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

// the React Component
export default function DashboardPage() {

    // At the landing page, confirm the incoming link is a sign-in with email link.

    if (isSignInWithEmailLink(auth, window.location.href)) {
        // get the email if available
    let email = window.localStorage.getItem('emailForSignIn');
    // window es un objeto de cliente que representa la ventana del navegador

    if (!email) {
        // User opened the link on a different device. 
        // To prevent session fixation attacks, ask the user to provide the associated email again. 
        // For example:
        email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.

    // note the ! after email, which tells TypeScript that email will not be null or undefined
    signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user

        })
        .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        });
    }

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
                onSubmit={handleLogOut}
                type="submit" 
                className="bg-teal-800 text-white font-bold p-2 rounded-xl mt-4">
                    Cerrar sesión
            </button>
        </div>

    )
}