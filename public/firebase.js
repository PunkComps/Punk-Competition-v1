// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc , getDocs , doc, getDoc , setDoc , deleteDoc , updateDoc , arrayRemove , Timestamp , serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBasRlbFA3EAZR09NDerdQRwexZQyebnM0",
  authDomain: "punk-competition.firebaseapp.com",
  projectId: "punk-competition",
  storageBucket: "punk-competition.appspot.com",
  messagingSenderId: "634058391419",
  appId: "1:634058391419:web:a19b9dbf146d6d760847de",
  measurementId: "G-3EXKSPKS8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export necessary Firebase services
export { db, collection, addDoc, getDocs, doc, getDoc, setDoc, storage, ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteDoc, auth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut , updateDoc , arrayRemove , Timestamp , serverTimestamp };
