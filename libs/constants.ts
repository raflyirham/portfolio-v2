import { valueOrDefault } from "./utils";

export const RECAPTCHA_SITE_KEY = valueOrDefault(
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string,
  ""
);
