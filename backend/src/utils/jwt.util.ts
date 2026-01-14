import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, config.jwt.secret as string, {
        expiresIn: config.jwt.expiresIn as any,
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, config.jwt.refreshSecret as string, {
        expiresIn: config.jwt.refreshExpiresIn as any,
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, config.jwt.refreshSecret);
};
