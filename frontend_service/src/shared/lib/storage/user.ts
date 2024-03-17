import { User } from "@/shared/model/types/users";

export function getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

export function setCurrentUser(user: User): void {
    const userStr = JSON.stringify(user);
    localStorage.setItem('currentUser', userStr);
}
