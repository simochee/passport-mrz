import type { InferOutput } from "valibot";
import type { PassportSchema } from "../utils/schema";

export type PassportInput = InferOutput<typeof PassportSchema>;
