"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github, Mail, ExternalLink, ArrowRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "모바일 앱 프로젝트",
    description: "프로젝트에 대한 간단한 설명을 여기에 작성하세요. 사용된 기술과 주요 기능을 소개합니다.",
    longDescription: "이 프로젝트는 현대적인 모바일 앱 개발을 위한 포괄적인 솔루션입니다. 사용자 경험을 최우선으로 고려하여 설계되었으며, 직관적인 인터페이스와 뛰어난 성능을 제공합니다. 다양한 기능과 모듈을 통합하여 완전한 모바일 애플리케이션을 구현했습니다.",
    technologies: ["Next.js", "TypeScript"],
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",
    githubUrl: "https://github.com/yourusername/project1",
    portfolioUrl: "https://project1-demo.vercel.app",
  },
  {
    id: 2,
    title: "웹 개발 프로젝트",
    description: "프로젝트에 대한 간단한 설명을 여기에 작성하세요. 사용된 기술과 주요 기능을 소개합니다.",
    longDescription: "이 웹 개발 프로젝트는 최신 웹 기술을 활용하여 구축된 반응형 웹 애플리케이션입니다. 사용자 친화적인 디자인과 강력한 백엔드 기능을 결합하여 완전한 웹 솔루션을 제공합니다. 다양한 디바이스에서 최적의 경험을 보장합니다.",
    technologies: ["React", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80",
    githubUrl: "https://github.com/yourusername/project2",
    portfolioUrl: "https://project2-demo.vercel.app",
  },
  {
    id: 3,
    title: "백엔드 프로젝트",
    description: "프로젝트에 대한 간단한 설명을 여기에 작성하세요. 사용된 기술과 주요 기능을 소개합니다.",
    longDescription: "이 백엔드 프로젝트는 확장 가능하고 안정적인 서버 아키텍처를 구현합니다. RESTful API 설계와 데이터베이스 최적화를 통해 높은 성능과 보안을 제공합니다. 마이크로서비스 아키텍처를 활용하여 유연하고 확장 가능한 시스템을 구축했습니다.",
    technologies: ["Node.js", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop&q=80",
    githubUrl: "https://github.com/yourusername/project3",
    portfolioUrl: "https://project3-demo.vercel.app",
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              포트폴리오
            </div>
            <div className="hidden gap-6 md:flex">
              <a
                href="#about"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                소개
              </a>
              <a
                href="#projects"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                프로젝트
              </a>
              <a
                href="#skills"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                스킬
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                연락처
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
                Paul's First Next.js 프로젝트
              </h1>
              <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                개발자 포트폴리오에 오신 것을 환영합니다. 제가 만든 프로젝트들을
                확인해보세요.
              </p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Button asChild size="lg">
                  <a href="#projects">프로젝트 보기</a>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <a href="#contact">
                    연락하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&q=80"
                alt="서울 밤하늘"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section
        id="projects"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            프로젝트
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            제가 개발한 프로젝트들을 소개합니다.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  자세히 보기
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.githubUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <Github className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 프로젝트 상세 모달 */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          {selectedProject && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">프로젝트 소개</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">사용된 기술</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button asChild className="flex-1">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub 보기
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={selectedProject.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      포트폴리오 보기
                    </a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </section>

      {/* 스킬 섹션 */}
      <section
        id="skills"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            기술 스택
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            제가 사용하는 주요 기술들입니다.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl mb-12">
            <Image
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop&q=80"
              alt="서울 밤하늘 스카이라인"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-lg font-semibold">현대적인 기술 스택으로 혁신적인 솔루션을 만듭니다</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "JavaScript",
              "Tailwind CSS",
              "Node.js",
              "Git",
              "GitHub",
            ].map((skill) => (
              <Card
                key={skill}
                className="text-center transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {skill}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section
        id="contact"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80"
                alt="서울 밤하늘"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                연락하기
              </h2>
              <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                프로젝트나 협업에 관심이 있으시다면 언제든 연락주세요.
              </p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Button asChild size="lg">
                  <a href="mailto:your-email@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    이메일 보내기
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>© 2024 Paul's Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
