import axios from 'axios';
import { Folder } from "@/shared/model/types/folders";
import { serverUrl } from '@/shared/const';


export const fetchMyFolders = async (): Promise<Folder[]> => {
    const response = await axios.get(
        `/folder/me`,
        { baseURL: serverUrl }
    );

    return response.data;
}
