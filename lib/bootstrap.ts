import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ROLES, PERMISSIONS } from "./constants";

export async function bootstrapSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
        console.warn("SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in environment variables. Skipping bootstrap.");
        return;
    }

    try {
        const existingAdmin = await User.findOne({ email });
        if (!existingAdmin) {
            console.log("Bootstrapping Super Admin...");
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name: "Super Admin",
                email,
                password: hashedPassword,
                role: ROLES.SUPER_ADMIN,
                permissions: [], // Super admin implicitly has all, but empty array is fine
                provider: "credentials",
            });
            console.log("Super Admin created successfully.");
        }
    } catch (error) {
        console.error("Failed to bootstrap Super Admin:", error);
    }
}
