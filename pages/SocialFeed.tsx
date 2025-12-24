import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';

export const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load posts from local storage or initialize with mock data
    const savedPosts = localStorage.getItem('innroutes_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const mockPosts: Post[] = [
        {
          id: '1',
          username: 'alex_travels',
          userAvatar: 'https://i.pravatar.cc/150?u=alex',
          image: 'https://picsum.photos/800/800?random=1',
          location: 'Kyoto, Japan',
          caption: 'Found this hidden gem of a shrine in Kyoto today. The silence here is magical. ⛩️ #Japan #SoloTravel',
          likes: 245,
          timeAgo: '2h ago'
        },
        {
          id: '2',
          username: 'sarah_nomad',
          userAvatar: 'https://i.pravatar.cc/150?u=sarah',
          image: 'https://picsum.photos/800/800?random=2',
          location: 'Bali, Indonesia',
          caption: 'Workspace for the day! 🌴 Digital nomad life is treating me well. Smoothie bowls + coding = ❤️',
          likes: 189,
          timeAgo: '5h ago'
        }
      ];
      setPosts(mockPosts);
      localStorage.setItem('innroutes_posts', JSON.stringify(mockPosts));
    }
  }, []);

  const handleLike = (id: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('innroutes_posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="pb-24 pt-10 min-h-screen bg-slate-50">
      <div className="px-5 mb-6 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-extrabold text-dark">Community</h1>
           <p className="text-sm text-slate-500">Stories from fellow travelers</p>
        </div>
        <div className="text-[10px] font-bold bg-brand text-black px-2 py-1 rounded uppercase tracking-wider">
            Phase 3
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border-y border-slate-100 sm:border sm:rounded-2xl sm:mx-4 sm:shadow-sm">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full border border-slate-100" />
                <div>
                  <p className="font-bold text-sm text-dark">{post.username}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={10} /> {post.location}
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Image */}
            <div className="aspect-square w-full bg-slate-100">
              <img src={post.image} alt="Post" className="w-full h-full object-cover" loading="lazy" />
            </div>

            {/* Actions */}
            <div className="p-4 pb-2 flex items-center gap-6">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-slate-700 hover:text-rose-500 transition-colors group"
              >
                <Heart size={24} className="group-hover:fill-rose-500 group-active:scale-90 transition-transform" />
              </button>
              <button className="text-slate-700 hover:text-brand transition-colors">
                <MessageCircle size={24} />
              </button>
              <button className="text-slate-700 hover:text-brand transition-colors ml-auto">
                <Share2 size={24} />
              </button>
            </div>

            {/* Likes & Caption */}
            <div className="px-4 pb-4">
              <p className="font-bold text-sm text-dark mb-2">{post.likes} likes</p>
              <p className="text-sm text-slate-800 leading-relaxed">
                <span className="font-bold mr-2">{post.username}</span>
                {post.caption}
              </p>
              <p className="text-xs text-slate-400 mt-2 uppercase tracking-wide">{post.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};