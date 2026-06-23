import React, { useState } from "react";
import { BLOG_POSTS, SEO_KEYWORDS } from "../data";
import { BlogPost } from "../types";
import { BookOpen, Clock, Tag, Search, CornerDownRight, X, ArrowRight, CheckCircle } from "lucide-react";

export default function BlogHub() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(BLOG_POSTS[0]);
  const [keywordFilter, setKeywordFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post);
    // Auto scroll into reading viewport on mobile
    const el = document.getElementById("blog-reading-view");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter posts based on keyword list or search term
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesKeyword = !keywordFilter || post.seoKeywords.includes(keywordFilter);
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKeyword && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 bg-slate-50 text-slate-900 border-b border-sidebar-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full">
            Knowledge Resources
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Infinite SEO Learning Hub
          </h2>
          <p className="text-slate-600 text-sm mt-3 font-light">
            Stay ahead of the curve. Read expert articles on freelancing, social algorithms, and business automation.
          </p>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* SEO Keywords Quick-badge List */}
        <div className="mb-10 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3.5 flex items-center justify-center space-x-1">
            <Tag className="h-3 w-3 text-[#F59E0B]" />
            <span>Filter Educational Posts by Keyword tag:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
            <button
              onClick={() => setKeywordFilter(null)}
              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold cursor-pointer transition-all ${
                keywordFilter === null
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              All Keyword Domains
            </button>
            {SEO_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => setKeywordFilter(kw)}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold cursor-pointer transition-all ${
                  keywordFilter === kw
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Article List Left Column (lg:col-span-4) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Inner search query */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search learning topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-[580px] overflow-y-auto space-y-3 pr-1.5 no-scrollbar">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400">No blog items matched your chosen keyword or term.</p>
                  <button 
                    onClick={() => { setKeywordFilter(null); setSearchQuery(""); }}
                    className="text-xs text-[#2563EB] font-bold mt-2 hover:underline cursor-pointer"
                  >
                    Reset List
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = selectedPost?.id === post.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => handlePostSelect(post)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col text-left group ${
                        isSelected
                          ? "bg-gradient-to-br from-[#0F172A] to-slate-900 text-white border-transparent shadow"
                          : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-blue-900/40 text-[#2563EB]" : "bg-slate-100 text-slate-500"
                        }`}>
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h4 className={`text-sm sm:text-base font-bold tracking-tight leading-snug group-hover:text-[#F59E0B] transition-colors ${
                        isSelected ? "text-white" : "text-[#0F172A]"
                      }`}>
                        {post.title}
                      </h4>

                      <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}>
                        {post.summary}
                      </p>

                      <div className="mt-3.5 flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] group-hover:text-[#F59E0B] transition-colors">
                        <span>Read Lesson</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed Document Reading View Right Column (lg:col-span-8) */}
          <div id="blog-reading-view" className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm min-h-[500px]">
            {selectedPost ? (
              <div className="space-y-6 animate-fade-in text-left">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-amber-100 text-[#0F172A] px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>

                {/* Primary header */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  {selectedPost.title}
                </h3>

                {/* Text paragraph content */}
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 font-light whitespace-pre-line border-b border-slate-100 pb-6">
                  {selectedPost.content}
                </div>

                {/* Key Lessons Checklist Box */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5">
                  <h5 className="text-[11px] font-bold text-[#0F172A] uppercase tracking-widest flex items-center space-x-1 bg-slate-100 w-fit px-2.5 py-1 rounded">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Key Lesson takeaways:</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedPost.keyLessons.map((lesson, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CornerDownRight className="h-3.5 w-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Associated Keyword tags */}
                <div className="pt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Associated SEO tags:
                  </span>
                  {selectedPost.seoKeywords.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => setKeywordFilter(tag)}
                      className="bg-blue-50 text-[#2563EB] hover:bg-blue-100 text-[10px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
                <BookOpen className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm">Click any item on the left panel to display full curriculum insights here.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
