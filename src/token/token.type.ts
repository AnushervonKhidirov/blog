import type { JwtPayload } from 'jsonwebtoken';

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type DecodedToken = {
  accessToken: JwtPayload | string | null;
  refreshToken: JwtPayload | string | null;
};
