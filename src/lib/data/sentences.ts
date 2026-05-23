import type { Language } from '@/contexts/LanguageContext';

export type SentenceCategory = 'needs' | 'actions' | 'feelings' | 'people' | 'places' | 'social';

export interface Sentence {
  id: string;
  category: SentenceCategory;
  /** Icon IDs that best represent this sentence (for visual hints) */
  iconIds: string[];
  /** High-frequency core vocabulary — shown in Quick Phrases strip */
  priority?: boolean;
  translations: Record<Language, string>;
}

// ── Quick Phrases: highest-frequency AAC core vocabulary ─────────────────
// priority: true  →  shown in the "Quick phrases" strip above category tabs
// These are the words/phrases a child or AAC user will reach for most often.

export const SENTENCE_DATABASE: Sentence[] = [
  // ── NEEDS ────────────────────────────────────────────────────────────────
  {
    id: 'needs_eat',
    category: 'needs',
    iconIds: ['eat'],
    priority: true,
    translations: { en: 'I want to eat', no: 'Jeg vil spise', es: 'Quiero comer', fr: 'Je veux manger', de: 'Ich möchte essen' },
  },
  {
    id: 'needs_hungry',
    category: 'needs',
    iconIds: ['hungry'],
    translations: { en: 'I am hungry', no: 'Jeg er sulten', es: 'Tengo hambre', fr: "J'ai faim", de: 'Ich bin hungrig' },
  },
  {
    id: 'needs_drink',
    category: 'needs',
    iconIds: ['drink', 'water'],
    translations: { en: 'I want to drink water', no: 'Jeg vil drikke vann', es: 'Quiero beber agua', fr: "Je veux boire de l'eau", de: 'Ich möchte Wasser trinken' },
  },
  {
    id: 'needs_thirsty',
    category: 'needs',
    iconIds: ['thirsty'],
    translations: { en: 'I am thirsty', no: 'Jeg er tørst', es: 'Tengo sed', fr: "J'ai soif", de: 'Ich bin durstig' },
  },
  {
    id: 'needs_toilet',
    category: 'needs',
    iconIds: ['toilet'],
    priority: true,
    translations: { en: 'I need the toilet', no: 'Jeg må på do', es: 'Necesito el baño', fr: "J'ai besoin des toilettes", de: 'Ich muss auf die Toilette' },
  },
  {
    id: 'needs_sleep',
    category: 'needs',
    iconIds: ['sleep'],
    translations: { en: 'I want to sleep', no: 'Jeg vil sove', es: 'Quiero dormir', fr: 'Je veux dormir', de: 'Ich möchte schlafen' },
  },
  {
    id: 'needs_help',
    category: 'needs',
    iconIds: ['help'],
    priority: true,
    translations: { en: 'I need help', no: 'Jeg trenger hjelp', es: 'Necesito ayuda', fr: "J'ai besoin d'aide", de: 'Ich brauche Hilfe' },
  },
  {
    id: 'needs_pain',
    category: 'needs',
    iconIds: ['pain'],
    priority: true,
    translations: { en: 'I am in pain', no: 'Jeg har vondt', es: 'Tengo dolor', fr: "J'ai mal", de: 'Ich habe Schmerzen' },
  },
  {
    id: 'needs_sick',
    category: 'needs',
    iconIds: ['sick'],
    translations: { en: 'I feel sick', no: 'Jeg er syk', es: 'Me siento mal', fr: 'Je me sens malade', de: 'Ich bin krank' },
  },
  {
    id: 'needs_medicine',
    category: 'needs',
    iconIds: ['medicine'],
    translations: { en: 'I need my medicine', no: 'Jeg trenger medisinen min', es: 'Necesito mi medicina', fr: "J'ai besoin de mon médicament", de: 'Ich brauche mein Medikament' },
  },
  {
    id: 'needs_hug',
    category: 'needs',
    iconIds: ['hug'],
    translations: { en: 'I want a hug', no: 'Jeg vil ha en klem', es: 'Quiero un abrazo', fr: 'Je veux un câlin', de: 'Ich möchte eine Umarmung' },
  },
  {
    id: 'needs_cold',
    category: 'needs',
    iconIds: ['cold'],
    translations: { en: 'I am cold', no: 'Jeg er kald', es: 'Tengo frío', fr: "J'ai froid", de: 'Mir ist kalt' },
  },
  {
    id: 'needs_hot',
    category: 'needs',
    iconIds: ['hot'],
    translations: { en: 'I am hot', no: 'Jeg er varm', es: 'Tengo calor', fr: "J'ai chaud", de: 'Mir ist heiß' },
  },

  // ── ACTIONS ──────────────────────────────────────────────────────────────
  {
    id: 'actions_play',
    category: 'actions',
    iconIds: ['play'],
    priority: true,
    translations: { en: 'I want to play', no: 'Jeg vil leke', es: 'Quiero jugar', fr: 'Je veux jouer', de: 'Ich möchte spielen' },
  },
  {
    id: 'actions_read',
    category: 'actions',
    iconIds: ['read', 'book'],
    translations: { en: 'I want to read a book', no: 'Jeg vil lese en bok', es: 'Quiero leer un libro', fr: 'Je veux lire un livre', de: 'Ich möchte ein Buch lesen' },
  },
  {
    id: 'actions_watch',
    category: 'actions',
    iconIds: ['watch'],
    translations: { en: 'I want to watch TV', no: 'Jeg vil se på TV', es: 'Quiero ver la televisión', fr: 'Je veux regarder la télé', de: 'Ich möchte fernsehen' },
  },
  {
    id: 'actions_walk',
    category: 'actions',
    iconIds: ['walk'],
    translations: { en: 'I want to walk', no: 'Jeg vil gå', es: 'Quiero caminar', fr: 'Je veux marcher', de: 'Ich möchte gehen' },
  },
  {
    id: 'actions_music',
    category: 'actions',
    iconIds: ['music'],
    translations: { en: 'I want music', no: 'Jeg vil høre musikk', es: 'Quiero música', fr: 'Je veux de la musique', de: 'Ich möchte Musik' },
  },
  {
    id: 'actions_draw',
    category: 'actions',
    iconIds: ['draw'],
    translations: { en: 'I want to draw', no: 'Jeg vil tegne', es: 'Quiero dibujar', fr: 'Je veux dessiner', de: 'Ich möchte zeichnen' },
  },
  {
    id: 'actions_dance',
    category: 'actions',
    iconIds: ['dance'],
    translations: { en: 'I want to dance', no: 'Jeg vil danse', es: 'Quiero bailar', fr: 'Je veux danser', de: 'Ich möchte tanzen' },
  },
  {
    id: 'actions_outside',
    category: 'actions',
    iconIds: ['walk'],
    translations: { en: 'I want to go outside', no: 'Jeg vil gå ut', es: 'Quiero salir afuera', fr: 'Je veux sortir', de: 'Ich möchte nach draußen' },
  },
  {
    id: 'actions_sing',
    category: 'actions',
    iconIds: ['sing'],
    translations: { en: 'I want to sing', no: 'Jeg vil synge', es: 'Quiero cantar', fr: 'Je veux chanter', de: 'Ich möchte singen' },
  },
  {
    id: 'actions_book',
    category: 'actions',
    iconIds: ['book'],
    translations: { en: 'Read me a book', no: 'Les for meg', es: 'Léeme un libro', fr: 'Lis-moi un livre', de: 'Lies mir ein Buch vor' },
  },
  {
    id: 'actions_break',
    category: 'actions',
    iconIds: ['rest'],
    translations: { en: 'I need a break', no: 'Jeg trenger en pause', es: 'Necesito un descanso', fr: "J'ai besoin d'une pause", de: 'Ich brauche eine Pause' },
  },

  // ── FEELINGS ─────────────────────────────────────────────────────────────
  {
    id: 'feelings_happy',
    category: 'feelings',
    iconIds: ['happy'],
    priority: true,
    translations: { en: 'I feel happy', no: 'Jeg er glad', es: 'Me siento feliz', fr: 'Je me sens heureux', de: 'Ich bin glücklich' },
  },
  {
    id: 'feelings_sad',
    category: 'feelings',
    iconIds: ['sad'],
    translations: { en: 'I feel sad', no: 'Jeg er trist', es: 'Me siento triste', fr: 'Je me sens triste', de: 'Ich bin traurig' },
  },
  {
    id: 'feelings_angry',
    category: 'feelings',
    iconIds: ['angry'],
    translations: { en: 'I am angry', no: 'Jeg er sint', es: 'Estoy enojado', fr: 'Je suis en colère', de: 'Ich bin wütend' },
  },
  {
    id: 'feelings_scared',
    category: 'feelings',
    iconIds: ['scared'],
    translations: { en: 'I am scared', no: 'Jeg er redd', es: 'Tengo miedo', fr: "J'ai peur", de: 'Ich habe Angst' },
  },
  {
    id: 'feelings_tired',
    category: 'feelings',
    iconIds: ['tired'],
    translations: { en: 'I am tired', no: 'Jeg er trøtt', es: 'Estoy cansado', fr: 'Je suis fatigué', de: 'Ich bin müde' },
  },
  {
    id: 'feelings_excited',
    category: 'feelings',
    iconIds: ['excited'],
    translations: { en: 'I am excited', no: 'Jeg er spent', es: 'Estoy emocionado', fr: 'Je suis excité', de: 'Ich bin aufgeregt' },
  },
  {
    id: 'feelings_calm',
    category: 'feelings',
    iconIds: ['calm'],
    translations: { en: 'I feel calm', no: 'Jeg er rolig', es: 'Me siento tranquilo', fr: 'Je me sens calme', de: 'Ich bin ruhig' },
  },
  {
    id: 'feelings_love',
    category: 'feelings',
    iconIds: ['love'],
    priority: true,
    translations: { en: 'I love you', no: 'Jeg elsker deg', es: 'Te quiero', fr: "Je t'aime", de: 'Ich liebe dich' },
  },
  {
    id: 'feelings_worried',
    category: 'feelings',
    iconIds: ['worried'],
    translations: { en: 'I am worried', no: 'Jeg er bekymret', es: 'Estoy preocupado', fr: 'Je suis inquiet', de: 'Ich bin besorgt' },
  },
  {
    id: 'feelings_bored',
    category: 'feelings',
    iconIds: ['bored'],
    translations: { en: 'I am bored', no: 'Jeg kjeder meg', es: 'Estoy aburrido', fr: "Je m'ennuie", de: 'Ich bin gelangweilt' },
  },
  {
    id: 'feelings_miss',
    category: 'feelings',
    iconIds: ['sad'],
    translations: { en: 'I miss you', no: 'Jeg savner deg', es: 'Te echo de menos', fr: 'Tu me manques', de: 'Ich vermisse dich' },
  },

  // ── PEOPLE ───────────────────────────────────────────────────────────────
  {
    id: 'people_mom',
    category: 'people',
    iconIds: ['mom'],
    translations: { en: 'I want mom', no: 'Jeg vil ha mamma', es: 'Quiero a mamá', fr: 'Je veux maman', de: 'Ich will Mama' },
  },
  {
    id: 'people_dad',
    category: 'people',
    iconIds: ['dad'],
    translations: { en: 'I want dad', no: 'Jeg vil ha pappa', es: 'Quiero a papá', fr: 'Je veux papa', de: 'Ich will Papa' },
  },
  {
    id: 'people_friend',
    category: 'people',
    iconIds: ['friend'],
    translations: { en: 'I miss my friend', no: 'Jeg savner vennen min', es: 'Echo de menos a mi amigo', fr: 'Mon ami me manque', de: 'Ich vermisse meinen Freund' },
  },
  {
    id: 'people_grandma',
    category: 'people',
    iconIds: ['grandma'],
    translations: { en: 'I want to call grandma', no: 'Jeg vil ringe bestemor', es: 'Quiero llamar a la abuela', fr: 'Je veux appeler grand-mère', de: 'Ich möchte Oma anrufen' },
  },
  {
    id: 'people_teacher',
    category: 'people',
    iconIds: ['teacher'],
    translations: { en: 'Where is the teacher?', no: 'Hvor er læreren?', es: '¿Dónde está el maestro?', fr: 'Où est le professeur?', de: 'Wo ist der Lehrer?' },
  },
  {
    id: 'people_family',
    category: 'people',
    iconIds: ['family'],
    translations: { en: 'I love my family', no: 'Jeg elsker familien min', es: 'Amo a mi familia', fr: "J'aime ma famille", de: 'Ich liebe meine Familie' },
  },
  {
    id: 'people_doctor',
    category: 'people',
    iconIds: ['doctor'],
    translations: { en: 'I need the doctor', no: 'Jeg trenger legen', es: 'Necesito al médico', fr: "J'ai besoin du médecin", de: 'Ich brauche den Arzt' },
  },

  // ── PLACES ───────────────────────────────────────────────────────────────
  {
    id: 'places_home',
    category: 'places',
    iconIds: ['home'],
    translations: { en: 'I want to go home', no: 'Jeg vil hjem', es: 'Quiero ir a casa', fr: 'Je veux rentrer à la maison', de: 'Ich möchte nach Hause' },
  },
  {
    id: 'places_park',
    category: 'places',
    iconIds: ['park'],
    translations: { en: 'I want to go to the park', no: 'Jeg vil til parken', es: 'Quiero ir al parque', fr: 'Je veux aller au parc', de: 'Ich möchte in den Park' },
  },
  {
    id: 'places_school',
    category: 'places',
    iconIds: ['school'],
    translations: { en: 'Take me to school', no: 'Kjør meg til skolen', es: 'Llévame a la escuela', fr: 'Emmène-moi à l\'école', de: 'Bring mich zur Schule' },
  },
  {
    id: 'places_playground',
    category: 'places',
    iconIds: ['playground'],
    translations: { en: 'I want to go to the playground', no: 'Jeg vil til lekeplassen', es: 'Quiero ir al parque infantil', fr: "Je veux aller à l'aire de jeux", de: 'Ich möchte auf den Spielplatz' },
  },
  {
    id: 'places_restaurant',
    category: 'places',
    iconIds: ['restaurant'],
    translations: { en: "Let's go to the restaurant", no: 'La oss gå til restauranten', es: 'Vamos al restaurante', fr: 'Allons au restaurant', de: 'Lass uns ins Restaurant gehen' },
  },
  {
    id: 'places_beach',
    category: 'places',
    iconIds: ['beach'],
    translations: { en: 'I want to go to the beach', no: 'Jeg vil til stranden', es: 'Quiero ir a la playa', fr: 'Je veux aller à la plage', de: 'Ich möchte an den Strand' },
  },
  {
    id: 'places_hospital',
    category: 'places',
    iconIds: ['hospital', 'doctor'],
    translations: { en: 'Take me to the hospital', no: 'Ta meg til sykehuset', es: 'Llévame al hospital', fr: 'Emmène-moi à l\'hôpital', de: 'Bring mich ins Krankenhaus' },
  },

  // ── SOCIAL ───────────────────────────────────────────────────────────────
  {
    id: 'social_yes',
    category: 'social',
    iconIds: ['yes'],
    priority: true,
    translations: { en: 'Yes please', no: 'Ja takk', es: 'Sí por favor', fr: "Oui s'il vous plaît", de: 'Ja bitte' },
  },
  {
    id: 'social_no',
    category: 'social',
    iconIds: ['no'],
    priority: true,
    translations: { en: 'No thank you', no: 'Nei takk', es: 'No gracias', fr: 'Non merci', de: 'Nein danke' },
  },
  {
    id: 'social_thankyou',
    category: 'social',
    iconIds: ['thankyou'],
    translations: { en: 'Thank you', no: 'Takk', es: 'Gracias', fr: 'Merci', de: 'Danke' },
  },
  {
    id: 'social_please_help',
    category: 'social',
    iconIds: ['help'],
    priority: true,
    translations: { en: 'Help me please', no: 'Hjelp meg', es: 'Ayúdame por favor', fr: "Aide-moi s'il te plaît", de: 'Hilf mir bitte' },
  },
  {
    id: 'social_good_morning',
    category: 'social',
    iconIds: ['happy'],
    translations: { en: 'Good morning', no: 'God morgen', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen' },
  },
  {
    id: 'social_good_night',
    category: 'social',
    iconIds: ['sleep'],
    translations: { en: 'Good night', no: 'God natt', es: 'Buenas noches', fr: 'Bonne nuit', de: 'Gute Nacht' },
  },
  {
    id: 'social_dont_understand',
    category: 'social',
    iconIds: ['help'],
    translations: { en: "I don't understand", no: 'Jeg forstår ikke', es: 'No entiendo', fr: 'Je ne comprends pas', de: 'Ich verstehe nicht' },
  },
  {
    id: 'social_more',
    category: 'social',
    iconIds: ['eat'],
    translations: { en: 'More please', no: 'Mer takk', es: 'Más por favor', fr: "Encore s'il te plaît", de: 'Mehr bitte' },
  },
  {
    id: 'social_stop',
    category: 'social',
    iconIds: ['no'],
    priority: true,
    translations: { en: 'Stop please', no: 'Stopp', es: 'Para por favor', fr: "Arrête s'il te plaît", de: 'Bitte hör auf' },
  },
  {
    id: 'social_wait',
    category: 'social',
    iconIds: ['wait'],
    translations: { en: 'Wait please', no: 'Vent litt', es: 'Espera por favor', fr: "Attends s'il te plaît", de: 'Warte bitte' },
  },
  {
    id: 'social_done',
    category: 'social',
    iconIds: ['done'],
    translations: { en: "I'm done", no: 'Jeg er ferdig', es: 'He terminado', fr: "J'ai fini", de: 'Ich bin fertig' },
  },
  {
    id: 'social_together',
    category: 'social',
    iconIds: ['play'],
    translations: { en: 'Together', no: 'Sammen', es: 'Juntos', fr: 'Ensemble', de: 'Zusammen' },
  },
];

/** Returns sentences filtered by category */
export function getSentencesByCategory(category: SentenceCategory): Sentence[] {
  return SENTENCE_DATABASE.filter((s) => s.category === category);
}

/** Returns sentences marked as priority (Quick Phrases) */
export function getPrioritySentences(): Sentence[] {
  return SENTENCE_DATABASE.filter((s) => s.priority === true);
}

/** Returns a sentence's text in the given language (falls back to English) */
export function getSentenceText(sentence: Sentence, language: Language): string {
  return sentence.translations[language] ?? sentence.translations.en;
}

export const SENTENCE_CATEGORIES: SentenceCategory[] = [
  'needs', 'actions', 'feelings', 'people', 'places', 'social',
];

export const SENTENCE_CATEGORY_ICONS: Record<SentenceCategory, string> = {
  needs: '🍽️',
  actions: '🎮',
  feelings: '😊',
  people: '👫',
  places: '🏠',
  social: '💬',
};

export const SENTENCE_CATEGORY_LABELS: Record<SentenceCategory, Partial<Record<Language, string>>> = {
  needs:   { en: 'Needs',   no: 'Behov',      es: 'Necesidades', fr: 'Besoins',   de: 'Bedürfnisse' },
  actions: { en: 'Actions', no: 'Handlinger', es: 'Acciones',    fr: 'Actions',   de: 'Aktionen' },
  feelings:{ en: 'Feelings',no: 'Følelser',   es: 'Sentimientos',fr: 'Émotions',  de: 'Gefühle' },
  people:  { en: 'People',  no: 'Personer',   es: 'Personas',    fr: 'Personnes', de: 'Personen' },
  places:  { en: 'Places',  no: 'Steder',     es: 'Lugares',     fr: 'Lieux',     de: 'Orte' },
  social:  { en: 'Social',  no: 'Sosialt',    es: 'Social',      fr: 'Social',    de: 'Sozial' },
};
