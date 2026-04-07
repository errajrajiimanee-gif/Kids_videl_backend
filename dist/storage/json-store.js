"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStore = void 0;
const fs_1 = require("fs");
const path = require("path");
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function ensureArrayOfObjectsWithId(value) {
    if (!Array.isArray(value))
        return [];
    return value.filter((v) => isObject(v) && typeof v.id === 'number');
}
class JsonStore {
    constructor(fileName, seed) {
        this.fileName = fileName;
        this.seed = seed;
        this.cache = null;
        this.initialized = false;
    }
    get filePath() {
        return path.join(process.cwd(), 'data', this.fileName);
    }
    async ensureDir() {
        await fs_1.promises.mkdir(path.dirname(this.filePath), { recursive: true });
    }
    async atomicWrite(contents) {
        await this.ensureDir();
        const tmpPath = `${this.filePath}.tmp`;
        await fs_1.promises.writeFile(tmpPath, contents, 'utf-8');
        await fs_1.promises.rename(tmpPath, this.filePath);
    }
    async readFromDisk() {
        try {
            const raw = await fs_1.promises.readFile(this.filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            return ensureArrayOfObjectsWithId(parsed);
        }
        catch {
            return null;
        }
    }
    async writeToDisk(items) {
        await this.atomicWrite(JSON.stringify(items, null, 2));
    }
    async initIfNeeded() {
        if (this.initialized)
            return;
        const disk = await this.readFromDisk();
        if (disk !== null) {
            if (disk.length > 0) {
                const seedById = new Map(this.seed.map(item => [item.id, item]));
                const merged = disk.map(item => {
                    const seeded = seedById.get(item.id);
                    if (!seeded)
                        return item;
                    return { ...seeded, ...item };
                });
                this.cache = merged;
            }
            else {
                this.cache = [];
            }
            await this.writeToDisk(this.cache);
        }
        else {
            this.cache = [...this.seed];
            await this.writeToDisk(this.cache);
        }
        this.initialized = true;
    }
    async all() {
        await this.initIfNeeded();
        return [...(this.cache ?? [])];
    }
    async getById(id) {
        await this.initIfNeeded();
        return (this.cache ?? []).find(item => item.id === id);
    }
    async create(data) {
        await this.initIfNeeded();
        const items = this.cache ?? [];
        const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const created = { ...data, id: nextId };
        this.cache = [...items, created];
        await this.writeToDisk(this.cache);
        return created;
    }
    async update(id, patch) {
        await this.initIfNeeded();
        const items = this.cache ?? [];
        const index = items.findIndex(i => i.id === id);
        if (index === -1)
            return null;
        const updated = { ...items[index], ...patch, id };
        const next = [...items];
        next[index] = updated;
        this.cache = next;
        await this.writeToDisk(this.cache);
        return updated;
    }
    async remove(id) {
        await this.initIfNeeded();
        const items = this.cache ?? [];
        const next = items.filter(i => i.id !== id);
        const removed = next.length !== items.length;
        if (!removed)
            return false;
        this.cache = next;
        await this.writeToDisk(this.cache);
        return true;
    }
}
exports.JsonStore = JsonStore;
//# sourceMappingURL=json-store.js.map