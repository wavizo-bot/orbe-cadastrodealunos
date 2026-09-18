import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface OrbeDB extends DBSchema {
  students: {
    key: string;
    value: {
      key: string;
      id: string;
      data: import('../types/student').Student;
    };
  };
  metadata: {
    key: string;
    value: {
      key: string;
      data: import('../types/student').AppMetadata;
    };
  };
  conference: {
    key: string;
    value: {
      key: string;
      data: import('../types/student').ConferenceState;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<OrbeDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<OrbeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<OrbeDB>('orbe-escolar-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('students')) {
          db.createObjectStore('students', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('conference')) {
          db.createObjectStore('conference', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllStudents(): Promise<import('../types/student').Student[]> {
  const db = await getDB();
  const tx = db.transaction('students', 'readonly');
  const store = tx.objectStore('students');
  const all = await store.getAll();
  return all.map(item => item.data);
}

export async function saveStudents(students: import('../types/student').Student[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('students', 'readwrite');
  const store = tx.objectStore('students');
  await store.clear();
  for (const student of students) {
    await store.put({ key: student.id, id: student.id, data: student });
  }
  await tx.done;
}

export async function upsertStudent(student: import('../types/student').Student): Promise<void> {
  const db = await getDB();
  await db.put('students', { key: student.id, id: student.id, data: student });
}

export async function getMetadata(): Promise<import('../types/student').AppMetadata | null> {
  const db = await getDB();
  const result = await db.get('metadata', 'app-metadata');
  return result?.data ?? null;
}

export async function saveMetadata(metadata: import('../types/student').AppMetadata): Promise<void> {
  const db = await getDB();
  await db.put('metadata', { key: 'app-metadata', data: metadata });
}

export async function getConference(): Promise<import('../types/student').ConferenceState | null> {
  const db = await getDB();
  const result = await db.get('conference', 'conference-state');
  return result?.data ?? null;
}

export async function saveConference(conference: import('../types/student').ConferenceState): Promise<void> {
  const db = await getDB();
  await db.put('conference', { key: 'conference-state', data: conference });
}

export async function clearConference(): Promise<void> {
  const db = await getDB();
  await db.delete('conference', 'conference-state');
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['students', 'conference'], 'readwrite');
  await tx.objectStore('students').clear();
  await tx.objectStore('conference').clear();
  await tx.done;
}
