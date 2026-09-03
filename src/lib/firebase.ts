import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First user might be admin, subsequent are staff
      const usersSnap = await getDocs(collection(db, 'users'));
      const isFirstUser = usersSnap.empty;
      
      await setDoc(userRef, {
        name: user.displayName || 'Unknown',
        email: user.email || '',
        role: isFirstUser ? 'Admin' : 'Banquet Staff', // Admin for first, Staff for others
        createdAt: new Date().toISOString()
      });
    }
    
    return user;
  } catch (error: any) {
    if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
      console.error('Error signing in with Google', error);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);
