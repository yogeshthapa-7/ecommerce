import { useEffect, useRef } from "react";


export function useAutoRefresh(fetchFn: () => void, deps: any[], interval = 10000) {
    const fetchRef = useRef(fetchFn);
    fetchRef.current = fetchFn;

useEffect(() => {
    fetchRef.current();
    const timer = setInterval(() => fetchRef.current(), interval);
    return () => clearInterval(timer);
}, deps);
}