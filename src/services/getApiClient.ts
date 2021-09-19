import * as next from 'next';
import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';

export type NextContext =
    | Pick<next.NextPageContext, 'req'>
    | {
          req: next.NextApiRequest;
      }
    | null
    | undefined;

export const baseURL = {
    api: process.env.NEXT_PUBLIC_API_URL,
};

export const getApiClient = (
    ctx?: NextContext,
    env?: keyof typeof baseURL,
): AxiosInstance => {
    const api = axios.create({
        baseURL: baseURL[env || 'api'],
    });
    return api;
};
