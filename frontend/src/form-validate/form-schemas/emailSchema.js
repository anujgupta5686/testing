import { z } from "zod";

export const emailSchema = z
  .string()
  .nonempty("Please enter Email Id")
  .email("Invalid email format")
  .refine(
    (email) => {
      const [localPart, domain] = email.split("@");
      return domain === "gmail.com" && localPart.length >= 3;
    },
    {
      message:
        "Email must include '@gmail.com' and have at least 3 characters before '@'.",
    }
  );
