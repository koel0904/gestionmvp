import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class userRepository {
  static async getUserByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  }

  static async verifyUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return false;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword ? true : false;
  }

  static async afSetCode(email, code) {
    if (!code || code.length !== 6 || !email) {
      return;
    }
    await prisma.user.update({
      where: { email },
      data: {
        twoFactorCode: code,
        twoFactorCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    return;
  }

  static async verify2FACode(email, code) {
    const user = await this.getUserByEmail(email);
    console.log(user);
    if (!user || !user.twoFactorCode || user.twoFactorCodeExpiry < new Date()) {
      return false;
    }

    return user.twoFactorCode === code ? user.id : false;
  }

  static async createUser(name, email, password) {
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
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
      role: user.role,
    };
    return activeUser;
  }
}
export default userRepository;
