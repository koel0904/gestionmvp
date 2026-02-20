import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class userRepository {
  static async getUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async verifyUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return false;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword ? user : false;
  }

  static async verifyUserWith2FA(email, password, code) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return false;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return false;
    }
    if (!user.twoFactorCode || user.twoFactorCodeExpiry < new Date() && user.twoFactorCode !== code) {
      return false;
    }
    return user.id;
  }

  static async afSetCode(email, code) {
    if (!code || code.length !== 6 || !email) {
      return;
    }
    await prisma.user.update({
      where: { email },
      data: { twoFactorCode: code, twoFactorCodeExpiry: new Date(Date.now() + 10 * 60 * 1000) },
    });
    return;
  }

  static async verify2FACode(email, code) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.twoFactorCode || user.twoFactorCodeExpiry < new Date()) {
      return false;
    }
    return user.twoFactorCode === code;
  }

  static async createUser(email, password) {
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    const user = this.getUserById(newUser.id);
    return user;
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    const activeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return activeUser;
  }
}
export default userRepository;
