import { useEffect, useState } from "react";
import Api from "@/services/Api";

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Reusable data-fetching hook with type-safety.
 * @param url API endpoint (e.g. '/users')
 * @param deps Optional dependency array to re-run effect
 */
export default function useFetch<T>(url: string, deps: unknown[] = []): FetchState<T> {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setState({ data: null, loading: true, error: null });

            try {
                const response = await Api.get<T>(url);
                if (isMounted) {
                    setState({ data: response.data, loading: false, error: null });
                }
            } catch (err: any) {
                if (isMounted) {
                    setState({
                        data: null,
                        loading: false,
                        error: err?.message || "Unknown error",
                    });
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, deps);

    return state;
}
