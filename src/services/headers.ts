export const getHeaders = (token?: string, includeContentType: boolean = true) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };

    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        // Some apps mistakenly store token along with JSON or extra text in one key.
        // Extract the longest token-like substring (20+ alphanumerics). Fallback to full string if none.
        const raw = String(token);
        const matches = raw.match(/[A-Za-z0-9]{20,}/g);
        const candidate = matches && matches.length > 0
            ? matches.sort((a, b) => b.length - a.length)[0]
            : raw;
        // Normalize candidate to avoid stray quotes/newlines/spaces
        const normalized = candidate.replace(/["]'/g, '').replace(/\s+/g, '').trim().replace(/"|'/g, '');
        if (normalized) {
            headers['Authorization'] = `Token ${normalized}`;
        }
    }

    return headers;
};
