import AdminShell from "@/components/admin/admin-shell";
import { hasDatabaseUrl } from "@/libs/db";
import { getSkillIconNode, getSkills, iconOptions } from "@/libs/skills";

import { createSkill, deleteSkill, updateSkill } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-clashDisplay text-3xl font-medium text-white">Skills</h1>
        <p className="mt-2 font-satoshi text-sm text-gray-400">
          Manage project skill labels and icon presets.
        </p>
      </div>

      {!hasDatabaseUrl && (
        <div className="mb-6 rounded-xl border border-yellow-700/50 bg-yellow-950/30 p-4 text-sm text-yellow-100">
          `DATABASE_URL` is not configured. Skill mutations are disabled until Neon is
          connected.
        </div>
      )}

      <form
        action={createSkill}
        className="mb-6 grid gap-3 rounded-2xl border border-[#202024] bg-[#131316] p-4 md:grid-cols-[1.2fr_1.2fr_1fr_auto]"
      >
        <input
          name="key"
          placeholder="python"
          required
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
        />
        <input
          name="label"
          placeholder="Python"
          required
          className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
        />
        <div className="flex gap-2">
          <select
            name="iconKey"
            required
            defaultValue="python"
            className="w-full rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
          >
            {iconOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={skills.length}
            className="w-24 rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
          />
        </div>
        <button
          type="submit"
          disabled={!hasDatabaseUrl}
          className="rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add skill
        </button>
      </form>

      <div className="grid gap-3">
        {skills.map((skill) => (
          <article
            key={skill.id}
            className="rounded-2xl border border-[#202024] bg-[#131316] p-4"
          >
            <form
              action={updateSkill.bind(null, skill.id)}
              className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]"
            >
              <label className="grid gap-1 text-xs text-gray-400">
                Key
                <input
                  name="key"
                  required
                  defaultValue={skill.key}
                  className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
                />
              </label>
              <label className="grid gap-1 text-xs text-gray-400">
                Label
                <input
                  name="label"
                  required
                  defaultValue={skill.label}
                  className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
                />
              </label>
              <label className="grid gap-1 text-xs text-gray-400">
                Icon
                <select
                  name="iconKey"
                  required
                  defaultValue={skill.iconKey}
                  className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
                >
                  {iconOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-gray-400">
                Sort
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={skill.sortOrder}
                  className="rounded-lg border border-[#202024] bg-[#0b0b0d] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
                />
              </label>
              <div className="flex items-end gap-2">
                <div className="mb-2 flex min-w-20 items-center gap-2 text-sm text-white">
                  {getSkillIconNode(skill.iconKey, 18)}
                  <span>{skill.label}</span>
                </div>
                <button
                  type="submit"
                  disabled={!hasDatabaseUrl}
                  className="rounded-full border border-[#202024] px-4 py-2 text-sm text-white transition hover:border-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
            <form action={deleteSkill.bind(null, skill.id)} className="mt-3">
              <button
                type="submit"
                disabled={!hasDatabaseUrl}
                className="rounded-full border border-red-900/70 px-4 py-2 text-sm text-red-300 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </form>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
