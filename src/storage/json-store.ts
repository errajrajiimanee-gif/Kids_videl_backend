import { promises as fs } from 'fs';
import * as path from 'path';

type IdRecord = { id: number };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function ensureArrayOfObjectsWithId(value: unknown): IdRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is IdRecord =>
      isObject(v) && typeof (v as Record<string, unknown>).id === 'number'
  );
}

export class JsonStore<T extends IdRecord> {
  private cache: T[] | null = null;
  private initialized = false;

  constructor(private readonly fileName: string, private readonly seed: T[]) {}

  private get dataDir() {
    const raw = (process.env.DATA_DIR || '').trim();
    if (!raw) return path.join(process.cwd(), 'data');
    return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
  }

  private get filePath() {
    return path.join(this.dataDir, this.fileName);
  }

  private async ensureDir() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
  }

  private async atomicWrite(contents: string) {
    await this.ensureDir();
    const tmpPath = `${this.filePath}.tmp`;
    await fs.writeFile(tmpPath, contents, 'utf-8');
    await fs.rename(tmpPath, this.filePath);
  }

  private async readFromDisk(): Promise<T[] | null> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return ensureArrayOfObjectsWithId(parsed) as T[];
    } catch {
      return null;
    }
  }

  private async writeToDisk(items: T[]) {
    await this.atomicWrite(JSON.stringify(items, null, 2));
  }

  private async initIfNeeded() {
    if (this.initialized) return;
    const disk = await this.readFromDisk();
    if (disk !== null) {
      if (disk.length > 0) {
        const seedById = new Map(this.seed.map(item => [item.id, item]));
        const merged = disk.map(item => {
          const seeded = seedById.get(item.id);
          if (!seeded) return item;
          return { ...seeded, ...item } as T;
        });
        this.cache = merged;
      } else {
        this.cache = [];
      }
      await this.writeToDisk(this.cache);
    } else {
      this.cache = [...this.seed];
      await this.writeToDisk(this.cache);
    }
    this.initialized = true;
  }

  async all(): Promise<T[]> {
    await this.initIfNeeded();
    return [...(this.cache ?? [])];
  }

  async getById(id: number): Promise<T | undefined> {
    await this.initIfNeeded();
    return (this.cache ?? []).find(item => item.id === id);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    await this.initIfNeeded();
    const items = this.cache ?? [];
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const created = { ...data, id: nextId } as T;
    this.cache = [...items, created];
    await this.writeToDisk(this.cache);
    return created;
  }

  async update(id: number, patch: Partial<T>): Promise<T | null> {
    await this.initIfNeeded();
    const items = this.cache ?? [];
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...patch, id } as T;
    const next = [...items];
    next[index] = updated;
    this.cache = next;
    await this.writeToDisk(this.cache);
    return updated;
  }

  async remove(id: number): Promise<boolean> {
    await this.initIfNeeded();
    const items = this.cache ?? [];
    const next = items.filter(i => i.id !== id);
    const removed = next.length !== items.length;
    if (!removed) return false;
    this.cache = next;
    await this.writeToDisk(this.cache);
    return true;
  }
}
