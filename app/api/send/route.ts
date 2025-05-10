import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { EmailTemplate } from "@/templates/email-template";
import { valueOrDefault } from "@/libs/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

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
    console.error(error);
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
