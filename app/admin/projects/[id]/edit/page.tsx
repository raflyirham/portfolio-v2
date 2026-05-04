import { notFound } from "next/navigation";

import { updateProject } from "@/app/admin/projects/actions";
import AdminShell from "@/components/admin/admin-shell";
import ProjectForm from "@/components/admin/project-form";
import { getProjectById } from "@/libs/projects";
import { getSkills } from "@/libs/skills";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, skills] = await Promise.all([getProjectById(id), getSkills()]);

  if (!project) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-clashDisplay text-3xl font-medium text-white">
          Edit project
        </h1>
        <p className="mt-2 font-satoshi text-sm text-gray-400">
          Update project details, links, skills, publish state, and image.
        </p>
      </div>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        project={project}
        skillOptions={skills}
        submitLabel="Update project"
      />
    </AdminShell>
  );
}
