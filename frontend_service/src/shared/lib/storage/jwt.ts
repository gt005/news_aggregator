import { JwtToken } from "@/shared/model/types/auth";


export function getJwtToken(): JwtToken | null {
    const jwtTokenStr = localStorage.getItem('jwtToken');
    if (jwtTokenStr) {
        return JSON.parse(jwtTokenStr);
    }
    return null;
}

export function setJwtToken(jwtToken: JwtToken): void {
    const jwtTokenStr = JSON.stringify(jwtToken);
    localStorage.setItem('jwtToken', jwtTokenStr);
}

export function removeJwtToken(): void {
    localStorage.removeItem('jwtToken');
}