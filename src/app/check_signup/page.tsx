import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const checkUser = async () => {
    const cookie = (await cookies()).get("auth_token")
    const token = cookie?.value

    if (token) {
        redirect("/dashboard")
    } else {
        redirect("/signup")
    }
}

export default checkUser