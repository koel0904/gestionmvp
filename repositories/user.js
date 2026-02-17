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
      return null;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async createUser(name, email, password) {
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a default business for this user
    const business = await prisma.business.create({
      data: { name: `${name}'s Business` },
    });

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "master",
        businessId: business.id,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
export default userRepository;
