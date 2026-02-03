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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = 'admin@blog.com'; // <--- EASY TO REMEMBER
        const password = 'password123'; // <--- EASY TO REMEMBER
        console.log(`\n🔍 Checking if ${email} exists...`);
        // 1. Check if user exists so we don't crash if you run this twice
        let user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("✨ Creating new Admin user...");
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user = yield prisma.user.create({
                data: { email, password: hashedPassword, name: "Admin" },
            });
            console.log("✅ User created successfully.");
        }
        else {
            console.log("ℹ️  User already exists. You can login now.");
        }
        console.log("\n🔑 LOGIN CREDENTIALS (USE THESE):");
        console.log("=================================");
        console.log("Email:    " + email);
        console.log("Password: " + password);
        console.log("=================================\n");
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
