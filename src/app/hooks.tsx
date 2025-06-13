"use client";

import { useEffect, useState } from "react";






export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        if (initialValue){
            return initialValue
        }
        const storedValue: string | null = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue!) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}