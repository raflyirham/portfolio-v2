import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
}) => {
  return (
    <div>
      <p>Hi, {name}!</p>
      <p>
        Thank you for contacting me. I will get back to you as soon as possible.
      </p>
      <p>Message:</p>
      <p>{message}</p>
      <p>Email: {email}</p>
    </div>
  );
};
