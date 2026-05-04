import Link from "next/link";

import AdminShell from "@/components/admin/admin-shell";
import SortableProjectList from "@/components/admin/sortable-project-list";
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

      <SortableProjectList projects={projects} hasDatabaseUrl={hasDatabaseUrl} />
    </AdminShell>
  );
}
