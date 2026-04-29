import Image from "next/image";
import Link from "next/link";

import {
  deleteProject,
  toggleProjectPublished,
} from "@/app/admin/projects/actions";
import AdminShell from "@/components/admin/admin-shell";
import { hasDatabaseUrl } from "@/libs/db";
import { getAdminProjects } from "@/libs/projects";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await getAdminProjects();

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-clashDisplay text-3xl font-medium text-white">
            Projects
          </h1>
          <p className="mt-2 font-satoshi text-sm text-gray-400">
            Create, edit, delete, and publish portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95"
        >
          New project
        </Link>
      </div>

      {!hasDatabaseUrl && (
        <div className="mb-6 rounded-xl border border-yellow-700/50 bg-yellow-950/30 p-4 text-sm text-yellow-100">
          `DATABASE_URL` is not configured. The dashboard is showing fallback
          projects and mutations will be disabled until Neon is connected.
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <article
            key={project.id}
            className="grid gap-4 rounded-2xl border border-[#202024] bg-[#131316] p-4 md:grid-cols-[160px_1fr_auto]"
          >
            <div className="relative h-32 overflow-hidden rounded-xl bg-[#0b0b0d] md:h-full">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-clashDisplay text-xl font-medium text-white">
                  {project.title}
                </h2>
                <span className="rounded-full border border-[#202024] px-3 py-1 text-xs text-gray-300">
                  {project.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-2 font-satoshi text-sm text-gray-400">
                /{project.slug}
              </p>
              {project.description && (
                <p className="mt-3 max-w-2xl font-satoshi text-sm leading-6 text-gray-300">
                  {project.description}
                </p>
              )}
              <p className="mt-3 font-satoshi text-xs text-gray-500">
                Skills: {project.skills.join(", ")}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:min-w-36">
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="rounded-full border border-[#202024] px-4 py-2 text-center text-sm font-medium text-white transition hover:border-blue-700"
              >
                Edit
              </Link>
              <form action={toggleProjectPublished.bind(null, project.id, project.isPublished)}>
                <button
                  type="submit"
                  disabled={!hasDatabaseUrl}
                  className="w-full rounded-full border border-[#202024] px-4 py-2 text-sm font-medium text-white transition hover:border-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {project.isPublished ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form action={deleteProject.bind(null, project.id)}>
                <button
                  type="submit"
                  disabled={!hasDatabaseUrl}
                  className="w-full rounded-full border border-red-900/70 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
