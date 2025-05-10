import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { EmailTemplate } from "@/templates/email-template";
import { valueOrDefault } from "@/libs/utils";
import { API_PATH } from "@/libs/api.-path";
import { RECAPTCHA_SECRET_KEY } from "@/libs/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, recaptcha } = await request.json();

    if (!recaptcha) {
      return NextResponse.json(
        {
          code: 400,
          status: "error",
          error: "Recaptcha is required",
        },
        { status: 400 }
      );
    }

    const verifyRecaptcha = await fetch(
      API_PATH.VERIFY_RECAPTCHA(recaptcha, RECAPTCHA_SECRET_KEY),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptcha,
        }),
      }
    );

    const verifyRecaptchaData = await verifyRecaptcha.json();

    if (!verifyRecaptchaData.success) {
      return NextResponse.json(
        {
          code: 400,
          status: "error",
          error: "Recaptcha verification failed",
        },
        { status: 400 }
      );
    }

    const ccEmail = valueOrDefault(process.env.CC_EMAIL, "");
    const fromEmail = valueOrDefault(process.env.FROM_EMAIL, "");
    const fromName = valueOrDefault(process.env.FROM_NAME, "");

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [email],
      replyTo: email,
      cc: [ccEmail],
      subject: "Contact Form Submission",
      react: await EmailTemplate({ name, email, message }),
    });

    if (error) {
      return NextResponse.json(
        {
          code: 500,
          status: "error",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
