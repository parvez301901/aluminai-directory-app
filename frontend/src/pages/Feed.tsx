import React, { useEffect, useState } from 'react';

interface Post {
  _id: string;
  userId: string;
  content: string;
  reactions: { userId: string; type: string }[];
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  async function fetchPosts() {
    setLoading(true);
    const token = window.localStorage.getItem('clerkToken') || '';
    const res = await fetch('/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  async function submitPost() {
    if (!newPost.trim()) return;
    const token = window.localStorage.getItem('clerkToken') || '';
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: newPost }),
    });
    if (res.ok) {
      setNewPost('');
      fetchPosts();
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Social Feed</h2>
      <div className="mb-4 flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Share an update..."
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={submitPost}>Post</button>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded shadow p-4">
              <div className="text-gray-700 mb-2">{post.content}</div>
              <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
              <div className="flex gap-2 mt-2">
                {['like', 'celebrate', 'support'].map(type => {
                  const count = post.reactions.filter(r => r.type === type).length;
                  const myReaction = post.reactions.find(r => r.type === type && r.userId === (window.localStorage.getItem('clerkUserId') || ''));
                  return (
                    <button
                      key={type}
                      className={`px-2 py-1 rounded border ${myReaction ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'}`}
                      onClick={async () => {
                        const token = window.localStorage.getItem('clerkToken') || '';
                        await fetch(`/api/posts/${post._id}/reactions`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ type }),
                        });
                        fetchPosts();
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
