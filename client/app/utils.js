export const CSS = {navBgColor: 'bg-green-700', bgColorCurrent: 'bg-green-600', bgColorHover: 'hover:bg-green-600', textColor: 'text-white'};
export const fetchUrl = process.env.NODE_ENV === 'production' ? 'https://baudasaude-api.vercel.app' : 'http://localhost:3001'

export function parseJwt(token) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

export function getTokenID(token) {
    return parseJwt(token).id;
}