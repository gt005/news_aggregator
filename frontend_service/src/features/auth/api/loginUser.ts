import axios from 'axios';

import { serverUrl } from '@/shared/const';
import { JwtToken } from '@/shared/model/types/auth';


interface LoginUserParams {
    email: string;
    password: string;
}


export const loginUser = async ({ email, password }: LoginUserParams): Promise<JwtToken> => {
    const response = await axios.post(
        `/api/v1/authorization/login`,
        {
            email: email,
            password: password
        },
        { baseURL: serverUrl}
    );

    if (response.status !== 200) {
        throw new Error('Ошибка при входе в систему');
    }

    return response.data;
}
