"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { ProjectView } from "@/libs/project-data";
import type { SkillView } from "@/libs/skills";
import { MAX_PROJECT_PREVIEWS } from "@/schemas/project";

import RichTextEditor from "./rich-text-editor";

interface ProjectFormProps {
  action: (formData: FormData) => void | Promise<void>;
  project?: ProjectView;
  skillOptions: Pick<SkillView, "key" | "label">[];
  submitLabel: string;
}

export default function ProjectForm({
  action,
  project,
  skillOptions,
  submitLabel,
}: Readonly<ProjectFormProps>) {
  const selectedSkills = new Set(project?.skills ?? []);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    project?.previewUrls?.length ? [...project.previewUrls] : []
  );

  return (
    <form
      action={action}
      className="grid gap-6 rounded-2xl border border-[#202024] bg-[#131316] p-6"
    >
      <input type="hidden" name="previewUrlsRetained" value={JSON.stringify(previewUrls)} />

      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-white">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="slug" className="text-sm font-medium text-white">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={project?.slug}
          placeholder="my-project"
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium text-white">
          Short description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          rows={3}
          placeholder="One or two sentences for cards and the project header."
          className="resize-none rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
        />
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-white">Long description</span>
        <p className="text-xs text-gray-400">
          Rich text is saved as safe HTML (headings, bold, lists, links).
        </p>
        <RichTextEditor name="longDescriptionHtml" defaultHtml={project?.longDescriptionHtml} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="image" className="text-sm font-medium text-white">
          Thumbnail upload
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        <p className="text-xs text-gray-400">
          JPG, PNG, or WebP up to 4MB. Used on project cards and as the detail hero. You can
          also paste a thumbnail URL below.
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="imageUrl" className="text-sm font-medium text-white">
          Thumbnail URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={project?.imageUrl}
          placeholder="https://..."
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="previewImages" className="text-sm font-medium text-white">
          Preview images
        </label>
        <p className="text-xs text-gray-400">
          Up to {MAX_PROJECT_PREVIEWS} images total (retained + new uploads). JPG, PNG, or WebP
          up to 4MB each.
        </p>
        {previewUrls.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {previewUrls.map((url) => (
              <li
                key={url}
                className="flex items-center gap-3 rounded-xl border border-[#202024] bg-[#0b0b0d] p-3"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#131316]">
                  <Image src={url} alt="" fill className="object-cover" sizes="112px" />
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewUrls((prev) => prev.filter((u) => u !== url))}
                  className="rounded-full border border-red-900/70 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          id="previewImages"
          name="previewImages"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={previewUrls.length >= MAX_PROJECT_PREVIEWS}
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="repoUrl" className="text-sm font-medium text-white">
            Repository URL
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            defaultValue={project?.repoUrl ?? ""}
            placeholder="https://github.com/..."
            className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="liveUrl" className="text-sm font-medium text-white">
            Live URL
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            defaultValue={project?.liveUrl ?? ""}
            placeholder="https://..."
            className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
          />
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium text-white">Skills</legend>
        <div className="flex flex-wrap gap-3">
          {skillOptions.map((skill) => (
            <label
              key={skill.key}
              className="flex items-center gap-2 rounded-full border border-[#202024] bg-[#0b0b0d] px-4 py-2 text-sm text-white"
            >
              <input
                type="checkbox"
                name="skills"
                value={skill.key}
                defaultChecked={selectedSkills.has(skill.key)}
                className="accent-blue-700"
              />
              {skill.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-white">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={project?.isPublished ?? true}
          className="accent-blue-700"
        />
        Published
      </label>

      <div className="flex flex-col gap-3 border-t border-[#202024] pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin"
          className="rounded-full border border-[#202024] px-5 py-3 text-center text-sm font-medium text-white transition hover:border-blue-700"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-full bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
