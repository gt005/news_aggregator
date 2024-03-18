import axios from 'axios';

import { serverUrl } from '@/shared/const';
import { AuthorizationToken, JwtToken, OtpCode } from '@/shared/model/types/auth';


interface RegisterUserParams {
    authorizationToken: AuthorizationToken;
    email: string;
    name: string;
    password: string;
}


export const registerUser = async ({ authorizationToken, email, name, password }: RegisterUserParams): Promise<JwtToken> => {
    const response = await axios.post(
        `/api/v1/authorization/registration`,
        {
            email: email,
            name: name,
            password: password
        },
        {
            headers: {
                'Authorization': `Bearer ${authorizationToken.token}`
            },
            baseURL: serverUrl
        }
    );

    if (response.status !== 200) {
        throw new Error('Ошибка при регистрации');
    }

    return response.data;
}
