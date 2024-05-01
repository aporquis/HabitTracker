/* Jordan's notes
    This file imports initializeApp from the Firebase app module and getAnalytics from the analytics module.
    It declares a firebaseConfig object that contains your project's Firebase configuration.
    The Firebase app is initialized with this configuration using initializeApp(firebaseConfig).
    Firebase Analytics is also initialized with the Firebase app instance.
    Both the app instance and the analytics service are exported, which means they can be imported and used in other parts of your application.
*/
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                  Firebase Imports                                           %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// Import the functions you need from the Firebase SDKs you need
import { initializeApp } from "firebase/app"; // imports the initializeApp function from the Firebase SDK's app module. The initializeApp function is used to initialize  your web app with Firebase's services using the specific configuration details you provide (like your project's API key, auth domain, project ID, etc.). When you call initializeApp with your Firebase configuration object, it sets up your  application to communicate with Firebase services, enabling you to use them (like Firestore, Auth, Analytics, and more) in your app.
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";  //import the Firebase Analytics service into Taam
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                    Firebase Config object                                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
//Configuration is about specifying "what are the settings for the Firebase services my app will use."
//Here the firebaseConfig object is defined with all the necessary project-specific details.
const firebaseConfig = {
  apiKey: "AIzaSyB3axQBV4Hb-WO_mZqDL3yB9ruypr1INUs",
  authDomain: "habit-tracker-445.firebaseapp.com",
  projectId: "habit-tracker-445",
  storageBucket: "habit-tracker-445.appspot.com",
  messagingSenderId: "680832891516",
  appId: "1:680832891516:web:9bb354f59b5e8edb4627f9",
  measurementId: "G-5KCW18B6XS"
};

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                  Firebase Initialization                                    %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
//Initialization is about "starting those Firebase services with those settings so I can use them."
const app = initializeApp(firebaseConfig);  //initializes Firebase with the provided configuration.
const analytics = getAnalytics(app);  // Services like Analytics (and potentially others like Auth, Firestore, etc., if used) are initialized right away in the same file.
const db = getFirestore(app);

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Exports                                              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
//The initialized app instance and any Firebase services are then exported. These exports can be imported into other parts of your application where Firebase functionality is needed.
export default db;
export { app, analytics };