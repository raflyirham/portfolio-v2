"use client";

import { useEffect, useState } from "react";
import {
  ExpressOriginal,
  LaravelOriginal,
  MongodbOriginal,
  NextjsOriginal,
  NodejsOriginal,
  PostgresqlOriginal,
  PrismaOriginal,
  ReactOriginal,
  TailwindcssOriginal,
  TypescriptOriginal,
} from "devicons-react";
import { motion } from "motion/react";

import ProjectCard from "@/components/project-card";
import SkillCard from "@/components/skill-card";
import { API_PATH } from "@/libs/api.-path";
import { defaultProjects, type ProjectView } from "@/libs/project-data";

const skillIconMap: Record<string, { label: string; icon: React.ReactNode }> = {
  express: {
    label: "Express.js",
    icon: <ExpressOriginal size={20} />,
  },
  laravel: {
    label: "Laravel",
    icon: <LaravelOriginal size={20} />,
  },
  mongodb: {
    label: "MongoDB",
    icon: <MongodbOriginal size={20} />,
  },
  nextjs: {
    label: "Next.js",
    icon: <NextjsOriginal size={20} />,
  },
  nodejs: {
    label: "Node.js",
    icon: <NodejsOriginal size={20} />,
  },
  postgresql: {
    label: "PostgreSQL",
    icon: <PostgresqlOriginal size={20} />,
  },
  prisma: {
    label: "Prisma",
    icon: <PrismaOriginal size={20} />,
  },
  react: {
    label: "React.js",
    icon: <ReactOriginal size={20} />,
  },
  tailwind: {
    label: "Tailwind CSS",
    icon: <TailwindcssOriginal size={20} />,
  },
  typescript: {
    label: "TypeScript",
    icon: <TypescriptOriginal size={20} />,
  },
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectView[]>(defaultProjects);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      const response = await fetch(API_PATH.PROJECTS, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const responseData = await response.json();

      if (isMounted && Array.isArray(responseData.data)) {
        setProjects(responseData.data);
      }
    }

    loadProjects().catch((error) => {
      console.error("Failed to load projects", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="projects"
      className="flex flex-col min-h-dvh bg-[#0b0b0d] snap-start px-10 md:px-20 xl:px-40 pt-10 pb-20 md:py-28 xl:py-30 gap-x-2 gap-y-4 md:gap-y-6 xl:gap-y-8"
    >
      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        transition={{
          duration: 1,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        whileInView={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        viewport={{
          once: true,
        }}
        className="text-white text-2xl md:text-4xl lg:text-5xl font-clashDisplay font-medium"
      >
        Projects
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.5,
              delayChildren: 1,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProjectCard
              image={project.imageUrl}
              title={project.title}
              liveLink={project.liveUrl ?? undefined}
              repoLink={project.repoUrl ?? ""}
              skills={project.skills.map((skill) => {
                const skillConfig = skillIconMap[skill];

                return (
                  <SkillCard
                    key={skill}
                    skill={skillConfig?.label ?? skill}
                    icon={skillConfig?.icon}
                    size="small"
                  />
                );
              })}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
