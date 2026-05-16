'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface CustomIcon {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export function CustomIconUpload() {
  const [icons, setIcons] = useState<CustomIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('needs');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Per-card state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchIcons();
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const fetchIcons = async () => {
    try {
      const res = await fetch('/api/icons');
      if (res.ok) {
        const data = await res.json();
        setIcons(data.icons || []);
      }
    } catch (err) {
      console.error('Failed to fetch icons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!name) {
        const filename = file.name.split('.')[0].replace(/[-_]/g, ' ');
        setName(filename.toLowerCase());
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !name || !category) {
      setError('Please provide an image, a name, and select a category.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', name);
    formData.append('category', category);

    try {
      const res = await fetch('/api/icons', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      const { icon } = await res.json();
      setIcons(prev => [icon, ...prev]);
      setName('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess('Icon uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/icons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIcons(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleRenameStart = (icon: CustomIcon) => {
    setRenamingId(icon.id);
    setRenameValue(icon.name);
    setRenameError('');
  };

  const handleRenameSubmit = async (id: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) { setRenameError('Name cannot be empty'); return; }
    try {
      const res = await fetch(`/api/icons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        setIcons(prev => prev.map(i => i.id === id ? { ...i, name: trimmed.toLowerCase() } : i));
        setRenamingId(null);
      } else {
        setRenameError('Rename failed');
      }
    } catch {
      setRenameError('Rename failed');
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleRenameSubmit(id);
    if (e.key === 'Escape') setRenamingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Upload Custom Icon</h2>
        <form onSubmit={handleUpload} className="space-y-4 max-w-md">
          {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">{success}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Icon Name (Word to match)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g. apple"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="needs">Needs (I want, I need)</option>
              <option value="actions">Actions (Verbs)</option>
              <option value="feelings">Feelings (Emotions)</option>
              <option value="people">People</option>
              <option value="places">Places</option>
              <option value="custom">Custom (Other)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20
                dark:file:bg-gray-700 dark:file:text-gray-200"
              required
            />
          </div>

          {previewUrl && (
            <div className="mt-4 p-4 border rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
              <span className="text-xs text-gray-500 mb-2">Preview</span>
              <div className="w-24 h-24 relative rounded-xl overflow-hidden shadow-sm bg-white">
                <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
              </div>
              <span className="mt-2 font-medium capitalize">{name || 'Name'}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Icon'}
          </button>
        </form>
      </div>

      {/* Icon grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          Your Custom Icons
          {icons.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({icons.length})</span>
          )}
        </h2>

        {loading ? (
          <div className="text-gray-500">Loading icons...</div>
        ) : icons.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            You haven&apos;t uploaded any custom icons yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {icons.map(icon => (
              <div
                key={icon.id}
                className="relative border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col items-center bg-white dark:bg-gray-800 hover:shadow-md transition-shadow group"
              >
                {/* Delete button — visible on hover */}
                {confirmDeleteId === icon.id ? (
                  <div className="absolute inset-0 rounded-xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-2 z-10 p-2">
                    <p className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium">Delete this icon?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteConfirm(icon.id)}
                        disabled={deletingId === icon.id}
                        className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {deletingId === icon.id ? '…' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(icon.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/70"
                    aria-label={`Delete ${icon.name}`}
                    title="Delete icon"
                  >
                    ×
                  </button>
                )}

                {/* Image */}
                <div className="relative w-16 h-16 mb-2">
                  <Image src={icon.imageUrl} alt={icon.name} fill className="object-contain" />
                </div>

                {/* Name — click to rename */}
                {renamingId === icon.id ? (
                  <div className="w-full">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, icon.id)}
                      onBlur={() => handleRenameSubmit(icon.id)}
                      className="w-full text-xs text-center border border-primary rounded px-1 py-0.5 bg-white dark:bg-gray-700 outline-none"
                      maxLength={100}
                    />
                    {renameError && (
                      <p className="text-red-500 text-[10px] text-center mt-0.5">{renameError}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleRenameStart(icon)}
                    className="font-medium text-sm truncate w-full text-center capitalize hover:text-primary transition-colors"
                    title="Click to rename"
                  >
                    {icon.name}
                  </button>
                )}

                <span className="text-xs text-gray-400 mt-1">{icon.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

