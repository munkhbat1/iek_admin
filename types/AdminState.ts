
export type AdminState = {
  status: 'loggedOut' | 'loggedIn';
  jwt: JWT | null;
  fingerprint: string | null;
};

export type JWT = {
  access_token: string | null;
  refresh_token: string | null;
}