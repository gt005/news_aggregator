import axios from 'axios';

import { serverUrl } from '@/shared/const';


export const sendOtpCode = async (email: string): Promise<null> => {
    const response = await axios.post(
        `/api/v1/otp_codes/send-code`,
        { email: email },
        { baseURL: serverUrl }

    );

    if (response.status !== 204) {
        throw new Error('Ошибка при отправке OTP кода');
    }
    return null;
}
