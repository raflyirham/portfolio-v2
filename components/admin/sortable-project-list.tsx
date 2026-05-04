"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  deleteProject,
  reorderProjects,
  toggleProjectPublished,
} from "@/app/admin/projects/actions";
import type { ProjectView } from "@/libs/project-data";

const dragHandleClassName =
  "flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-lg border border-[#202024] text-gray-400 transition hover:border-blue-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

function AdminProjectCard({
  project,
  hasDatabaseUrl,
  dragHandle,
  articleRef,
  articleStyle,
}: Readonly<{
  project: ProjectView;
  hasDatabaseUrl: boolean;
  dragHandle: ReactNode;
  articleRef?: (node: HTMLElement | null) => void;
  articleStyle?: CSSProperties;
}>) {
  return (
    <article
      ref={articleRef}
      style={articleStyle}
      className="grid gap-4 rounded-2xl border border-[#202024] bg-[#131316] p-4 md:grid-cols-[auto_160px_1fr_auto]"
    >
      {dragHandle}
      <div className="relative h-32 overflow-hidden rounded-xl bg-[#0b0b0d] md:h-full md:min-h-[8rem]">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-clashDisplay text-xl font-medium text-white">{project.title}</h2>
          <span className="rounded-full border border-[#202024] px-3 py-1 text-xs text-gray-300">
            {project.isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <p className="mt-2 font-satoshi text-sm text-gray-400">/{project.slug}</p>
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
  );
}

function StaticProjectRow({
  project,
  hasDatabaseUrl,
}: Readonly<{
  project: ProjectView;
  hasDatabaseUrl: boolean;
}>) {
  return (
    <AdminProjectCard
      project={project}
      hasDatabaseUrl={hasDatabaseUrl}
      dragHandle={
        <button
          type="button"
          className={dragHandleClassName}
          disabled={!hasDatabaseUrl}
          aria-label="Drag to reorder"
        >
          <IconGripVertical size={20} />
        </button>
      }
    />
  );
}

function SortableRow({
  project,
  hasDatabaseUrl,
}: Readonly<{
  project: ProjectView;
  hasDatabaseUrl: boolean;
}>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled: !hasDatabaseUrl,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
  };

  return (
    <AdminProjectCard
      project={project}
      hasDatabaseUrl={hasDatabaseUrl}
      articleRef={setNodeRef}
      articleStyle={style}
      dragHandle={
        <button
          type="button"
          className={dragHandleClassName}
          disabled={!hasDatabaseUrl}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical size={20} />
        </button>
      }
    />
  );
}

export default function SortableProjectList({
  projects,
  hasDatabaseUrl,
}: Readonly<{
  projects: ProjectView[];
  hasDatabaseUrl: boolean;
}>) {
  const [ordered, setOrdered] = useState(projects);
  const [dndReady, setDndReady] = useState(false);

  useEffect(() => {
    setOrdered(projects);
  }, [projects]);

  useEffect(() => {
    setDndReady(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !hasDatabaseUrl) {
      return;
    }

    const oldIndex = ordered.findIndex((p) => p.id === active.id);
    const newIndex = ordered.findIndex((p) => p.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const previous = ordered;
    const nextOrder = arrayMove(ordered, oldIndex, newIndex);

    setOrdered(nextOrder);

    try {
      await reorderProjects(nextOrder.map((p) => p.id));
    } catch {
      setOrdered(previous);
    }
  };

  if (!dndReady) {
    return (
      <div className="grid gap-4">
        {ordered.map((project) => (
          <StaticProjectRow key={project.id} project={project} hasDatabaseUrl={hasDatabaseUrl} />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {ordered.map((project) => (
            <SortableRow key={project.id} project={project} hasDatabaseUrl={hasDatabaseUrl} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
