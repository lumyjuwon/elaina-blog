import { access } from 'fs';

let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => {
  console.log('getAccessToken function called ', accessToken);
  return accessToken;
};
