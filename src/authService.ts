/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                  Firebase Imports                                           %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// import the necessary functions from the Firebase Auth module.
import { 
    getAuth,    // used to initialize the Firebase Auth service.
    signInWithPopup, //the function to sign in users using a popup window, which is a common method for web applications.
    GoogleAuthProvider, //GoogleAuthProvider is a provider for the Google OAuth2.0; it's required for authenticating with Google.
    signOut, // the function to sign users out from Firebase.
    onAuthStateChanged,  // to handle auth state persistence
    User
} from "firebase/auth";
import { app } from "./firebaseConfig";

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                  Initializations                                             %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// Initialize Firebase Authentication using the Firebase app instance
const auth = getAuth(app);
// Initialize the Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                  Auth Functions                                             %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// Define the sign-in function using Google Auth Provider
const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The signed-in user info. You can get more details from result.user
      const user = result.user;
      return user;
    } catch (error) {
      // Handle errors here, such as by alerting the user
      console.error(error);
      throw error;
    }
};
  
// Define the sign-out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      // User is signed out and you can do additional clean up
    } catch (error) {
      // Handle errors here, such as by alerting the user
      console.error(error);
      throw error;
    }
};

//subscribeToAuthChanges is a function that takes another function handleUserChange as a parameter, which is called with the current user whenever the authentication state changes.
const subscribeToAuthChanges = (handleUserChange: (user: User | null) => void): void => {
    onAuthStateChanged(auth, user => {
      handleUserChange(user);
    });
};

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Exports                                              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Export the signInWithGoogle and signOutUser functions, which can be used wherever you need to trigger sign-in or 
sign-out in your application. These functions encapsulate the Firebase operations and any additional logic you
might want to implement around the authentication process, like error handling or post-login redirects.
*/
export { signInWithGoogle, signOutUser, subscribeToAuthChanges };