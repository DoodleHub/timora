import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  Query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './index';

// Define a type that includes the id field
type WithId<T> = T & { id: string };

// Generic CRUD operations
export class FirebaseService<T extends DocumentData> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get all documents
  async getAll(): Promise<WithId<T>[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WithId<T>[];
  }

  // Get document by ID
  async getById(id: string): Promise<WithId<T> | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as WithId<T>;
    }
    return null;
  }

  // Add new document
  async add(data: T): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  // Update document
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // Delete document
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Query documents
  async query(
    conditions: { field: string; operator: any; value: any }[],
    orderByField?: string
  ): Promise<WithId<T>[]> {
    let q: Query<DocumentData> = collection(db, this.collectionName);

    // Apply where conditions
    conditions.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });

    // Apply orderBy if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WithId<T>[];
  }
}

// Specific services for your app
export const groupsService = new FirebaseService('groups');
export const tasksService = new FirebaseService('tasks');
export const usersService = new FirebaseService('users');

// Helper functions
export const createTimestamp = () => Timestamp.now();

export const convertTimestamp = (timestamp: Timestamp) => {
  return timestamp.toDate();
};

export const convertToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
};
