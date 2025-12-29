"use client";

import { useState } from "react";
import * as React from "react";
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
import { Github, Mail, ExternalLink, ArrowRight, ThumbsUp, Sparkles, Edit, Trash2 } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GuestbookEntry } from "@/lib/guestbook";
import type { BoardPost } from "@/lib/board";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // 방명록 상태
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestbookName, setGuestbookName] = useState("");
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 수정 관련 상태
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // 삭제 관련 상태
  const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 게시판 상태
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  
  // 게시판 수정 관련 상태
  const [editingPost, setEditingPost] = useState<BoardPost | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  
  // 게시판 삭제 관련 상태
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  
  // 사용자 ID (localStorage에서 가져오거나 생성)
  const [userId, setUserId] = useState<string>("");
  
  // 좋아요 상태 추적
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  
  // 랜덤 추천 상태 (프론트엔드만)
  const [randomQuote, setRandomQuote] = useState<{ title: string; url: string } | null>(null);
  
  // 방명록 불러오기
  const fetchGuestbook = async () => {
    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      if (data.success) {
        setGuestbookEntries(data.data);
      }
    } catch (error) {
      console.error("방명록 불러오기 실패:", error);
    }
  };
  
  // 컴포넌트 마운트 시 방명록 불러오기
  React.useEffect(() => {
    fetchGuestbook();
  }, []);
  
  // 게시판 불러오기
  const fetchBoard = async () => {
    try {
      const response = await fetch("/api/board");
      const data = await response.json();
      if (data.success) {
        setBoardPosts(data.data);
      }
    } catch (error) {
      console.error("게시판 불러오기 실패:", error);
    }
  };
  
  // 사용자 ID 초기화
  React.useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);
  
  // 컴포넌트 마운트 시 게시판 불러오기
  React.useEffect(() => {
    fetchBoard();
  }, []);
  
  // 게시판 데이터 로드 시 좋아요 상태 업데이트
  React.useEffect(() => {
    if (boardPosts.length > 0 && userId) {
      const liked = new Set<number>();
      boardPosts.forEach((post) => {
        if (post.likedBy && post.likedBy.includes(userId)) {
          liked.add(post.id);
        }
      });
      setLikedPosts(liked);
    }
  }, [boardPosts, userId]);
  
  // 방명록 작성
  const handleSubmitGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMessage.trim()) {
      alert("이름과 메시지를 모두 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: guestbookName,
          message: guestbookMessage,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setGuestbookName("");
        setGuestbookMessage("");
        fetchGuestbook(); // 목록 새로고침
      } else {
        alert(data.error || "방명록 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert("방명록 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 방명록 수정 시작
  const handleStartEdit = (entry: GuestbookEntry) => {
    setEditingEntry(entry);
    setEditName(entry.name);
    setEditMessage(entry.message);
  };
  
  // 방명록 수정 취소
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditName("");
    setEditMessage("");
  };
  
  // 방명록 수정 제출
  const handleUpdateGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    
    if (!editName.trim() || !editMessage.trim()) {
      alert("이름과 메시지를 모두 입력해주세요.");
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/guestbook/${editingEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          message: editMessage,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        handleCancelEdit();
        fetchGuestbook(); // 목록 새로고침
      } else {
        alert(data.error || "방명록 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 수정 실패:", error);
      alert("방명록 수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // 방명록 삭제
  const handleDeleteGuestbook = async (id: number) => {
    if (!confirm("정말 이 방명록을 삭제하시겠습니까?")) {
      return;
    }
    
    setIsDeleting(true);
    setDeletingEntryId(id);
    try {
      const response = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      if (data.success) {
        fetchGuestbook(); // 목록 새로고침
      } else {
        alert(data.error || "방명록 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 삭제 실패:", error);
      alert("방명록 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setDeletingEntryId(null);
    }
  };
  
  // 게시글 작성
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim() || !boardContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    setIsSubmittingPost(true);
    try {
      const response = await fetch("/api/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: boardTitle,
          content: boardContent,
        }),
      });
      
      const data = await response.json();
      console.log("게시글 작성 응답:", data);
      if (data.success) {
        setBoardTitle("");
        setBoardContent("");
        console.log("작성된 게시글 ID:", data.data?.id);
        // 목록 새로고침 (서버에서 최신 데이터 가져오기)
        // 약간의 지연을 두어 서버 메모리가 완전히 업데이트되도록 함
        await new Promise(resolve => setTimeout(resolve, 100));
        await fetchBoard();
      } else {
        alert(data.error || "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsSubmittingPost(false);
    }
  };
  
  // 게시글 수정 시작
  const handleStartEditPost = (post: BoardPost) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };
  
  // 게시글 수정 취소
  const handleCancelEditPost = () => {
    setEditingPost(null);
    setEditPostTitle("");
    setEditPostContent("");
  };
  
  // 게시글 수정 제출
  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    if (!editPostTitle.trim() || !editPostContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    setIsUpdatingPost(true);
    try {
      const response = await fetch(`/api/board/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editPostTitle,
          content: editPostContent,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        handleCancelEditPost();
        fetchBoard(); // 목록 새로고침
      } else {
        alert(data.error || "게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsUpdatingPost(false);
    }
  };
  
  // 게시글 삭제
  const handleDeletePost = async (id: number) => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }
    
    setIsDeletingPost(true);
    setDeletingPostId(id);
    try {
      const response = await fetch(`/api/board/${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      if (data.success) {
        fetchBoard(); // 목록 새로고침
      } else {
        alert(data.error || "게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeletingPost(false);
      setDeletingPostId(null);
    }
  };
  
  // 게시글 좋아요 토글
  const handleLikePost = async (id: number) => {
    if (!userId) {
      console.error("userId가 없습니다.");
      alert("사용자 ID를 찾을 수 없습니다. 페이지를 새로고침해주세요.");
      return;
    }
    
    console.log("좋아요 클릭 - postId:", id, "userId:", userId);
    
    try {
      const response = await fetch(`/api/board/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      console.log("좋아요 응답:", data);
      
      if (data.success) {
        // 좋아요 상태 업데이트
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (data.isLiked) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          return newSet;
        });
        // 목록 새로고침 (좋아요 수 업데이트)
        await fetchBoard();
      } else {
        console.error("좋아요 실패:", data.error);
        alert(data.error || "좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };
  
  // Fortune Cookie 생성
  const generateRandomQuote = () => {
    const fortuneCookies = [
      { title: "행운", url: "" },
      { title: "기회", url: "" },
      { title: "성공", url: "" },
      { title: "사랑", url: "" },
      { title: "건강", url: "" },
      { title: "지혜", url: "" },
      { title: "행복", url: "" },
      { title: "번영", url: "" },
      { title: "평화", url: "" },
      { title: "용기", url: "" },
    ];

    const messages = [
      "오늘은 특별한 기회가 찾아올 것입니다.",
      "당신의 노력이 곧 결실을 맺을 것입니다.",
      "새로운 만남이 행운을 가져다 줄 것입니다.",
      "긍정적인 마음가짐이 좋은 결과를 만듭니다.",
      "오늘 하루 웃음이 가득할 것입니다.",
      "작은 변화가 큰 기쁨을 선사할 것입니다.",
      "당신의 친절함이 좋은 인연으로 돌아올 것입니다.",
      "오늘은 새로운 시작을 위한 완벽한 날입니다.",
      "예상치 못한 곳에서 좋은 소식이 올 것입니다.",
      "당신의 꿈이 한 걸음 더 가까워지고 있습니다.",
      "오늘 만나는 사람들이 특별한 영감을 줄 것입니다.",
      "인내심을 가지면 원하는 것을 얻을 수 있습니다.",
      "당신의 직관을 믿으세요. 올바른 길을 가고 있습니다.",
      "오늘은 감사할 일이 많이 생길 것입니다.",
      "용기를 내면 새로운 가능성이 열릴 것입니다.",
    ];

    const randomIndex = Math.floor(Math.random() * fortuneCookies.length);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    setRandomQuote({
      title: `${fortuneCookies[randomIndex].title}: ${randomMessage}`,
      url: ""
    });
  };
  
  React.useEffect(() => {
    generateRandomQuote();
  }, []);
  
  // 방명록 초기화
  const handleClearGuestbook = async () => {
    if (!confirm("정말 모든 방명록을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    
    try {
      const response = await fetch("/api/guestbook/clear", {
        method: "DELETE",
      });
      
      const data = await response.json();
      if (data.success) {
        fetchGuestbook(); // 목록 새로고침
        alert("방명록이 초기화되었습니다.");
      } else {
        alert(data.error || "방명록 초기화에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 초기화 실패:", error);
      alert("방명록 초기화에 실패했습니다.");
    }
  };
  
  // 게시판 초기화
  const handleClearBoard = async () => {
    if (!confirm("정말 모든 게시글을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    
    try {
      const response = await fetch("/api/board/clear", {
        method: "DELETE",
      });
      
      const data = await response.json();
      if (data.success) {
        fetchBoard(); // 목록 새로고침
        setLikedPosts(new Set()); // 좋아요 상태도 초기화
        alert("게시판이 초기화되었습니다.");
      } else {
        alert(data.error || "게시판 초기화에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시판 초기화 실패:", error);
      alert("게시판 초기화에 실패했습니다.");
    }
  };
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
              <a
                href="#api-demo"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                API 실습
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
            <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl">
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
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900/60 to-transparent" />
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
            <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl order-2 lg:order-1">
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

      {/* API 실습 섹션 */}
      <section
        id="api-demo"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              API 실습
            </h2>
            <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              다양한 API 기능을 직접 테스트해보세요.
            </p>
          </div>

          <Card>
            <Tabs defaultValue="guestbook" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guestbook">방명록</TabsTrigger>
                <TabsTrigger value="board">게시판</TabsTrigger>
                <TabsTrigger value="quote">오늘의 운세</TabsTrigger>
              </TabsList>

              {/* 방명록 탭 */}
              <TabsContent value="guestbook" className="space-y-6 p-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">방명록 남기기</h3>
                  <form onSubmit={handleSubmitGuestbook} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        이름
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={guestbookName}
                        onChange={(e) => setGuestbookName(e.target.value)}
                        maxLength={50}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        메시지
                      </label>
                      <Textarea
                        id="message"
                        placeholder="메시지를 입력하세요"
                        value={guestbookMessage}
                        onChange={(e) => setGuestbookMessage(e.target.value)}
                        maxLength={500}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "작성 중..." : "방명록 작성"}
                    </Button>
                  </form>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      방명록 목록 ({guestbookEntries.length})
                    </h3>
                    {guestbookEntries.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearGuestbook}
                      >
                        전체 초기화
                      </Button>
                    )}
                  </div>
                  {guestbookEntries.length === 0 ? (
                    <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                      아직 방명록이 없습니다. 첫 번째 방명록을 남겨보세요!
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {guestbookEntries.map((entry) => (
                        <Card key={entry.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                              {entry.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(entry.createdAt).toLocaleString("ko-KR")}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(entry)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteGuestbook(entry.id)}
                                  disabled={isDeleting && deletingEntryId === entry.id}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                            {entry.message}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 수정 모달 */}
                <Dialog open={!!editingEntry} onOpenChange={(open) => !open && handleCancelEdit()}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>방명록 수정</DialogTitle>
                      <DialogDescription>
                        방명록 내용을 수정할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateGuestbook} className="space-y-4 mt-4">
                      <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                          이름
                        </label>
                        <Input
                          id="edit-name"
                          type="text"
                          placeholder="이름을 입력하세요"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={50}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-message" className="block text-sm font-medium mb-2">
                          메시지
                        </label>
                        <Textarea
                          id="edit-message"
                          placeholder="메시지를 입력하세요"
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          maxLength={500}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          취소
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? "수정 중..." : "수정하기"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* 게시판 탭 */}
              <TabsContent value="board" className="space-y-6 p-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">게시글 작성</h3>
                  <form onSubmit={handleSubmitPost} className="space-y-4">
                    <div>
                      <label htmlFor="post-title" className="block text-sm font-medium mb-2">
                        제목
                      </label>
                      <Input
                        id="post-title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="post-content" className="block text-sm font-medium mb-2">
                        내용
                      </label>
                      <Textarea
                        id="post-content"
                        placeholder="내용을 입력하세요"
                        value={boardContent}
                        onChange={(e) => setBoardContent(e.target.value)}
                        maxLength={2000}
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmittingPost} className="w-full">
                      {isSubmittingPost ? "작성 중..." : "게시글 작성"}
                    </Button>
                  </form>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      게시글 목록 ({boardPosts.length})
                    </h3>
                    {boardPosts.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearBoard}
                      >
                        전체 초기화
                      </Button>
                    )}
                  </div>
                  {boardPosts.length === 0 ? (
                    <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                      아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {boardPosts.map((post) => (
                        <Card key={post.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-1">
                                {post.title}
                              </div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(post.createdAt).toLocaleString("ko-KR")}
                                {post.updatedAt && (
                                  <span className="ml-2">(수정됨)</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEditPost(post)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                disabled={isDeletingPost && deletingPostId === post.id}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap mb-4">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikePost(post.id)}
                              className={`gap-2 ${
                                likedPosts.has(post.id)
                                  ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  : ""
                              }`}
                            >
                              <ThumbsUp
                                className={`h-5 w-5 transition-all ${
                                  likedPosts.has(post.id)
                                    ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400"
                                    : "text-zinc-600 dark:text-zinc-400"
                                }`}
                              />
                              좋아요
                            </Button>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {post.likeCount > 0 ? `${post.likeCount}개` : ""}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 게시글 수정 모달 */}
                <Dialog open={!!editingPost} onOpenChange={(open) => !open && handleCancelEditPost()}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>게시글 수정</DialogTitle>
                      <DialogDescription>
                        게시글 내용을 수정할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdatePost} className="space-y-4 mt-4">
                      <div>
                        <label htmlFor="edit-post-title" className="block text-sm font-medium mb-2">
                          제목
                        </label>
                        <Input
                          id="edit-post-title"
                          type="text"
                          placeholder="제목을 입력하세요"
                          value={editPostTitle}
                          onChange={(e) => setEditPostTitle(e.target.value)}
                          maxLength={100}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-post-content" className="block text-sm font-medium mb-2">
                          내용
                        </label>
                        <Textarea
                          id="edit-post-content"
                          placeholder="내용을 입력하세요"
                          value={editPostContent}
                          onChange={(e) => setEditPostContent(e.target.value)}
                          maxLength={2000}
                          rows={6}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEditPost}
                        >
                          취소
                        </Button>
                        <Button type="submit" disabled={isUpdatingPost}>
                          {isUpdatingPost ? "수정 중..." : "수정하기"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* 오늘의 운세 탭 */}
              <TabsContent value="quote" className="space-y-6 p-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-6">Fortune Cookie</h3>
                  {randomQuote ? (
                    <>
                      <Card className="p-8 mb-6 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Sparkles className="h-8 w-8 text-yellow-500" />
                          <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 leading-relaxed">
                            {randomQuote.title}
                          </p>
                        </div>
                      </Card>
                      <Button onClick={generateRandomQuote} variant="outline" size="lg">
                        다른 운세 보기
                      </Button>
                    </>
                  ) : (
                    <Card className="p-8 mb-6">
                      <p className="text-zinc-500 dark:text-zinc-400">
                        운세를 불러오는 중...
                      </p>
                    </Card>
                  )}
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                    버튼을 클릭하면 새로운 운세를 확인할 수 있습니다
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
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
