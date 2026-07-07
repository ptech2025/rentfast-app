import jwt from 'jsonwebtoken';
export const authenticateToken = (req) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return { authenticated: false, user: null, error: 'No token provided' };
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { authenticated: true, user, error: null };
  } catch (err) {
    return { authenticated: false, user: null, error: 'Invalid token' };
  }
};
export const createToken = (userId, email) => jwt.sign({ userId, email }, process.env.JWT_SECRET);
