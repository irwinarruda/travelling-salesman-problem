import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiClient } from '@services/getApiClient';

type Tuple<T> = [T, T];

type ApiRequestBody = {
    destinations: Tuple<number>[];
    origins: Tuple<number>[];
};

export default async function getDistanceMatrix(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    try {
        const { destinations, origins } = req.body as ApiRequestBody;
        const api = getApiClient({ req }, 'api');
        const apiKey = undefined; // process.env.GOOGLE_API_KEY;
        const params = {
            destinations: destinations
                .map((latlng) => `${latlng[0]},${latlng[1]}`)
                .join('|'),
            origins: origins
                .map((latlng) => `${latlng[0]},${latlng[1]}`)
                .join('|'),
            key: apiKey,
        };
        const response = await api({
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json',
            method: 'get',
            params: params,
        });
        const data = await response.data;
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(402);
    }
}
