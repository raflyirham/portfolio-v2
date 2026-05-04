"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import ProjectCard from "@/components/project-card";
import SkillCard from "@/components/skill-card";
import { API_PATH } from "@/libs/api.-path";
import { defaultProjects, type ProjectView } from "@/libs/project-data";
import {
  defaultSkills,
  getSkillIconNode,
  type SkillView,
} from "@/libs/skills";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectView[]>(defaultProjects);
  const [skills, setSkills] = useState<Pick<SkillView, "key" | "label" | "iconKey">[]>(
    defaultSkills
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [projectsResponse, skillsResponse] = await Promise.all([
        fetch(API_PATH.PROJECTS, { cache: "no-store" }),
        fetch(API_PATH.SKILLS, { cache: "no-store" }),
      ]);

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();

        if (isMounted && Array.isArray(projectsData.data)) {
          setProjects(projectsData.data);
        }
      }

      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();

        if (isMounted && Array.isArray(skillsData.data)) {
          setSkills(skillsData.data);
        }
      }
    }

    loadData().catch((error) => {
      console.error("Failed to load projects section data", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const skillMap = new Map(skills.map((skill) => [skill.key, skill]));

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
              slug={project.slug}
              shortDescription={project.description ?? undefined}
              image={project.imageUrl}
              title={project.title}
              liveLink={project.liveUrl ?? undefined}
              repoLink={project.repoUrl ?? ""}
              skills={project.skills.map((skill) => {
                const skillConfig = skillMap.get(skill);

                return (
                  <SkillCard
                    key={skill}
                    skill={skillConfig?.label ?? skill}
                    icon={getSkillIconNode(skillConfig?.iconKey ?? "")}
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
