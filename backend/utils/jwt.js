import jwt from 'jsonwebtoken'

const KEY = 'numsei'

export default function generateToken(userInfo) {
  if (!userInfo.role)
    userInfo.role = 'user';

  return jwt.sign(userInfo, KEY, { expiresIn: '48h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, KEY); 
  } catch {
    return null;
  }
}


export function getTokenInfo(req) {
  try {
    let token = req.headers['x-access-token'];
    if (token === undefined)
      token = req.query['x-access-token']

    return jwt.verify(token, KEY);
  } catch {
    return null;
  }
}

export function getAuthentication(checkRole, throw401 = true) {  
  return (req, resp, next) => {
    try {
      let token = req.headers['x-access-token'];
      if (token === undefined)
        token = req.query['x-access-token'];
    
      const signd = jwt.verify(token, KEY);
      req.user = signd;
      
      if (checkRole && !checkRole(signd) && signd.role !== 'admin')
        return resp.status(403).end();
    
      next();
    } catch {
      if (throw401) {
        resp.status(401).end();
      } else {
        next();
      }
    }
  }
}