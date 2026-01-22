
export interface PhotoItem {
    id: string;
    url: string;
    name: string;
    uploadedAt: number;
}

export interface EventPhoto {
    id: string;
    eventName: string;
    eventDate: string;
    photos: PhotoItem[];
    createdAt: number;
}

export interface GalleryPhoto {
    id: string;
    year: number;
    photos: PhotoItem[];
    createdAt: number;
}

export interface ReunionPhoto {
    id: string;
    year: number;
    photos: PhotoItem[];
    createdAt: number;
}

const DB_NAME = 'NSMOSA_DB';
const DB_VERSION = 1;
const STORES = {
    EVENTS: 'nsm_event_photos',
    GALLERY: 'nsm_gallery_photos',
    REUNION: 'nsm_reunion_photos',
};

export class DB {
    private static db: IDBDatabase | null = null;

    public static async open(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORES.EVENTS)) {
                    db.createObjectStore(STORES.EVENTS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.GALLERY)) {
                    db.createObjectStore(STORES.GALLERY, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.REUNION)) {
                    db.createObjectStore(STORES.REUNION, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    private static async getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.open();
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    // Generic methods
    private static async getAll<T>(storeName: string): Promise<T[]> {
        const store = await this.getStore(storeName, 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private static async add<T>(storeName: string, item: T): Promise<void> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private static async put<T>(storeName: string, item: T): Promise<void> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private static async delete(storeName: string, id: string): Promise<void> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Public API

    // Events
    public static async getEvents(): Promise<EventPhoto[]> {
        return this.getAll<EventPhoto>(STORES.EVENTS);
    }

    public static async saveEvent(event: EventPhoto): Promise<void> {
        return this.add(STORES.EVENTS, event);
    }

    public static async deleteEvent(id: string): Promise<void> {
        return this.delete(STORES.EVENTS, id);
    }

    // Gallery
    public static async getGallery(): Promise<GalleryPhoto[]> {
        return this.getAll<GalleryPhoto>(STORES.GALLERY);
    }

    public static async saveGallery(gallery: GalleryPhoto): Promise<void> {
        return this.add(STORES.GALLERY, gallery);
    }

    public static async deleteGallery(id: string): Promise<void> {
        return this.delete(STORES.GALLERY, id);
    }

    // Reunion
    public static async getReunion(): Promise<ReunionPhoto[]> {
        return this.getAll<ReunionPhoto>(STORES.REUNION);
    }

    public static async saveReunion(reunion: ReunionPhoto): Promise<void> {
        return this.add(STORES.REUNION, reunion);
    }

    public static async deleteReunion(id: string): Promise<void> {
        return this.delete(STORES.REUNION, id);
    }
}
