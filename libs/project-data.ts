import type { Project } from "@/db/schema";

export interface ProjectView {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  longDescriptionHtml: string | null;
  previewUrls: string[];
  imageKey: string | null;
  imageUrl: string;
  repoUrl: string | null;
  liveUrl: string | null;
  skills: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultProjects: ProjectView[] = [
  {
    id: "quezt",
    title: "Quezt",
    slug: "quezt",
    description: null,
    longDescriptionHtml: null,
    previewUrls: [],
    imageKey: null,
    imageUrl: "/assets/images/quezt.png",
    repoUrl: "https://github.com/raflyirham/Quezt",
    liveUrl: null,
    skills: ["laravel", "react", "tailwind"],
    sortOrder: 0,
    isPublished: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "movier",
    title: "Movier",
    slug: "movier",
    description: null,
    longDescriptionHtml: null,
    previewUrls: [],
    imageKey: null,
    imageUrl: "/assets/images/movier.png",
    repoUrl: "https://github.com/raflyirham/Movier",
    liveUrl: "https://movier-id.vercel.app/",
    skills: ["nextjs", "react", "tailwind"],
    sortOrder: 1,
    isPublished: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "weather-id",
    title: "WeatherID",
    slug: "weather-id",
    description: null,
    longDescriptionHtml: null,
    previewUrls: [],
    imageKey: null,
    imageUrl: "/assets/images/weather-id.png",
    repoUrl: "https://github.com/raflyirham/WeatherID",
    liveUrl: "https://weatherid.vercel.app/",
    skills: ["nextjs", "react", "tailwind"],
    sortOrder: 2,
    isPublished: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    slug: "pomodoro",
    description: null,
    longDescriptionHtml: null,
    previewUrls: [],
    imageKey: null,
    imageUrl: "/assets/images/pomodoro.png",
    repoUrl: "https://github.com/raflyirham/Pomodoro",
    liveUrl: "https://pomodoro.vercel.app/",
    skills: ["nextjs", "react", "tailwind"],
    sortOrder: 3,
    isPublished: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

export const toProjectView = (project: Project): ProjectView => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  description: project.description,
  longDescriptionHtml: project.longDescriptionHtml,
  previewUrls: project.previewUrls ?? [],
  imageKey: project.imageKey,
  imageUrl: project.imageUrl,
  repoUrl: project.repoUrl,
  liveUrl: project.liveUrl,
  skills: project.skills,
  sortOrder: project.sortOrder,
  isPublished: project.isPublished,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});
