"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/admin/DashboardShell";
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
  Columns,
  Tag,
  Layers,
  BookOpen,
  X,
  FileCode
} from "lucide-react";

interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  cover_image?: string;
  tags?: string[];
}

export default function CMSPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"list" | "editor">("list");
  
  // Notification banner
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Next.js", "Supabase"]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
    } catch (err: any) {
      console.error("Erro ao carregar publicações:", err);
      showToast("Erro de sincronização de banco com o Supabase", "error");
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

  // Handle adding tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle adding new post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      showToast("Título, slug e conteúdo são obrigatórios", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("cms_posts").insert([
        {
          title,
          slug,
          excerpt,
          content,
          published,
          cover_image: coverImage,
          tags,
        },
      ]);

      if (error) throw error;

      showToast("Artigo técnico indexado com sucesso no Supabase!");
      
      // Reset form fields
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setPublished(false);
      setTags(["Next.js", "Supabase"]);

      // Refresh list and change tab
      fetchPosts();
      setActiveTab("list");
    } catch (err: any) {
      console.error("Erro ao inserir publicação:", err);
      showToast(`Falha técnica no insert: ${err.message || err}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick toggle publish/draft status
  const handleToggleStatus = async (id: string, currentPublished: boolean) => {
    const newPublished = !currentPublished;
    try {
      const { error } = await supabase
        .from("cms_posts")
        .update({ published: newPublished })
        .eq("id", id);

      if (error) throw error;

      showToast(`Artigo ${newPublished ? "publicado" : "recolhido"} com sucesso!`);
      
      // Update local state
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, published: newPublished } : post))
      );
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err);
      showToast("Erro ao persistir alteração no Supabase", "error");
    }
  };

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm("Confirmar a exclusão definitiva deste artigo tático?")) return;

    try {
      const { error } = await supabase.from("cms_posts").delete().eq("id", id);
      if (error) throw error;

      showToast("Artigo excluído e desindexado com sucesso!");
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Erro ao deletar postagem:", err);
      showToast("Erro ao deletar registro", "error");
    }
  };

  // Simple Markdown Parser with regex to prevent bulky build bundle issues
  const renderMarkdownPreview = (mdText: string) => {
    if (!mdText) return <p className="text-text-muted italic text-xs">[Aguardando inserção de dados em Markdown...]</p>;
    
    const lines = mdText.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-xl font-bold font-display text-text-primary border-b border-border/40 pb-1 mt-4 mb-2">{line.replace("# ", "")}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-lg font-bold font-display text-text-primary mt-3 mb-2">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-bold font-display text-primary uppercase mt-3 mb-1">{line.replace("### ", "")}</h3>;
      }
      // Bullet lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={idx} className="text-xs text-text-secondary font-display list-disc ml-4 mb-1">{line.substring(2)}</li>;
      }
      // Code blocks
      if (line.startsWith("`") && line.endsWith("`") && line.length > 2) {
        return <code key={idx} className="block bg-black border border-border/40 font-mono text-[10px] text-primary p-2 my-2 overflow-x-auto">{line.replace(/`/g, "")}</code>;
      }
      // Blockquotes
      if (line.startsWith("> ")) {
        return <blockquote key={idx} className="border-l-2 border-primary pl-3 my-2 text-text-muted text-xs italic font-display">{line.substring(2)}</blockquote>;
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }
      // Default text
      return <p key={idx} className="text-xs text-text-secondary font-display leading-relaxed mb-1">{line}</p>;
    });
  };

  // Filter posts by search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        
        {/* Dynamic Toast Alert Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 border font-technical text-xs font-bold tracking-wider flex items-center justify-between gap-4 animate-slide-in duration-100 ${
            toast.type === "success" 
              ? "bg-black border-status-success text-status-success shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
              : "bg-black border-primary text-primary shadow-[0_0_15px_rgba(255,11,11,0.15)]"
          }`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-status-success animate-ping" : "bg-primary animate-ping"}`} />
              {toast.message.toUpperCase()}
            </span>
          </div>
        )}

        {/* Module Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex flex-col">
            <h2 className="font-technical text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-primary animate-pulse" /> PAINEL CENTRAL DE CMS
            </h2>
            <p className="font-technical text-xs text-text-muted mt-1">
              Fase 4: Gestão de autoridade técnica e redação de engenharia com editor Split-Screen em tempo real.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === "list" ? "editor" : "list")}
              className={`px-3 py-1.5 font-technical text-xs font-bold border transition-all flex items-center gap-1.5 ${
                activeTab === "editor"
                  ? "bg-primary border-primary text-text-primary hover:bg-primary-hover"
                  : "bg-transparent border-border hover:bg-surface-hover text-text-secondary"
              }`}
            >
              {activeTab === "list" ? (
                <>
                  <Plus size={13} /> ESCREVER ARTIGO TÁTICO
                </>
              ) : (
                <>
                  <BookOpen size={13} /> VOLTAR AO REGISTRO
                </>
              )}
            </button>
            <button
              onClick={fetchPosts}
              className="px-3 py-1.5 font-technical text-xs font-bold border border-border hover:bg-surface-hover text-text-secondary transition-colors"
            >
              SINCRONIZAR CONTEÚDOS
            </button>
          </div>
        </div>

        {/* Technical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">ARTIGOS INDEXADOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-text-primary">{posts.length}</span>
              <span className="font-technical text-[9px] font-bold text-primary">CONEXÃO ATIVA</span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">ARTIGOS PUBLICADOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-success">{posts.filter(p => p.published).length}</span>
              <span className="font-technical text-[9px] font-bold text-status-success flex items-center gap-1">
                <Eye size={11} /> CONTEÚDO PÚBLICO
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border p-4 flex flex-col justify-between">
            <span className="font-technical text-[10px] font-bold text-text-muted tracking-widest">RASCUNHOS SALVOS</span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="font-technical text-2xl font-bold text-status-warning">{posts.filter(p => !p.published).length}</span>
              <span className="font-technical text-[9px] font-bold text-status-warning flex items-center gap-1">
                <EyeOff size={11} /> RASCUNHO OFFLINE
              </span>
            </div>
          </div>
        </div>

        {activeTab === "list" ? (
          /* Database Posts Registry Table View */
          <div className="bg-surface border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-3">
              <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> ARQUIVO DE ENGENHARIA DE CONTEÚDO
              </span>
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
                <span className="font-technical text-xs text-text-muted tracking-wider">CONECTANDO AO CONTEÚDO DO CMS...</span>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-black/20">
                <span className="font-technical text-xs text-text-muted">Nenhuma postagem ou rascunho de artigo cadastrado.</span>
                <button 
                  onClick={() => setActiveTab("editor")}
                  className="font-technical text-[10px] text-primary hover:underline mt-1"
                >
                  Escreva o seu primeiro artigo em Markdown agora.
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-technical text-[9px] font-bold tracking-widest bg-black/40">
                      <th className="py-2.5 px-3">DATA VAL</th>
                      <th className="py-2.5 px-3">ARTIGO TÁTICO / RESUMO</th>
                      <th className="py-2.5 px-3">SLUG DA URL</th>
                      <th className="py-2.5 px-3">TAGS TECNOLÓGICAS</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
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
                            <span className="text-[10px] text-text-muted mt-0.5 line-clamp-2">{post.excerpt || "Sem resumo definido."}</span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-text-secondary text-[11px] leading-none bg-surface border border-border/40 px-2 py-0.5 font-bold">
                            /{post.slug}
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {post.tags && post.tags.length > 0 ? (
                              post.tags.map((tag, idx) => (
                                <span key={idx} className="bg-black/40 text-[9px] text-primary border border-primary/20 px-1.5 py-0.5 font-bold">
                                  {tag.toUpperCase()}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] text-text-muted font-bold">S/ TAG</span>
                            )}
                          </div>
                        </td>

                        {/* Published Status Toggle Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(post.id, post.published)}
                            className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest transition-all duration-100 uppercase ${
                              post.published
                                ? "border-status-success/30 text-status-success bg-status-success/5 hover:border-status-success/60"
                                : "border-status-warning/30 text-status-warning bg-status-warning/5 hover:border-status-warning/60"
                            }`}
                          >
                            {post.published ? "PUBLICADO" : "RASCUNHO"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 text-text-muted hover:text-status-danger transition-all border border-transparent duration-100"
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
        ) : (
          /* Dark Code Editor Interface - Markdown Split-Screen */
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-border bg-surface">
            
            {/* Left Side: Text Editor Input */}
            <div className="border-r border-border p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <span className="font-technical text-xs font-bold text-text-primary tracking-widest flex items-center gap-1.5">
                  <FileCode size={14} className="text-primary" /> EDITOR TÁTICO MARKDOWN
                </span>
                <span className="font-technical text-[9px] text-primary font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 border border-primary/20">
                  <Sparkles size={10} /> SINTAXE JETBRAINS MONO
                </span>
              </div>

              <form onSubmit={handleAddPost} className="flex flex-col gap-3.5">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">TÍTULO DO ARTIGO *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Como Otimizar Deploys no Supabase Realtime"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>

                {/* Slug & Image Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">SLUG DA URL (GERADO)</label>
                    <input
                      type="text"
                      required
                      readOnly
                      placeholder="como-otimizar-deploys-no-supabase-realtime"
                      value={slug}
                      className="bg-black/50 border border-border/30 px-3 py-2 text-xs font-technical text-text-muted focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">IMAGEM DE CAPA (LINK)</label>
                    <input
                      type="text"
                      placeholder="Link da imagem..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">RESUMO DA PUBLICAÇÃO (EXCERPT) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Descrição para SEO e indexações de busca..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                  />
                </div>

                {/* Status & Tag Sync */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">STATUS INICIAL</label>
                    <select
                      value={published ? "published" : "draft"}
                      onChange={(e) => setPublished(e.target.value === "published")}
                      className="bg-black border border-border px-2.5 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    >
                      <option value="draft">RASCUNHO (INTERNO)</option>
                      <option value="published">PUBLICADO (PORTFÓLIO)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">TAGS TECNOLÓGICAS (ENTER)</label>
                    <input
                      type="text"
                      placeholder="Digite e tecle Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="bg-black border border-border px-3 py-2 text-xs font-technical text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                </div>

                {/* Active Tags Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 border border-border/30 bg-black/20 p-2.5">
                    {tags.map((tag) => (
                      <span key={tag} className="bg-black text-[9px] text-primary border border-primary/20 px-2 py-0.5 font-bold flex items-center gap-1.5 uppercase">
                        <Tag size={8} /> {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="text-text-muted hover:text-primary transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Textarea Code Area */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-technical text-[10px] font-bold text-text-secondary tracking-wider">CORPO DO ARTIGO EM MARKDOWN *</label>
                  <textarea
                    required
                    placeholder="# Título Principal&#10;&#10;Escreva o artigo técnico em markdown usando sintaxe tática...&#10;&#10;## Seção Técnica&#10;- Bullet técnico 01&#10;- Bullet técnico 02&#10;&#10;`DADO_DE_CONEXÃO_DO_SISTEMA`"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-black border border-border p-3 text-xs font-mono text-text-primary resize-none h-72 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 leading-relaxed scrollbar-thin scrollbar-thumb-border"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("list")}
                    className="bg-transparent border border-border hover:bg-surface-hover text-text-secondary font-technical text-xs font-bold py-2.5 transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary-hover text-text-primary border border-primary font-technical text-xs font-bold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> SALVANDO...
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> INDEXAR CONTEÚDO
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side: Markdown Render Preview */}
            <div className="p-5 flex flex-col gap-4 bg-black/40 overflow-y-auto max-h-[720px] scrollbar-thin scrollbar-thumb-border">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5 text-text-muted">
                <span className="font-technical text-xs font-bold tracking-widest flex items-center gap-1.5">
                  <Columns size={14} className="text-status-success animate-pulse" /> PRE-VISUALIZAÇÃO EM TEMPO REAL
                </span>
                <span className="font-technical text-[9px] font-bold">TIPOGRAFIA DO PORTFÓLIO</span>
              </div>

              {/* Cover image preview if provided */}
              {coverImage && (
                <div className="relative h-28 w-full border border-border/30 overflow-hidden mb-1">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover opacity-60 filter grayscale hover:grayscale-0 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <span className="absolute bottom-2 left-2 font-technical text-[9px] font-bold text-text-secondary leading-none bg-black/80 px-2 py-0.5 border border-border/40">
                    IMAGEM DA CAPA
                  </span>
                </div>
              )}

              {/* Title preview */}
              {title ? (
                <h1 className="text-xl font-bold font-display text-text-primary leading-tight mt-1">{title}</h1>
              ) : (
                <h1 className="text-xl font-bold font-display text-text-muted italic">[Sem título tático definido]</h1>
              )}
              
              {/* Excerpt preview */}
              {excerpt && (
                <p className="text-xs text-text-secondary italic font-display border-b border-border/20 pb-3 leading-normal">{excerpt}</p>
              )}

              {/* Markdown Content Area Preview */}
              <div className="flex flex-col gap-2 mt-1">
                {renderMarkdownPreview(content)}
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardShell>
  );
}
