import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

// Firebase configuration is injected from the environment at build time.
// The committed source NEVER contains credentials. If the env vars are
// missing, `firebaseConfigured` is false and auth calls fail loudly with a
// clear message instead of silently using a fake key.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: Firestore | null = null;

if (firebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    // Keep auth/db null; calls below will fail loudly with `requireFirebase`.
    console.error("Failed to initialize Firebase:", error);
  }
}

function requireFirebase(): { auth: NonNullable<ReturnType<typeof getAuth>>; db: Firestore } {
  if (!firebaseConfigured || !auth || !db) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY, " +
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_APP_ID to enable sign-in."
    );
  }
  return { auth, db };
}

export interface UserProfile {
  name: string;
  role: "Protected" | "Protector";
  gender?: string;
  createdAt?: string;
}

export async function storeUserInfo(user: User, profile?: Partial<UserProfile>): Promise<void> {
  const { db } = requireFirebase();
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existing = snapshot.exists() ? (snapshot.data() as Partial<UserProfile>) : undefined;

  // Only write a field when the caller explicitly provides it, or when the user has
  // no stored value yet. This keeps a Google sign-in from clobbering a Protector role
  // chosen at registration or resetting the original `createdAt`.
  const data: Record<string, unknown> = {
    email: user.email ?? "",
  };
  if (profile?.name) data.name = profile.name;
  else if (!existing?.name) data.name = user.displayName ?? "SafeGuard User";
  if (profile?.role) data.role = profile.role;
  else if (!existing?.role) data.role = "Protected";
  if (profile?.gender) data.gender = profile.gender;
  else if (!existing?.gender) data.gender = "undeclared";
  if (!existing?.createdAt) data.createdAt = new Date().toISOString();

  await setDoc(userRef, data, { merge: true });
}

export async function getUserProfile(user: User): Promise<UserProfile | null> {
  const { db } = requireFirebase();
  const snapshot = await getDoc(doc(db, "users", user.uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  gender: string,
  role: UserProfile["role"]
): Promise<User> {
  const { auth } = requireFirebase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  await storeUserInfo(user, { name, role, gender });
  return user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { auth } = requireFirebase();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

const signInWithGoogle = async (): Promise<{ user: User }> => {
  const { auth } = requireFirebase();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export async function signOutUser(): Promise<void> {
  if (firebaseConfigured && auth) {
    await signOut(auth);
  }
}

export function observeAuth(onChange: (user: User | null) => void): () => void {
  if (!firebaseConfigured || !auth) {
    onChange(null);
    return () => {};
  }
  return onAuthStateChanged(auth, onChange);
}

export function mapFirebaseError(error: unknown, fallback: string): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 8 characters.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return (error as { message?: string })?.message || fallback;
  }
}

export { app, auth, db, signOut, onAuthStateChanged, signInWithGoogle };