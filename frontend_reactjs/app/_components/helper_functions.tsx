 export async function fetchBackend(route: string, options?: any) {
    const res = await fetch("/api" + route, options);
    return res;
 }
