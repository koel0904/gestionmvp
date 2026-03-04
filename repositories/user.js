import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class userRepository {
  // Finds a person by email in User table first, then Owner table.
  // Returns the record + a `_type` field ("user" or "owner").
  static async getUserByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return { ...user, _type: "user" };

    const owner = await prisma.owner.findUnique({ where: { email } });
    if (owner) return { ...owner, _type: "owner" };

    return null;
  }

  static async verifyUser(email, password) {
    const account = await this.getUserByEmail(email);
    if (!account) return false;

    // Block inactive users BEFORE password check (security: no 2FA code sent)
    if (account._type === "user" && account.active === false) {
      return { inactive: true };
    }

    const validPassword = await bcrypt.compare(password, account.password);
    return validPassword ? true : false;
  }

  static async afSetCode(email, code) {
    if (!code || code.length !== 6 || !email) return;

    const account = await this.getUserByEmail(email);
    if (!account) return;

    const model = account._type === "owner" ? prisma.owner : prisma.user;
    await model.update({
      where: { email },
      data: {
        twoFactorCode: code,
        twoFactorCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  }

  static async verify2FACode(email, code) {
    const account = await this.getUserByEmail(email);
    if (
      !account ||
      !account.twoFactorCode ||
      account.twoFactorCodeExpiry < new Date()
    ) {
      return false;
    }

    // Defense in depth: re-check active status at 2FA step
    if (account._type === "user" && account.active === false) {
      return { inactive: true };
    }

    // Return a composite ID so we know the type when creating the JWT
    return account.twoFactorCode === code
      ? { id: account.id, type: account._type }
      : false;
  }

  static async createUser(name, email, password) {
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const user = await this.getUserById(newUser.id);
    return user;
  }

  static async getUserById(id, type = "user") {
    const model = type === "owner" ? prisma.owner : prisma.user;
    const record = await model.findUnique({ where: { id } });
    if (!record) return null;

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role,
    };
  }
}
export default userRepository;
