'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'no';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tIcon: (iconId: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'Pictalk',
    'app.description': 'AAC Communication App for Children',
    
    // Navigation
    'nav.communicate': 'Communicate',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Communicate page
    'communicate.title': 'Pictalk',
    'communicate.subtitle': 'Select icons, type, or speak to communicate',
    'communicate.tab.icons': 'Icons',
    'communicate.tab.type': 'Type',
    'communicate.tab.speech': 'Speech',
    'communicate.recent': 'Recently Used',
    'communicate.searchPlaceholder': 'Search icons...',
    'communicate.searchEmpty': 'No icons found for',
    
    // Sentence Builder
    'sentence.title': 'Your Icon Sentence:',
    'sentence.empty': 'Icons will appear here as you type...',
    'sentence.speak': 'Speak',
    'sentence.speaking': 'Speaking...',
    'sentence.clear': 'Clear',
    
    // Text to Icons
    'type.title': 'Type your sentence:',
    'type.hint': 'Icons will appear above as you complete each word with a space. Press Enter when done.',
    'type.placeholder': 'Type what you want to say...',
    'type.convert': 'Convert to Icons',
    'type.converting': 'Converting...',
    'type.success': '✓ Sentence converted! Check the icons above.',
    'type.suggestions': 'More suggestions (tap to add)',
    'type.allConverted': '✓ All words converted to icons!',
    'type.typeAnother': 'Type another sentence to continue',
    'type.help': '✨ Type to automatically convert text to icons',
    'type.examples': 'Try these examples:',
    
    // Categories
    'category.needs': 'Needs',
    'category.actions': 'Actions',
    'category.feelings': 'Feelings',
    'category.people': 'People',
    'category.places': 'Places',
    'category.custom': 'Custom',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.title': 'Dashboard',
    'dashboard.recent': 'Recent Activity',
    'dashboard.stats': 'Your Statistics',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.logout': 'Sign Out',
    'auth.register': 'Sign Up',
    
    // Language
    'language.english': 'English',
    'language.norwegian': 'Norwegian',
    'language.switch': 'Switch Language',
    
    // Icons - NEEDS
    'icon.eat': 'Eat',
    'icon.drink': 'Drink',
    'icon.water': 'Water',
    'icon.toilet': 'Toilet',
    'icon.sleep': 'Sleep',
    'icon.help': 'Help',
    'icon.medicine': 'Medicine',
    'icon.hungry': 'Hungry',
    'icon.thirsty': 'Thirsty',
    'icon.pain': 'Pain',
    'icon.hot': 'Hot',
    'icon.cold': 'Cold',
    
    // Icons - ACTIONS
    'icon.play': 'Play',
    'icon.walk': 'Walk',
    'icon.run': 'Run',
    'icon.sit': 'Sit',
    'icon.stand': 'Stand',
    'icon.read': 'Read',
    'icon.write': 'Write',
    'icon.draw': 'Draw',
    'icon.listen': 'Listen',
    'icon.watch': 'Watch',
    'icon.talk': 'Talk',
    'icon.sing': 'Sing',
    'icon.dance': 'Dance',
    'icon.jump': 'Jump',
    
    // Icons - FEELINGS
    'icon.happy': 'Happy',
    'icon.sad': 'Sad',
    'icon.angry': 'Angry',
    'icon.scared': 'Scared',
    'icon.excited': 'Excited',
    'icon.tired': 'Tired',
    'icon.sick': 'Sick',
    'icon.love': 'Love',
    'icon.worried': 'Worried',
    'icon.calm': 'Calm',
    'icon.proud': 'Proud',
    'icon.surprised': 'Surprised',
    
    // Icons - PEOPLE
    'icon.mom': 'Mom',
    'icon.dad': 'Dad',
    'icon.sister': 'Sister',
    'icon.brother': 'Brother',
    'icon.grandma': 'Grandma',
    'icon.grandpa': 'Grandpa',
    'icon.friend': 'Friend',
    'icon.teacher': 'Teacher',
    'icon.doctor': 'Doctor',
    'icon.baby': 'Baby',
    'icon.family': 'Family',
    'icon.me': 'Me',
    
    // Icons - PLACES
    'icon.home': 'Home',
    'icon.school': 'School',
    'icon.park': 'Park',
    'icon.hospital': 'Hospital',
    'icon.store': 'Store',
    'icon.restaurant': 'Restaurant',
    'icon.playground': 'Playground',
    'icon.beach': 'Beach',
    'icon.car': 'Car',
    'icon.bed': 'Bed',
    'icon.bathroom': 'Bathroom',
    'icon.kitchen': 'Kitchen',
    
    // Icons - CUSTOM
    'icon.apple': 'Apple',
    'icon.banana': 'Banana',
    'icon.pizza': 'Pizza',
    'icon.juice': 'Juice',
    'icon.milk': 'Milk',
    'icon.cookie': 'Cookie',
    'icon.toy': 'Toy',
    'icon.book': 'Book',
    'icon.ball': 'Ball',
    'icon.phone': 'Phone',
    'icon.music': 'Music',
    'icon.yes': 'Yes',
    'icon.no': 'No',
    'icon.please': 'Please',
    'icon.thankyou': 'Thank You',
  },
  no: {
    // Common
    'app.name': 'Pictalk',
    'app.description': 'AAC-kommunikasjonsapp for barn',
    
    // Navigation
    'nav.communicate': 'Kommuniser',
    'nav.dashboard': 'Oversikt',
    'nav.profile': 'Profil',
    'nav.settings': 'Innstillinger',
    
    // Communicate page
    'communicate.title': 'Pictalk',
    'communicate.subtitle': 'Velg ikoner, skriv eller snakk for å kommunisere',
    'communicate.tab.icons': 'Ikoner',
    'communicate.tab.type': 'Skriv',
    'communicate.tab.speech': 'Tale',
    'communicate.recent': 'Nylig brukt',
    'communicate.searchPlaceholder': 'Søk etter ikoner...',
    'communicate.searchEmpty': 'Ingen ikoner funnet for',
    
    // Sentence Builder
    'sentence.title': 'Din ikonsetning:',
    'sentence.empty': 'Ikoner vil vises her når du skriver...',
    'sentence.speak': 'Snakk',
    'sentence.speaking': 'Snakker...',
    'sentence.clear': 'Tøm',
    
    // Text to Icons
    'type.title': 'Skriv setningen din:',
    'type.hint': 'Ikoner vil vises ovenfor når du fullfører hvert ord med mellomrom. Trykk Enter når du er ferdig.',
    'type.placeholder': 'Skriv hva du vil si...',
    'type.convert': 'Konverter til ikoner',
    'type.converting': 'Konverterer...',
    'type.success': '✓ Setning konvertert! Sjekk ikonene ovenfor.',
    'type.suggestions': 'Flere forslag (trykk for å legge til)',
    'type.allConverted': '✓ Alle ord konvertert til ikoner!',
    'type.typeAnother': 'Skriv en ny setning for å fortsette',
    'type.help': '✨ Skriv for å automatisk konvertere tekst til ikoner',
    'type.examples': 'Prøv disse eksemplene:',
    
    // Categories
    'category.needs': 'Behov',
    'category.actions': 'Handlinger',
    'category.feelings': 'Følelser',
    'category.people': 'Personer',
    'category.places': 'Steder',
    'category.custom': 'Tilpasset',
    
    // Dashboard
    'dashboard.welcome': 'Velkommen tilbake',
    'dashboard.title': 'Oversikt',
    'dashboard.recent': 'Nylig aktivitet',
    'dashboard.stats': 'Din statistikk',
    
    // Auth
    'auth.login': 'Logg inn',
    'auth.logout': 'Logg ut',
    'auth.register': 'Registrer deg',
    
    // Language
    'language.english': 'Engelsk',
    'language.norwegian': 'Norsk',
    'language.switch': 'Bytt språk',
    
    // Icons - NEEDS
    'icon.eat': 'Spise',
    'icon.drink': 'Drikke',
    'icon.water': 'Vann',
    'icon.toilet': 'Toalett',
    'icon.sleep': 'Sove',
    'icon.help': 'Hjelp',
    'icon.medicine': 'Medisin',
    'icon.hungry': 'Sulten',
    'icon.thirsty': 'Tørst',
    'icon.pain': 'Smerte',
    'icon.hot': 'Varm',
    'icon.cold': 'Kald',
    
    // Icons - ACTIONS
    'icon.play': 'Leke',
    'icon.walk': 'Gå',
    'icon.run': 'Løpe',
    'icon.sit': 'Sitte',
    'icon.stand': 'Stå',
    'icon.read': 'Lese',
    'icon.write': 'Skrive',
    'icon.draw': 'Tegne',
    'icon.listen': 'Lytte',
    'icon.watch': 'Se',
    'icon.talk': 'Snakke',
    'icon.sing': 'Synge',
    'icon.dance': 'Danse',
    'icon.jump': 'Hoppe',
    
    // Icons - FEELINGS
    'icon.happy': 'Glad',
    'icon.sad': 'Trist',
    'icon.angry': 'Sint',
    'icon.scared': 'Redd',
    'icon.excited': 'Spent',
    'icon.tired': 'Trøtt',
    'icon.sick': 'Syk',
    'icon.love': 'Kjærlighet',
    'icon.worried': 'Bekymret',
    'icon.calm': 'Rolig',
    'icon.proud': 'Stolt',
    'icon.surprised': 'Overrasket',
    
    // Icons - PEOPLE
    'icon.mom': 'Mamma',
    'icon.dad': 'Pappa',
    'icon.sister': 'Søster',
    'icon.brother': 'Bror',
    'icon.grandma': 'Bestemor',
    'icon.grandpa': 'Bestefar',
    'icon.friend': 'Venn',
    'icon.teacher': 'Lærer',
    'icon.doctor': 'Lege',
    'icon.baby': 'Baby',
    'icon.family': 'Familie',
    'icon.me': 'Meg',
    
    // Icons - PLACES
    'icon.home': 'Hjem',
    'icon.school': 'Skole',
    'icon.park': 'Park',
    'icon.hospital': 'Sykehus',
    'icon.store': 'Butikk',
    'icon.restaurant': 'Restaurant',
    'icon.playground': 'Lekeplass',
    'icon.beach': 'Strand',
    'icon.car': 'Bil',
    'icon.bed': 'Seng',
    'icon.bathroom': 'Bad',
    'icon.kitchen': 'Kjøkken',
    
    // Icons - CUSTOM
    'icon.apple': 'Eple',
    'icon.banana': 'Banan',
    'icon.pizza': 'Pizza',
    'icon.juice': 'Juice',
    'icon.milk': 'Melk',
    'icon.cookie': 'Kjeks',
    'icon.toy': 'Leke',
    'icon.book': 'Bok',
    'icon.ball': 'Ball',
    'icon.phone': 'Telefon',
    'icon.music': 'Musikk',
    'icon.yes': 'Ja',
    'icon.no': 'Nei',
    'icon.please': 'Vær så snill',
    'icon.thankyou': 'Takk',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' on the server to avoid SSR/client hydration mismatch.
  // The real preference (localStorage / browser locale) is applied client-side in useEffect.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('pictalk-language') as Language;
    if (saved === 'en' || saved === 'no') {
      setLanguageState(saved);
    } else {
      // No saved preference — auto-detect from browser locale
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('nb') || browserLang.startsWith('nn') || browserLang.startsWith('no')) {
        setLanguageState('no');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pictalk-language', lang);
  };

  // Sync HTML lang attribute with current language for accessibility
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const tIcon = (iconId: string): string => {
    return translations[language][`icon.${iconId}`] || iconId;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tIcon }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
