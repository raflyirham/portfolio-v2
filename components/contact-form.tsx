import { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleReCaptchaCheckbox,
  GoogleReCaptchaProvider,
} from "@google-recaptcha/react";

import { contactFormSchema, ContactFormSchema } from "@/schemas/form";
import { RECAPTCHA_SITE_KEY } from "@/libs/constants";
import { valueOrDefaultNullish } from "@/libs/utils";
import { TbLoader2 } from "react-icons/tb";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      recaptcha: "",
    },
  });

  const onSubmit = useCallback<SubmitHandler<ContactFormSchema>>(
    async (data) => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (responseData.code !== 200) {
          const errorMessage = valueOrDefaultNullish(
            responseData.error,
            "Failed to send message!"
          );
          toast.error(errorMessage, {
            style: {
              border: "1px solid #202024",
              background: "#000000",
              color: "#FFFFFF",
            },
          });
          return;
        }

        toast.success("Message sent successfully!", {
          style: {
            border: "1px solid #202024",
            background: "#000000",
            color: "#FFFFFF",
          },
        });
      } catch {
        toast.error("Failed to send message!", {
          style: {
            border: "1px solid #202024",
            background: "#000000",
            color: "#FFFFFF",
          },
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const onRecaptchaChange = useCallback(
    (token: string | null) => {
      setValue("recaptcha", valueOrDefaultNullish(token, ""), {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const onRecaptchaExpired = useCallback(() => {
    setValue("recaptcha", "", {
      shouldValidate: true,
    });
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-3">
        <label
          htmlFor="name"
          className="text-white text-sm md:text-base lg:text-lg font-satoshi font-medium"
        >
          Name:
        </label>
        <input
          disabled={isLoading}
          {...register("name")}
          type="text"
          id="name"
          placeholder="Enter your name..."
          className="w-full px-3 py-2 rounded-md bg-[#0b0b0d] border border-[#202024] text-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-300"
        />
        {errors.name?.message && (
          <p className="font-satoshi font-normal text-red-500 text-sm">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-3">
        <label
          htmlFor="email"
          className="text-white text-sm md:text-base lg:text-lg font-satoshi font-medium"
        >
          Email:
        </label>
        <input
          disabled={isLoading}
          {...register("email")}
          type="text"
          id="email"
          placeholder="Enter your email..."
          className="w-full px-3 py-2 rounded-md bg-[#0b0b0d] border border-[#202024] text-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-300"
        />
        {errors.email?.message && (
          <p className="font-satoshi font-normal text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-3">
        <label
          htmlFor="message"
          className="text-white text-sm md:text-base lg:text-lg font-satoshi font-medium"
        >
          Message:
        </label>
        <textarea
          disabled={isLoading}
          {...register("message")}
          id="message"
          placeholder="Enter your message..."
          rows={5}
          className="w-full px-3 py-2 rounded-md bg-[#0b0b0d] border border-[#202024] text-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-300 resize-none"
        />
        {errors.message?.message && (
          <p className="font-satoshi font-normal text-red-500 text-sm">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-y-3">
        <input disabled={isLoading} type="hidden" {...register("recaptcha")} />
        <GoogleReCaptchaProvider
          type="v2-checkbox"
          siteKey={RECAPTCHA_SITE_KEY}
        >
          <GoogleReCaptchaCheckbox
            onChange={onRecaptchaChange}
            onExpired={onRecaptchaExpired}
          />
        </GoogleReCaptchaProvider>

        {errors.recaptcha?.message && (
          <p className="font-satoshi font-normal text-red-500 text-sm">
            {errors.recaptcha.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex flex-row gap-x-2 justify-center items-center bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {isLoading && <TbLoader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
