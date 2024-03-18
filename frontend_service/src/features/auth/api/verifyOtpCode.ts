import axios from 'axios';

import { serverUrl } from '@/shared/const';
import { AuthorizationToken, OtpCode } from '@/shared/model/types/auth';


export const verifyOtpCode = async (otpCode: OtpCode): Promise<AuthorizationToken> => {
    const response = await axios.post(
        `/api/v1/otp_codes/verify-code`,
        {
            email: otpCode.email,
            code: otpCode.code
        },
        {
            baseURL: serverUrl
        }
    );

    if (response.status !== 200) {
        throw new Error('Код не верный');
    }

    return response.data;
}
