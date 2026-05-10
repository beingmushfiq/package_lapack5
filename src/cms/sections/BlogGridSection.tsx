import React from 'react';
import { useBlogs } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { mergeStyles } from '../StyleEngine';
import { getImageUrl } from '../../lib/utils';

export default function BlogGridSection({ section }: CMSSectionProps) {
  const { data: posts, isLoading } = useBlogs();
  const config = section.components || {};
  const limit = config.limit || 3;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const displayPosts = posts?.slice(0, limit) || [];
  const { className, style } = mergeStyles('py-12', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      {section.title && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
          <Link to="/blogs" className="text-emerald-600 font-semibold hover:underline">
            View All Posts
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPosts.map((post: any) => (
          <article 
            key={post.id}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2"
          >
            <Link to={`/blogs/${post.slug}`} className="block relative aspect-video overflow-hidden">
              <img 
                src={getImageUrl(post.image)} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category?.name || 'News'}
                </span>
              </div>
            </Link>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author || 'Admin'}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
              </h3>
              
              <p className="text-gray-600 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              
              <Link 
                to={`/blogs/${post.slug}`}
                className="inline-flex items-center text-emerald-600 font-bold hover:gap-2 transition-all"
              >
                Read More
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
