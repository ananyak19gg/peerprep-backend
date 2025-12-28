import { Request, Response, NextFunction } from "express";
import { admin } from "../firebase";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid token",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // attach user to request
    (req as any).user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token verification failed",
    });
  }
};
