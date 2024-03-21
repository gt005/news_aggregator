import { client } from "./redis.js";
import axios from "axios";
import crypto from "crypto";

export const sendParsedNewsToBackendServer = async (articles) => {
    /*
    Отправляет новости на бэкенд сервер.

    Args:
        articles (array): массив объектов новостей
    */
    const token = crypto.randomBytes(32).toString('base64url')

    client.set(
        `backend_api_service:auth_token:${token}`,
        `backend_api_service:auth_token:${token}`,
        'EX',
        180
    );

    try {
        const response = await axios.post(
            'http://fastapi_backend:8000/api/v1/news/list',
            articles,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    } catch (error) {
        if (error.response && error.response.status === 500) {
            console.log('Server error:', error.message);
        } else {
            console.log('Error sending data:', error.message);
        }
    }
}
