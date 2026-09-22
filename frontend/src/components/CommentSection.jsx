import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Award, Shield } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ reportId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reports/${reportId}/comments`);
        if (res.data.success) {
          setComments(res.data.comments || []);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };
    if (reportId) {
      fetchComments();
    }
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      alert('Please log in or sign up to join the community discussion.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/reports/${reportId}/comments`, {
        comment: newComment.trim()
      });
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <span>Community Discussion &amp; Corroboration ({comments.length})</span>
        </h3>
        <span className="text-xs text-slate-400">Moderated for civility</span>
      </div>

      {/* Post comment input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              isAuthenticated
                ? 'Did you experience this pattern? Provide additional checkout details, dates, or cancellation tips...'
                : 'Log in to participate in community discussion and corroborate deceptive patterns...'
            }
            disabled={!isAuthenticated || submitting}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60 resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Earn +3 reputation points for constructive evidence corroboration.
          </p>
          <button
            type="submit"
            disabled={!isAuthenticated || submitting || !newComment.trim()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-50 transition-all shadow-glow-cyan"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {loading ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            No comments yet. Be the first consumer to corroborate or share advice on this report!
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {c.userId?.name ? c.userId.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-white">
                        {c.userId?.name || 'Anonymous Consumer'}
                      </span>
                      {c.userId?.badges && c.userId.badges.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                          {c.userId.badges[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {c.userId?.reputation || 10} reputation
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                {c.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
