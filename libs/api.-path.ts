export const API_PATH = {
  SEND: "/api/send",
  VERIFY_RECAPTCHA: (token: string, secret: string) =>
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
};
