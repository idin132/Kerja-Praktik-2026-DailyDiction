"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  PlusCircle, 
  Sparkles, 
  Flame, 
  Send, 
  Image as ImageIcon,
  X,
  Filter,
  CheckCircle2
} from "lucide-react";

interface PostItem {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    badge?: string;
  };
  category: string;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  isLiked?: boolean;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: "1",
    author: {
      name: "Rian Zero",
      username: "@rianzero",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      badge: "PRO GAMER"
    },
    category: "#PCBuild",
    content: "Akhirnya kelar juga rakit PC impian buat main Black Myth Wukong! Spek Ryzen 7 7800X3D + RTX 4080 Super. Ada saran cooler AIO yang adem tapi gak berisik gak guys?",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800",
    likes: 42,
    commentsCount: 15,
    timeAgo: "2 jam lalu",
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Siska Gacha",
      username: "@siska_g",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      badge: "LUCKY KING"
    },
    category: "#GachaFlex",
    content: "Pity 10 langsung dapet Karakter Bintang 5 + Lifesteal Weapon! Tabungan Primogems selamet buat banner berikutnya 😭🔥 Ada yang se-wangi ini juga hari ini?",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
    likes: 89,
    commentsCount: 31,
    timeAgo: "5 jam lalu",
    isLiked: true,
  },
  {
    id: "3",
    author: {
      name: "Budi Santoso",
      username: "@budigaming",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200"
    },
    category: "#Mabar",
    content: "Cari squad Helldivers 2 buat push mission malam ini jam 8 WIB. Syarat santai, mikrofon aktif, gak baperan kalo kena friendly fire. Drop ID PSN / Steam kalian di bawah!",
    likes: 18,
    commentsCount: 8,
    timeAgo: "8 jam lalu",
    isLiked: false,
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form New Post State
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("#Mabar");
  const [newImageUrl, setNewImageUrl] = useState("");

  const categories = ["ALL", "#Mabar", "#PCBuild", "#GachaFlex", "#KomikAnime", "#General"];

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPostItem: PostItem = {
      id: Date.now().toString(),
      author: {
        name: "Daily Diction Member",
        username: "@you",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
        badge: "NEW MEMBER"
      },
      category: newCategory,
      content: newContent,
      imageUrl: newImageUrl || undefined,
      likes: 0,
      commentsCount: 0,
      timeAgo: "Baru saja",
      isLiked: false,
    };

    setPosts([newPostItem, ...posts]);
    setNewContent("");
    setNewImageUrl("");
    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter(
    (post) => activeCategory === "ALL" || post.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-brand-crimson selection:text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          
          {/* Header & Stats Section */}
          <div className="mb-10 rounded-2xl border border-dark-border bg-gradient-to-r from-dark-card via-[#161a2e] to-dark-card p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-brand-cyan mb-3 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>HUB DISKUSI GAMER INDONESIA</span>
                </div>
                <h1 className="text-3xl font-black font-mono tracking-tight text-text-primary sm:text-5xl">
                  KOMUNITAS DAILY DICTION
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
                  Wadah berkumpulnya para pencinta game & pop-culture. Cari teman mabar, racik PC, pamer hasil gacha, atau diskusi isu hangat.
                </p>
              </div>

              {/* Action & Stats Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-6 border border-dark-border bg-dark-bg/60 px-5 py-3 rounded-xl backdrop-blur-md font-mono text-center">
                  <div>
                    <span className="block text-lg font-black text-brand-crimson">1,250+</span>
                    <span className="text-[10px] text-text-muted uppercase">Online Discord</span>
                  </div>
                  <div className="h-8 w-px bg-dark-border" />
                  <div>
                    <span className="block text-lg font-black text-brand-cyan">5.8k</span>
                    <span className="text-[10px] text-text-muted uppercase">Members</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,62,62,0.4)] transition-all hover:bg-brand-crimson/90 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Buat Postingan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Feed Section (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
                <span className="flex items-center gap-1 text-text-muted mr-2">
                  <Filter className="h-3.5 w-3.5 text-brand-crimson" />
                  <span>TOPIK:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-lg px-4 py-2 font-bold transition-all ${
                      activeCategory === cat
                        ? "bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,62,62,0.4)]"
                        : "border border-dark-border bg-dark-card text-text-muted hover:border-brand-cyan hover:text-text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feed Post Cards */}
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-xl border border-dark-border bg-dark-card p-5 sm:p-6 shadow-md transition-all hover:border-dark-border/80"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-10 w-10 rounded-full object-cover border border-dark-border"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-text-primary">{post.author.name}</span>
                              {post.author.badge && (
                                <span className="rounded bg-brand-cyan/20 border border-brand-cyan/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-brand-cyan">
                                  {post.author.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-text-muted">{post.author.username} • {post.timeAgo}</span>
                          </div>
                        </div>

                        <span className="rounded-md border border-brand-crimson/40 bg-brand-crimson/10 px-2.5 py-1 text-[11px] font-mono font-bold text-brand-crimson">
                          {post.category}
                        </span>
                      </div>

                      {/* Post Content */}
                      <p className="text-xs sm:text-sm text-text-primary leading-relaxed whitespace-pre-line mb-4">
                        {post.content}
                      </p>

                      {/* Optional Image Attachment */}
                      {post.imageUrl && (
                        <div className="overflow-hidden rounded-xl border border-dark-border mb-4 max-h-96">
                          <img
                            src={post.imageUrl}
                            alt="Attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Post Actions Footer */}
                      <div className="flex items-center justify-between border-t border-dark-border/40 pt-4 font-mono text-xs text-text-muted">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1.5 transition-colors ${
                              post.isLiked ? "text-brand-crimson font-bold" : "hover:text-text-primary"
                            }`}
                          >
                            <ThumbsUp className={`h-4 w-4 ${post.isLiked ? "fill-brand-crimson" : ""}`} />
                            <span>{post.likes} Suka</span>
                          </button>

                          <button className="flex items-center gap-1.5 hover:text-text-primary transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.commentsCount} Komentar</span>
                          </button>
                        </div>

                        <button className="hover:text-brand-cyan transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar Community Tools (4 Columns) */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Rules & Guidelines */}
              <div className="rounded-xl border border-dark-border bg-dark-card p-5 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-text-primary border-b border-dark-border pb-3 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                  <span>ATURAN KOMUNITAS</span>
                </div>
                <ul className="space-y-2.5 text-xs text-text-muted leading-relaxed list-disc list-inside">
                  <li>Saling menghormati sesama member, DILARANG SARA / Toxicity berlebihan.</li>
                  <li>Gunakan tag topik yang sesuai saat membuat thread baru.</li>
                  <li>Dilarang melakukan jualan / SPAM tanpa izin moderator.</li>
                </ul>
              </div>

              {/* Trending Topic Widget */}
              <div className="rounded-xl border border-dark-border bg-dark-card p-5 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-text-primary border-b border-dark-border pb-3 mb-4">
                  <Flame className="h-4 w-4 text-brand-crimson" />
                  <span>TOPIK HANGAT HARI INI</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-primary">#BlackMythWukong</span>
                    <span className="text-[10px] text-text-muted">142 Threads</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-primary">#GenshinImpactUpdate</span>
                    <span className="text-[10px] text-text-muted">98 Threads</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-primary">#Helldivers2Mabar</span>
                    <span className="text-[10px] text-text-muted">65 Threads</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        </main>
      </div>

      {/* MODAL / POP-UP FORM BUAT THREAD BARU */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-4">
                <h3 className="font-mono font-bold text-base text-text-primary uppercase flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-brand-crimson" />
                  <span>Buat Thread Baru</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-text-muted hover:bg-dark-bg hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase mb-1.5">
                    Pilih Topik Diskusi
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5 text-xs font-mono text-text-primary focus:border-brand-crimson focus:outline-none"
                  >
                    {categories.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase mb-1.5">
                    Isi Diskusi / Pesan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Tulis pendapatmu, pamer screenshot, atau ajak mabar di sini..."
                    className="w-full rounded-lg border border-dark-border bg-dark-bg p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase mb-1.5">
                    URL Gambar (Opsional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-xxx"
                      className="w-full rounded-lg border border-dark-border bg-dark-bg pl-10 pr-3 py-2 text-xs text-text-primary focus:border-brand-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-dark-border px-4 py-2 font-mono text-xs font-bold text-text-muted hover:text-text-primary"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-crimson px-5 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-brand-crimson/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}