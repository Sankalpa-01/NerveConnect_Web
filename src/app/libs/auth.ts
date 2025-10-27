import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const createJWT = (user: { id: string; name: string }) => {
  const token = jwt.sign(
    {
      id: user.id,
      userName: user.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  )
  return token
}
