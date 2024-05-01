import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, DocumentData } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from './firebaseConfig';
import { FirebaseError } from "firebase/app";

interface UserDocument {
  id: string;    // Assuming you use the document ID from Firestore
  habit: string;
  priority: 'High' | 'Medium' | 'Low';
  frequency: number;
  userId: string;
  completed: boolean;
}
// User's UID helper function
const getUserId = (): string => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");
  return userId;
};

// Create a new document in a collection with the user's UID
export const addDocument = async (collectionName: string, data: any): Promise<void> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get current user's UID
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  // Include userId in the document if not already included
  const documentData = { ...data, userId };

  console.log("Adding document for user ID:", userId);
  console.log("Document data:", documentData);

  try {
    const docRef = await addDoc(collection(db, collectionName), documentData);
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error adding document: ", error.message);
      throw new Error(error.message);
    } else {
      console.error("Unexpected error", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fetch all documents from a collection that belong to the authenticated user
export const fetchDocuments = async (collectionName: string): Promise<UserDocument[]> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const userQuery = query(collection(db, collectionName), where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(userQuery);
    const documents: UserDocument[] = [];  // Explicitly typed as an array of UserDocument
    querySnapshot.forEach(doc => {
      // You need to ensure here that the document data conforms to the UserDocument structure
      documents.push({ id: doc.id, ...doc.data() as Omit<UserDocument, 'id'> });
    });
    return documents;
  } catch (error) {
    console.error("Error fetching user documents: ", error);
    throw error;
  }
};

// Update an existing document
export const updateDocument = async (collectionName: string, docId: string, newData: Partial<UserDocument>): Promise<void> => {
  try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, newData);
      console.log("Document successfully updated!");
  } catch (error) {
      if (error instanceof FirebaseError) {
          console.error("Firebase error: ", error.message); // Firebase specific error handling
          throw new Error(error.message);
      } else {
          console.error("Unexpected error", error); // Generic error handling
          throw new Error("An unexpected error occurred");
      }
  }
};

// Delete a document from a collection
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error deleting document: ", error.code, error.message);
      throw new Error(error.message);
    } else {
      console.error("Unexpected error", error);
      throw new Error("An unexpected error occurred");
    }
  }
};