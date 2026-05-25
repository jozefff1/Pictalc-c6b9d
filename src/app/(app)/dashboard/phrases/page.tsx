'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUserSentences } from '@/hooks/useUserSentences';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES } from '@/lib/data/icons';
import { useIconRegistry } from '@/hooks/useIconRegistry';
import { useAppDispatch } from '@/store/hooks';
import { clearSentence, addIconToSentence } from '@/store/slices/communicationSlice';
import type { Icon, IconCategory } from '@/types/models';
import type { UserSentence } from '@/types/models';

// ── Icon picker — uses CATEGORIES + getIconsByCategory like the rest of the app ─

function IconPicker({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const { t, tIcon } = useLanguage();
  const { getByCategory, search: registrySearch, getById } = useIconRegistry();
  const [activeCategory, setActiveCategory] = useState<IconCategory>('needs');
  const [search, setSearch] = useState('');

  const icons: Icon[] = search.trim()
    ? registrySearch(search.trim())
    : getByCategory(activeCategory);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800">
        <input
          type="text"
          placeholder="Search icons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category tabs — same pattern as CategorySelector */}
      {!search && (
        <div className="flex overflow-x-auto gap-2 p-2 border-b border-gray-100 dark:border-gray-800">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center min-w-16 px-3 py-2 rounded-lg transition-all shrink-0 text-xs font-medium ${
                  isSelected
                    ? 'text-white shadow-sm scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                style={isSelected ? { backgroundColor: cat.color } : undefined}
              >
                <span className="text-xl mb-0.5">{cat.icon}</span>
                <span>{t(`category.${cat.id}`)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Icon grid — same image rendering as IconGrid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 max-h-56 overflow-y-auto">
        {icons.map((icon) => {
          const isSelected = selected.includes(icon.id);
          const label = tIcon(icon.id) !== icon.id ? tIcon(icon.id) : icon.name;
          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => toggle(icon.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 scale-105 shadow-sm'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {icon.imageUrl ? (
                <Image src={icon.imageUrl} alt={label} width={40} height={40} className="rounded" unoptimized />
              ) : (
                <span className="text-3xl">{icon.symbol}</span>
              )}
              <span className="text-[10px] leading-tight text-center text-gray-600 dark:text-gray-400 line-clamp-1">{label}</span>
            </button>
          );
        })}
        {icons.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-400 py-4">No icons found</p>
        )}
      </div>

      {/* Selected strip */}
      {selected.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 bg-primary/5 flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const icon = getById(id);
            const label = icon ? (tIcon(id) !== id ? tIcon(id) : icon.name) : id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                title={`Remove ${label}`}
                className="flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/30 rounded-lg text-xs font-medium text-primary hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                {icon?.imageUrl
                  ? <Image src={icon.imageUrl} alt={label} width={16} height={16} unoptimized />
                  : <span>{icon?.symbol}</span>}
                {label} ×
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Phrase form ───────────────────────────────────────────────────────────────

function PhraseForm({
  initial,
  onSave,
  onCancel,
  language,
}: {
  initial?: Partial<UserSentence>;
  onSave: (text: string, iconIds: string[], category: string) => Promise<void>;
  onCancel: () => void;
  language: string;
}) {
  const { t } = useLanguage();
  const [text, setText] = useState(initial?.text ?? '');
  const [iconIds, setIconIds] = useState<string[]>(initial?.iconIds ?? []);
  const [category, setCategory] = useState(initial?.category ?? 'needs');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setError('Phrase text is required'); return; }
    if (iconIds.length === 0) { setError('Select at least one icon'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(text.trim(), iconIds, category);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Phrase text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="e.g. I want to go outside"
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Category — uses CATEGORIES array, same as CategorySelector */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-colors ${
                category === cat.id
                  ? 'text-white border-transparent'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
              style={category === cat.id ? { backgroundColor: cat.color } : undefined}
            >
              {cat.icon} {t(`category.${cat.id}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Select icons for this phrase</label>
        <IconPicker selected={iconIds} onChange={setIconIds} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
          {saving ? 'Saving…' : initial?.id ? 'Save changes' : 'Add phrase'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PhrasesPage() {
  const { data: session } = useSession();
  const { language, tIcon, t } = useLanguage();
  const { getById: getAnyIconById } = useIconRegistry();
  const userId = session?.user?.id;
  const { sentences, loading, addSentence, updateSentence, deleteSentence } = useUserSentences(userId);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserSentence | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleUse = (s: UserSentence) => {
    const icons = s.iconIds.map((id) => getAnyIconById(id)).filter(Boolean) as Icon[];
    dispatch(clearSentence());
    icons.forEach((icon) => dispatch(addIconToSentence(icon)));
    router.push('/communicate');
  };

  const handleAdd = async (text: string, iconIds: string[], category: string) => {
    await addSentence(text, iconIds, category, language);
    setShowForm(false);
  };

  const handleUpdate = async (text: string, iconIds: string[], category: string) => {
    if (!editing) return;
    await updateSentence(editing.id, { text, iconIds, category });
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSentence(id);
    setConfirmDelete(null);
  };

  const getCategoryMeta = (catId: string) => CATEGORIES.find((c) => c.id === catId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Phrases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Create custom phrases that appear in the communication board's sentence browser.
          </p>
        </div>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90"
          >
            <span>+</span> Add phrase
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-base font-bold mb-4 text-gray-900 dark:text-white">New phrase</h2>
          <PhraseForm onSave={handleAdd} onCancel={() => setShowForm(false)} language={language} />
        </div>
      )}

      {/* Phrase list */}
      {loading ? (
        <div className="py-10 text-center text-gray-400 text-sm">Loading phrases…</div>
      ) : sentences.length === 0 && !showForm ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No custom phrases yet.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-primary text-sm font-semibold hover:underline">
            Add your first phrase →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sentences.map((s) => {
            const cat = getCategoryMeta(s.category);
            return (
              <div key={s.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {editing?.id === s.id ? (
                  <div className="p-5">
                    <h2 className="text-base font-bold mb-4 text-gray-900 dark:text-white">Edit phrase</h2>
                    <PhraseForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} language={language} />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon previews — real ARASAAC images */}
                    <div className="flex gap-1.5 shrink-0">
                      {s.iconIds.slice(0, 5).map((id) => {
                        const icon = getAnyIconById(id);
                        const label = icon ? (tIcon(id) !== id ? tIcon(id) : icon.name) : id;
                        return icon?.imageUrl ? (
                          <Image key={id} src={icon.imageUrl} alt={label} width={36} height={36} className="rounded" unoptimized />
                        ) : (
                          <span key={id} className="text-2xl" title={label}>{icon?.symbol ?? '❓'}</span>
                        );
                      })}
                      {s.iconIds.length > 5 && <span className="text-xs text-gray-400 self-center">+{s.iconIds.length - 5}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{s.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        {cat && <span style={{ color: cat.color }}>{cat.icon} {t(`category.${cat.id}`)}</span>}
                        {!s.synced && <span className="ml-2 text-amber-400">● offline</span>}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleUse(s)}
                        className="p-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"
                        title="Load into communicate"
                      >
                        ▶
                      </button>
                      <button
                        onClick={() => { setEditing(s); setShowForm(false); }}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-primary transition-colors text-sm"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      {confirmDelete === s.id ? (
                        <div className="flex gap-1 items-center">
                          <button onClick={() => handleDelete(s.id)} className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold">Delete</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded-lg text-xs border border-gray-300 dark:border-gray-600">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(s.id)}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors text-sm"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
