export const API_PATH = {
  PROJECTS: "/api/projects",
  SKILLS: "/api/skills",
  SEND: "/api/send",
  VERIFY_RECAPTCHA: (token: string, secret: string) =>
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
};
