export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export const projects: Project[] = [
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

export interface PortfolioInfo {
  name: string;
  title: string;
  description: string;
  email: string;
  github: string;
  skills: string[];
}

export const portfolioInfo: PortfolioInfo = {
  name: "Paul",
  title: "Full Stack Developer",
  description: "Paul's First Next.js 프로젝트 - 개발자 포트폴리오에 오신 것을 환영합니다.",
  email: "your-email@example.com",
  github: "https://github.com/yourusername",
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Git",
    "GitHub",
  ],
};

