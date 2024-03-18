import { removeJwtToken } from '@/shared/lib/storage/jwt';
import { removeCurrentUser } from '@/shared/lib/storage/user';


export const logoutUser = () => {
    removeCurrentUser();
    removeJwtToken();
    window.location.href = '/';
}