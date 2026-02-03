"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🛠️  Fixing Admin Account...");
        const email = 'admin@blog.com';
        const password = 'password123';
        // 1. Delete existing admin if they exist (to clear bad data)
        try {
            yield prisma.user.delete({ where: { email } });
            console.log("🗑️  Old admin deleted.");
        }
        catch (e) {
            // It's okay if user didn't exist
        }
        // 2. Create the user fresh
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: "Admin User"
            },
        });
        console.log("\n✅ ADMIN RESET SUCCESSFUL");
        console.log("--------------------------------");
        console.log("📧 Email:    " + email);
        console.log("🔑 Password: " + password);
        console.log("--------------------------------\n");
    });
}
reset()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
