import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('Please define JWT_SECRET and JWT_REFRESH_SECRET in .env.local');
}

interface AccessTokenPayload extends JwtPayload {
    userId: string;
    role: string;
}

interface RefreshTokenPayload extends JwtPayload {
    userId: string;
}

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
        return null;
    }
};
