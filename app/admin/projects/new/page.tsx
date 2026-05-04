import { createProject } from "@/app/admin/projects/actions";
import AdminShell from "@/components/admin/admin-shell";
import ProjectForm from "@/components/admin/project-form";
import { getSkills } from "@/libs/skills";

export default async function NewProjectPage() {
  const skills = await getSkills();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-clashDisplay text-3xl font-medium text-white">
          New project
        </h1>
        <p className="mt-2 font-satoshi text-sm text-gray-400">
          Add a project to the public portfolio grid.
        </p>
      </div>
      <ProjectForm action={createProject} skillOptions={skills} submitLabel="Create project" />
    </AdminShell>
  );
}
