import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, MapPin, Send, Loader2 } from 'lucide-react';
import { Post } from '../types';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!caption.trim()) return;

    setIsSubmitting(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost: Post = {
      id: Date.now().toString(),
      username: 'you', // Mock user
      userAvatar: 'https://i.pravatar.cc/150?u=me',
      image: `https://picsum.photos/800/800?random=${Date.now()}`, // Mock image
      location: location || 'Unknown Location',
      caption: caption,
      likes: 0,
      timeAgo: 'Just now'
    };

    const savedPosts = localStorage.getItem('innroutes_posts');
    const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
    localStorage.setItem('innroutes_posts', JSON.stringify([newPost, ...posts]));

    setIsSubmitting(false);
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">New Post</h1>
        <button 
          onClick={handleSubmit}
          disabled={!caption.trim() || isSubmitting}
          className="text-brand font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isSubmitting ? 'Posting...' : 'Share'}
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Mock Image Upload */}
        <div className="w-full aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <ImageIcon size={32} className="text-brand" />
          </div>
          <span className="text-sm font-medium">Tap to select photo</span>
        </div>

        {/* Caption */}
        <div className="space-y-2">
            <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-slate-50 border-none rounded-xl p-4 text-base focus:ring-2 focus:ring-brand outline-none resize-none min-h-[120px]"
            />
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
            <MapPin size={20} className="text-slate-400" />
            <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
            />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full p-5 bg-white border-t border-slate-50">
        <button 
            onClick={handleSubmit}
            disabled={!caption.trim() || isSubmitting}
            className="w-full bg-black text-brand font-bold py-4 rounded-xl shadow-lg shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            Post to Community
        </button>
      </div>
    </div>
  );
};