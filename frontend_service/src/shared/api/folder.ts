import axios from 'axios';
import { Folder } from "@/shared/model/types/folders";
import { serverUrl } from '@/shared/const';


export const fetchFolderById = async (folder_id: string): Promise<Folder> => {
    const response = await axios.get(`/folder/${folder_id}`, { baseURL: serverUrl });

    return response.data;
}
