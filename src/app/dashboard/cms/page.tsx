"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { supabase } from "@/lib/supabase";
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Loader2, 
  Trash2, 
  Sparkles, 
  Clock 
} from "lucide-react";

interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: string;
}

export default function CMSPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  // Fetch real CMS posts from Supabase on mount
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cms_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Reactively generate slug as you type the title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_-]+/g, "-") // Replace spaces with dashes
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
    setSlug(generatedSlug);
  };

  // Handle adding new post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("cms_posts").insert([
        {
          title,
          slug,
          summary,
          content,
          status,
        },
      ]);

      if (error) throw error;

      // Reset form fields
      setTitle("");
      setSlug("");
      setSummary("");
      setContent("");
      setStatus("draft");

      // Refresh list
      fetchPosts();
    } catch (err) {
      console.error("Error inserting post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick toggle publish/draft status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from("cms_posts")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, status: newStatus } : post))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm("Confirmar a exclusão definitiva deste artigo?")) return;

    try {
      const { error } = await supabase.from("cms_posts").delete().eq("id", id);
      if (error) throw error;

      // Update local state
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Calculate metrics
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  // Filter posts by search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Module Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-primary animate-pulse" /> CMS_MANAGER_CORE
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Painel de criação de postagens em Markdown para o portfólio e blog institucional da agência.
            </p>
          </div>
          <button
            onClick={fetchPosts}
            className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors"
          >
            SYNC_CMS_STREAM
          </button>
        </div>

        {/* Technical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">TOTAL_ARTICLES_INDEXED</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{totalPosts}</span>
              <span className="font-technical text-[9px] font-bold text-primary">DB_SYNC_OK</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">PUBLISHED_POSTS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">{publishedCount}</span>
              <span className="font-technical text-[9px] font-bold text-status-success flex items-center gap-1">
                <Eye size={11} /> LIVE_ONLINE
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">DRAFT_POSTS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-warning">{draftCount}</span>
              <span className="font-technical text-[9px] font-bold text-status-warning flex items-center gap-1">
                <EyeOff size={11} /> OFFLINE_DRAFT
              </span>
            </div>
          </div>
        </div>

        {/* Input Form and Data Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Create New Post Form */}
          <div className="bg-surface border border-border p-5">
            <h3 className="font-technical text-xs font-bold text-text-primary tracking-widest border-b border-border pb-3 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-primary" /> WRITE_NEW_POST_MD
            </h3>
            <form onSubmit={handleAddPost} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">ARTICLE_TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Como otimizar landing pages industriais"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">URL_SLUG (AUTO)</label>
                  <span className="text-[9px] text-primary font-technical font-bold flex items-center gap-0.5">
                    <Sparkles size={10} /> ENGINE_ACTIVE
                  </span>
                </div>
                <input
                  type="text"
                  required
                  readOnly
                  placeholder="como-otimizar-landing-pages-industriais"
                  value={slug}
                  className="bg-black/60 border border-border/40 px-3 py-2 text-xs font-technical text-text-muted focus:outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">SUMMARY_META *</label>
                <input
                  type="text"
                  required
                  placeholder="Breve resumo atraente para listagens de posts..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">PUBLICATION_STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  >
                    <option value="draft">DRAFT (Rascunho Privado)</option>
                    <option value="published">PUBLISHED (Artigo Público)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">MARKDOWN_BODY *</label>
                <textarea
                  required
                  placeholder="# Título do Artigo&#10;&#10;Escreva o seu corpo textual em Markdown com suporte nativo a tags..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary resize-none h-40 focus:outline-none focus:border-border-focus"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-text-primary font-technical text-xs font-bold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> INDEXING...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> INDEX_NEW_POST
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database Posts Registry Table */}
          <div className="lg:col-span-2 bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest">POSTS_QUERY_RECORDS</span>
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar por título ou slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border border-border pl-9 pr-3 py-1.5 text-xs font-technical text-text-primary w-full sm:w-56 focus:outline-none focus:border-border-focus"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <Loader2 size={24} className="text-primary animate-spin" />
                <span className="font-technical text-xs text-text-muted tracking-wider">CONNECTING_CMS_STREAM...</span>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhuma postagem ou rascunho de artigo cadastrado.</span>
                <span className="font-technical text-[10px] text-primary">Escreva o seu primeiro artigo em Markdown ao lado.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">VAL_DATE</th>
                      <th className="py-2.5 px-3">POST_TITLE</th>
                      <th className="py-2.5 px-3">SLUG</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="font-technical text-xs">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="border-b border-border hover:bg-black/20 transition-colors duration-100">
                        {/* Created At */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-text-muted font-bold text-[11px]">
                            {new Date(post.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col max-w-xs sm:max-w-sm">
                            <span className="font-bold text-text-primary line-clamp-1">{post.title}</span>
                            <span className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{post.summary}</span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-text-secondary text-[11px] leading-none bg-surface border border-border/40 px-2 py-0.5 font-bold">
                            /{post.slug}
                          </span>
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleStatus(post.id, post.status)}
                            className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest transition-all duration-100 uppercase ${
                              post.status === "published"
                                ? "border-status-success/30 text-status-success bg-status-success/5 hover:border-status-success/60"
                                : "border-status-warning/30 text-status-warning bg-status-warning/5 hover:border-status-warning/60"
                            }`}
                          >
                            {post.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 text-text-muted hover:text-status-danger hover:border-status-danger/20 transition-all border border-transparent duration-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
