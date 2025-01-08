import jwt from "jsonwebtoken";
import { ErrorStatus } from ".";
import { Request, Response, NextFunction } from "express";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res
        .status(ErrorStatus.ErrorInInputs)
        .json({ msg: "Authorization token is required" });
      return;
    }
    if (!process.env.JWT_SECRET) {
      console.log("env not linked");
    } else {
      const veify = jwt.verify(token, process.env.JWT_SECRET) as {
        _id: string;
      };
      req.userId = veify._id;
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(ErrorStatus.InternalError).json({ msg: "Server error" });
    return;
  }
};
