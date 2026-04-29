import Link from "next/link";

import { projectSkillOptions, type ProjectView } from "@/libs/project-data";

interface ProjectFormProps {
  action: (formData: FormData) => void | Promise<void>;
  project?: ProjectView;
  submitLabel: string;
}

export default function ProjectForm({
  action,
  project,
  submitLabel,
}: Readonly<ProjectFormProps>) {
  const selectedSkills = new Set(project?.skills ?? []);

  return (
    <form
      action={action}
      className="grid gap-6 rounded-2xl border border-[#202024] bg-[#131316] p-6"
    >
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
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          rows={4}
          className="resize-none rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="image" className="text-sm font-medium text-white">
          Image upload
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        <p className="text-xs text-gray-400">
          Upload a JPG, PNG, or WebP file up to 4MB. You can also paste an image
          URL below.
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="imageUrl" className="text-sm font-medium text-white">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={project?.imageUrl}
          placeholder="https://..."
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
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
          {projectSkillOptions.map((skill) => (
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

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="sortOrder" className="text-sm font-medium text-white">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={project?.sortOrder ?? 0}
            className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-white outline-none transition focus:border-blue-700"
          />
        </div>

        <label className="mt-7 flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={project?.isPublished ?? true}
            className="accent-blue-700"
          />
          Published
        </label>
      </div>

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
