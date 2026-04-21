type IdRecord = {
    id: number;
};
export declare class JsonStore<T extends IdRecord> {
    private readonly fileName;
    private readonly seed;
    private cache;
    private initialized;
    constructor(fileName: string, seed: T[]);
    private get dataDir();
    private get filePath();
    private ensureDir;
    private atomicWrite;
    private readFromDisk;
    private writeToDisk;
    private initIfNeeded;
    all(): Promise<T[]>;
    getById(id: number): Promise<T | undefined>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: number, patch: Partial<T>): Promise<T | null>;
    remove(id: number): Promise<boolean>;
}
export {};
