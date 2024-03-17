import axios from 'axios';
import { Folder } from "@/shared/model/types/folders";
import { getJwtToken } from '@/shared/lib/storage/jwt';
import { serverUrl } from '@/shared/const';


export const fetchMyFolders = async (): Promise<Folder[]> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.get(
        `/api/v1/folders/`,
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching folders');
    }

    return response.data;
}
