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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchIcons();
  }, []);

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
      // Auto-fill name based on filename if not set
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
      const res = await fetch('/api/icons', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { icon } = await res.json();
      setIcons(prev => [icon, ...prev]);
      
      // Reset form
      setName('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSuccess('Icon uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Upload Custom Icon</h2>
        
        <form onSubmit={handleUpload} className="space-y-4 max-w-md">
          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{success}</div>}

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
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill 
                  className="object-contain p-2"
                />
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

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Your Custom Icons</h2>
        
        {loading ? (
          <div className="text-gray-500">Loading icons...</div>
        ) : icons.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            You haven&apos;t uploaded any custom icons yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {icons.map(icon => (
              <div key={icon.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col items-center justify-center hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                <div className="relative w-16 h-16 mb-2">
                  <Image 
                    src={icon.imageUrl} 
                    alt={icon.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-sm truncate w-full text-center capitalize">{icon.name}</span>
                <span className="text-xs text-gray-400 mt-1">{icon.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
