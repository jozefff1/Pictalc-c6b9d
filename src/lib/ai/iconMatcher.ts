/**
 * Icon Matcher - Text to Icons AI
 * Multilingual keyword-based matching for pilot (will upgrade to ML embeddings in Phase 5)
 */
import type { Icon } from '@/types/models';
import { ICON_DATABASE, CATEGORIES } from '@/lib/data/icons';
import { KEYWORD_MAP_EN } from './keywordMappings/en';
import { KEYWORD_MAP_NO } from './keywordMappings/no';

export interface IconMatch {
  icon: Icon;
  confidence: number;
  matchType: 'exact' | 'partial' | 'related';
}

// Locale-specific keyword mappings
const KEYWORD_MAPS: Record<string, Record<string, string[]>> = {
  en: KEYWORD_MAP_EN,
  no: KEYWORD_MAP_NO,
};

/**
 * Match text to icons using keyword matching with locale support
 */
export function matchTextToIcons(
  text: string,
  maxResults = 10,
  locale: string = 'en',
  customIcons: Icon[] = [],
  iconLabels: Record<string, string> = {}
): IconMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const normalize = (value: string) => value
    .toLowerCase()
    .replace(/[.,!?;:()"'`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const normalizedText = normalize(text);
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const matches: IconMatch[] = [];

  // Get keyword map for locale (fallback to English)
  const KEYWORD_MAP = KEYWORD_MAPS[locale] || KEYWORD_MAPS['en'];
  
  const combinedDatabase = [...ICON_DATABASE, ...customIcons];

  /**
   * Build the keyword list for a single icon, incorporating:
   *  - Built-in keyword map (for ARASAAC icons)
   *  - Individual words from the icon's name (for custom icons with multi-word names)
   *  - Custom label override from localStorage (so relabelled icons are findable)
   */
  const buildKeywords = (icon: Icon): string[] => {
    const labelStr = normalize(iconLabels[icon.id] ?? '');
    const labelWords = labelStr
      ? [labelStr, ...labelStr.split(/\s+/).filter((w) => w.length >= 2)]
      : [];

    const builtinKeywords = KEYWORD_MAP[icon.id];
    if (builtinKeywords) {
      // Built-in icon: keyword map is source of truth, label adds extra aliases
      return [...builtinKeywords.map((k) => normalize(k)), ...labelWords];
    }

    // Custom uploaded icon: derive keywords from its name + individual words + label
    const nameLower = normalize(icon.name);
    const nameWords = nameLower.split(/\s+/).filter((w) => w.length >= 2);
    return [normalize(icon.id), nameLower, ...nameWords, ...labelWords];
  };

  // Words to skip only for partial matching (to avoid false positives)
  const PARTIAL_STOP_WORDS = new Set([
    'a', 'an', 'the', 'of', 'and', 'or', 'is', 'it', 'by', 'for', 'with', 'as', 'be', 'was', 'are',
    'en', 'ei', 'et', 'og', 'eller', 'er', 'som', 'til', 'av', 'fra', 'med',
  ]);

  // Check each icon for matches
  for (const icon of combinedDatabase) {
    const keywords = buildKeywords(icon);

    const keywordSet = new Set(keywords);

    // Phrase match pass — useful for "i am" / "jeg er" and similar multi-word entries
    const phraseMatched = keywords.find((keyword) => keyword.includes(' ') && normalizedText.includes(keyword));
    if (phraseMatched) {
      matches.push({
        icon,
        confidence: 0.95,
        matchType: 'exact',
      });
      continue;
    }
    
    // Exact match pass — any word exactly in the keyword list
    for (const word of words) {
      if (keywordSet.has(word)) {
        matches.push({
          icon,
          confidence: 1.0,
          matchType: 'exact',
        });
        break;
      }
    }

    // Partial match pass — only if no exact match found
    if (!matches.some(m => m.icon.id === icon.id)) {
      for (const keyword of keywords) {
        if (keyword.length < 4) continue; // skip very short keywords to avoid false substrings
        for (const word of words) {
          if (PARTIAL_STOP_WORDS.has(word)) continue;
          if (word.length < 3) continue;      // skip very short input words
          // word must share a meaningful substring - require the match to cover >50% of both strings
          const wordInKeyword = keyword.includes(word) && word.length >= 4;
          const keywordInWord = word.includes(keyword) && keyword.length >= 4;
          if (wordInKeyword || keywordInWord) {
            matches.push({
              icon,
              confidence: 0.6,
              matchType: 'partial',
            });
            break;
          }
        }
        if (matches.some(m => m.icon.id === icon.id)) break;
      }
    }
  }

  // Sort by confidence and remove duplicates
  const uniqueMatches = Array.from(
    new Map(matches.map(m => [m.icon.id, m])).values()
  );

  return uniqueMatches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxResults);
}

/**
 * Get icon suggestions based on recently used icons (pattern learning)
 */
export function getSuggestedIcons(recentIconIds: string[], maxResults = 5): Icon[] {
  // For pilot: simple implementation returning random icons from different categories
  // Phase 5: upgrade to ML pattern learning
  
  const suggestions: Icon[] = [];
  // Use imported CATEGORIES instead of hardcoded array
  const categories = CATEGORIES.filter(cat => cat.id !== 'custom').map(cat => cat.id);
  
  for (const category of categories) {
    const categoryIcons = ICON_DATABASE.filter(icon => icon.category === category);
    if (categoryIcons.length > 0) {
      const randomIcon = categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
      suggestions.push(randomIcon);
      if (suggestions.length >= maxResults) break;
    }
  }
  
  return suggestions;
}
