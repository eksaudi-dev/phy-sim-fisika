/* PHY-SIM — KONFIGURASI FIREBASE
   ┌────────────────────────────────────────────────────────────────────────┐
   │ GANTI seluruh nilai konfigurasi di bawah dengan kredensial proyek      │
   │ Firebase Anda sendiri (Firebase Console → Project settings →           │
   │ Your apps → SDK setup and configuration).                              │
   └────────────────────────────────────────────────────────────────────────┘ */

/* Firebase JS SDK v10 (modular, CDN) */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_Anda",
  authDomain: "phy-sim-fisika.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "phy-sim-fisika.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
