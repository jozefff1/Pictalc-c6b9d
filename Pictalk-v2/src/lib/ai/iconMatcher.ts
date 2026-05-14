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
  locale: string = 'en'
): IconMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/);
  const matches: IconMatch[] = [];

  // Get keyword map for locale (fallback to English)
  const KEYWORD_MAP = KEYWORD_MAPS[locale] || KEYWORD_MAPS['en'];

  // Check each icon for matches
  for (const icon of ICON_DATABASE) {
    const keywords = KEYWORD_MAP[icon.id] || [icon.id, icon.name.toLowerCase()];
    
    // Check for exact matches first
    for (const word of words) {
      if (keywords.includes(word)) {
        matches.push({
          icon,
          confidence: 1.0,
          matchType: 'exact',
        });
        break;
      }
    }

    // If no exact match, check for partial matches
    if (!matches.some(m => m.icon.id === icon.id)) {
      for (const keyword of keywords) {
        for (const word of words) {
          if (keyword.includes(word) || word.includes(keyword)) {
            matches.push({
              icon,
              confidence: 0.7,
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
