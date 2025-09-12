import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { UserDTO } from "../dtos/userDTO";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

const repo = new UserRepository();
const service = new UserService(repo, process.env.JWT_SECRET || "supersecret");

export const UserController = {
  register: async (req: Request, res: Response) => {
    try {
      const user = await service.register(req.body);
      const safeUser = plainToInstance(UserDTO, user, {
        excludeExtraneousValues: true,
      });
      res.json({ user: safeUser });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await service.login(email, password);
      const safeUser = plainToInstance(UserDTO, user, {
        excludeExtraneousValues: true,
      });
      res.json({ token, user: safeUser });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const allUsers = await service.getAll();
      const plainUsers = allUsers.map((user) => user.toObject()); // important
      const safeUsers = plainToInstance(UserDTO, plainUsers, {
        excludeExtraneousValues: true,
      });
      res.json({ users: safeUsers });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  getByUsername: async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      const user = await service.getByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const plainUser = user.toObject ? user.toObject() : user;
      const safeUser = plainToInstance(UserDTO, plainUser, {
        excludeExtraneousValues: true,
      });

      res.json({ user: safeUser });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  getByUserEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = await service.getByUserEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const plainUser = user.toObject ? user.toObject() : user;
      const safeUser = plainToInstance(UserDTO, plainUser, {
        excludeExtraneousValues: true,
      });
      res.json({ user: safeUser });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const token = await service.forgotPassword(email);
      // In production, send token via email. For demo, return token in response.
      res.json({ message: "Reset token generated", token });
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      await service.resetPassword(token, newPassword);
      res.json({ message: "Password reset successful" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
