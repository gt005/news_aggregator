import { User } from "@/shared/model/types/users";
import axios from "axios";
import { getJwtToken } from "@/shared/lib/storage/jwt";
import { serverUrl } from "@/shared/const";


export const fetchCurrentUser = async (): Promise<User> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.get(
        `/api/v1/users/me`,
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching user');
    }

    return response.data;
}