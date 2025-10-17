// mock firebase config

export const auth = {
    currentUser: null,
   
    onAuthStateChanged(callback) {
      console.log("⚙️ Fake: auth.onAuthStateChanged() triggered");
     
      setTimeout(() => callback(null), 500);
     
      return () => console.log("Fake unsubscribe called");
    },
  };
  
 

export const db = {
    collection: () => ({
      doc: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        create: () => Promise.resolve(), 
      }),
    }),
  };
  
  

  export function createUserWithEmailAndPassword() {
    console.log("Fake: createUserWithEmailAndPassword()");
    return Promise.resolve({ user: { uid: "mockUser123", email: "fake@demo.com" } });
  }
  
  export function signInWithEmailAndPassword() {
    console.log("Fake: signInWithEmailAndPassword()");
    return Promise.resolve({ user: { uid: "mockUser123", email: "fake@demo.com" } });
  }
  
  export function signOut() {
    console.log("Fake: signOut()");
    return Promise.resolve();
  }
  
  export function signInWithPopup() {
    console.log("Fake: signInWithPopup()");
    return Promise.resolve({ user: { uid: "mockUserGoogle", email: "google@demo.com" } });
  }
  
  export function sendEmailVerification() {
    console.log("Fake: sendEmailVerification()");
    return Promise.resolve();
  }
  
  export function sendPasswordResetEmail() {
    console.log("Fake: sendPasswordResetEmail()");
    return Promise.resolve();
  }
  
  export function reload() {
    console.log(" Fake: reload()");
    return Promise.resolve();
  }
  
  export class GoogleAuthProvider {}
  

// real config - comment the part above and uncomment this when you add
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     // api key
//   apiKey: " ",         
//     // domain        
//   authDomain: " ", 
//     // project id
//   projectId: " ",             
//   storageBucket: " ",
//   messagingSenderId: " ",       
//   appId: " ", 
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
