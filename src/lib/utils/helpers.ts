export function setOrRemoveLocalStorageItem(key: string, value: string | null) {
    if (typeof window !== "undefined") {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
    }
}

export function getLocalStorageItem(key: string) {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key);
    }
    return null;
}

export function removeLocalStorageItem(key: string) {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
}