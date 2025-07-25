import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const env = z.object({
    INJESTER_API_HOST: z.string().default("0.0.0.0"),
    INJESTER_API_PORT: z.coerce.number().default(8080),
    // DATABASE_URL: z.string().url(),
}).parse(process.env);