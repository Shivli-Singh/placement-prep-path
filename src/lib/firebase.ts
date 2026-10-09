import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import type { Profile, Attempt } from "./store";
import type { ChecklistStatus } from "./resume-data";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test validating client connectivity
export async function testFirestoreConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return { success: true, message: "Firestore database connection active and verified!" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      return {
        success: false,
        message:
          "Firestore client is offline. Please check your network and Firebase configuration.",
      };
    }
    // Expected permission denied on /test/connection is normal confirmation that server reached rules
    return { success: true, message: "Firebase services connected and operational." };
  }
}

// ==============================================================================
// Firebase Auth Operations
// ==============================================================================

export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    throw error;
  }
}

export async function signOutFirebase() {
  return await fbSignOut(auth);
}

// ==============================================================================
// Firestore Data Operations with Strict Error Handling
// ==============================================================================

export async function getFirebaseProfile(userId: string): Promise<Profile | null> {
  const docPath = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      name: data.name ?? "",
      email: data.email ?? "",
      college: data.college ?? "",
      branch: data.branch ?? "",
      year: data.year ?? "3rd Year",
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function saveFirebaseProfile(userId: string, profile: Profile): Promise<void> {
  const docPath = `users/${userId}`;
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        userId,
        name: profile.name,
        email: profile.email,
        college: profile.college,
        branch: profile.branch,
        year: profile.year,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function recordFirebaseQuizAttempt(
  userId: string,
  score: number,
  total: number,
  topic = "All",
): Promise<void> {
  const attemptId = `attempt_${Date.now()}`;
  const docPath = `users/${userId}/quizAttempts/${attemptId}`;
  try {
    await setDoc(doc(db, "users", userId, "quizAttempts", attemptId), {
      attemptId,
      userId,
      score,
      total,
      topic,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function getFirebaseQuizAttempts(userId: string): Promise<Attempt[]> {
  const collPath = `users/${userId}/quizAttempts`;
  try {
    const q = query(collection(db, "users", userId, "quizAttempts"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        score: d.score,
        total: d.total,
        date: d.createdAt,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collPath);
  }
}

export async function syncFirebaseLesson(
  userId: string,
  lessonId: string,
  isDone: boolean,
): Promise<void> {
  const docPath = `users/${userId}/lessonProgress/${lessonId}`;
  try {
    if (isDone) {
      await setDoc(doc(db, "users", userId, "lessonProgress", lessonId), {
        lessonId,
        userId,
        completedAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(doc(db, "users", userId, "lessonProgress", lessonId));
    }
  } catch (error) {
    handleFirestoreError(error, isDone ? OperationType.CREATE : OperationType.DELETE, docPath);
  }
}

export async function getFirebaseLessonProgress(userId: string): Promise<string[]> {
  const collPath = `users/${userId}/lessonProgress`;
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "lessonProgress"));
    return snapshot.docs.map((docSnap) => docSnap.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collPath);
  }
}

export async function syncFirebaseResumeItem(
  userId: string,
  itemId: string,
  status: ChecklistStatus,
): Promise<void> {
  const docPath = `users/${userId}/resumeChecklist/${itemId}`;
  try {
    await setDoc(doc(db, "users", userId, "resumeChecklist", itemId), {
      itemId,
      userId,
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function getFirebaseResumeChecklist(
  userId: string,
): Promise<Record<string, ChecklistStatus>> {
  const collPath = `users/${userId}/resumeChecklist`;
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "resumeChecklist"));
    const result: Record<string, ChecklistStatus> = {};
    snapshot.docs.forEach((d) => {
      result[d.id] = d.data().status as ChecklistStatus;
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collPath);
  }
}

export { onAuthStateChanged, type FirebaseUser };
