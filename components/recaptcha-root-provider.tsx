"use client";

import { GoogleReCaptchaProvider } from "@google-recaptcha/react";

import { RECAPTCHA_SITE_KEY } from "@/libs/constants";

export function RecaptchaRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!RECAPTCHA_SITE_KEY) {
    return children;
  }

  return (
    <GoogleReCaptchaProvider type="v2-checkbox" siteKey={RECAPTCHA_SITE_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
