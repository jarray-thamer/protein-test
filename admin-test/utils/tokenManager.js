const jwt = require("jsonwebtoken");

const createToken = (_id, role,  expiresIn) => {
  const payload = { _id, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token || token.trim() === "") {
      return res.status(401).json({ message: "Token Not Received" });
    }

    // Use promisify to convert jwt.verify to Promise-based
    const jwtData = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    // Set the jwtData in res.locals
    res.locals.jwtData = jwtData;

    // Move to next middleware
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token",
    });
  }
};

const clientVerifyToken = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.CLIENT_COOKIE_NAME];

    if (!token || token.trim() === "") {
      return res.status(401).json({ message: "Token Not Received" });
    }

    // Use promisify to convert jwt.verify to Promise-based
    const jwtData = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    // Set the jwtData in res.locals
    res.locals.jwtData = jwtData;

    // Move to next middleware
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token",
    });
  }
};

module.exports = { verifyToken, createToken, clientVerifyToken };
