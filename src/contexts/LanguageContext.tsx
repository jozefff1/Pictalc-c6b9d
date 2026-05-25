'use client';

import { createContext, useContext, useSyncExternalStore, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/lib/utils/constants';

export type Language = 'en' | 'no' | 'es' | 'fr' | 'de';

export const LANGUAGES: Record<Language, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English',   nativeName: 'English',  flag: '🇬🇧' },
  no: { name: 'Norwegian', nativeName: 'Norsk',    flag: '🇳🇴' },
  es: { name: 'Spanish',   nativeName: 'Español',  flag: '🇪🇸' },
  fr: { name: 'French',    nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German',    nativeName: 'Deutsch',  flag: '🇩🇪' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tIcon: (iconId: string) => string;
  tLang: (key: string, lang: Language) => string;
  learnFrom: Language;
  learnTarget: Language;
  setLearnFrom: (lang: Language) => void;
  setLearnTarget: (lang: Language) => void;
  swapLearnLanguages: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_EVENT = 'snakke-language-change';

function subscribeLanguage(callback: () => void) {
  window.addEventListener(LANG_EVENT, callback);
  return () => window.removeEventListener(LANG_EVENT, callback);
}

function getLanguageSnapshot(): Language {
  const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (saved === 'en' || saved === 'no') return saved as Language;
  const browserLang = navigator.language?.toLowerCase() || '';
  if (browserLang.startsWith('nb') || browserLang.startsWith('nn') || browserLang.startsWith('no')) return 'no';
  return 'en';
}

const getLanguageServerSnapshot = (): Language => 'en';

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'Snakke',
    'app.description': 'AAC Communication App for Children',
    
    // Navigation
    'nav.communicate': 'Communicate',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.learn': 'Learn',
    'nav.signOut': 'Sign Out',
    
    // Communicate page
    'communicate.title': 'Snakke',
    'communicate.subtitle': 'Select icons, type, or speak to communicate',
    'communicate.tab.icons': 'Icons',
    'communicate.tab.type': 'Type',
    'communicate.tab.speech': 'Speech',
    'communicate.recent': 'Recently Used',
    'communicate.phrases': 'My phrases',
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
    'type.examples': 'Browse phrases by category:',
    'type.quickPhrases': 'Quick phrases',
    
    // Categories
    'category.needs': 'Needs',
    'category.actions': 'Actions',
    'category.feelings': 'Feelings',
    'category.people': 'People',
    'category.places': 'Places',
    'category.custom': 'Custom',
    'category.sentences': 'Sentences',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.title': 'Dashboard',
    'dashboard.recent': 'Recent Activity',
    'dashboard.stats': 'Your Statistics',
    'dashboard.start': 'Start Communicating',
    'dashboard.role': 'Role',
    'dashboard.cards.communicate.title': 'Quick Actions',
    'dashboard.cards.communicate.desc': 'Start communicating with icons',
    'dashboard.cards.history.title': 'Communication History',
    'dashboard.cards.history.desc': 'Review past sentences and replay them',
    'dashboard.cards.settings.title': 'Settings',
    'dashboard.cards.settings.desc': 'Customize your experience',
    'dashboard.cards.icons.title': 'Custom Icons',
    'dashboard.cards.icons.desc': 'Upload your own AAC icons and images',
    'dashboard.cards.patients.title': 'Patients & Participants',
    'dashboard.cards.patients.desc': 'Invite participants and manage privacy settings',
    'dashboard.cards.learn.title': 'Language Learning',
    'dashboard.cards.learn.desc': 'Practice vocabulary in 5 languages with flashcards, writing, and speaking',
    
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
    'icon.you': 'You',
    'icon.they': 'They',
    
    // Icons - DIRECTIONS (within ACTIONS)
    'icon.up': 'Up',
    'icon.down': 'Down',
    'icon.left': 'Left',
    'icon.right': 'Right',
    
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
    'icon.wait': 'Wait',
    'icon.go': 'Go',
    'icon.stop': 'Stop',
    'icon.yes': 'Yes',
    'icon.no': 'No',
    'icon.please': 'Please',
    'icon.thankyou': 'Thank You',

    // Landing page
    'home.skip': 'Skip to main content',
    'home.hero.badge': 'AAC — Augmentative & Alternative Communication',
    'home.hero.headline1': 'Anyone deserves',
    'home.hero.headline2': 'a voice.',
    'home.hero.subtitle': 'Snakke is a modern AAC app that helps children and individuals with communication challenges express themselves through icons and speech — online or offline.',
    'home.hero.cta.start': 'Get Started Free →',
    'home.hero.cta.login': 'Sign In',
    'home.stats.icons': 'Built-in icons',
    'home.stats.languages': 'Languages (EN/NO)',
    'home.stats.offline': 'Works offline',
    'home.stats.free': 'Free',
    'home.stats.forever': 'Forever',
    'home.demo.title': 'See it in action',
    'home.demo.subtitle': 'Tap icons to build sentences. Speak with one tap.',
    'home.demo.speak': '🔊 Speak',
    'home.demo.cta': 'Try it now — no sign up needed →',
    'home.demo.note': 'Free forever. No account required to communicate.',
    'home.features.title': 'Everything you need',
    'home.features.subtitle': 'Built for real-world AAC use — reliable, fast, and accessible.',
    'home.features.icon_comm.title': 'Icon-Based Communication',
    'home.features.icon_comm.desc': 'Tap icons to build sentences. 89+ ARASAAC pictograms across 6 categories.',
    'home.features.tts.title': 'Natural Text-to-Speech',
    'home.features.tts.desc': 'Adjustable speed and pitch. Speaks in English and Norwegian.',
    'home.features.offline.title': 'Works Offline',
    'home.features.offline.desc': 'Progressive Web App — install it and use it anywhere, even without internet.',
    'home.features.custom.title': 'Custom Icons',
    'home.features.custom.desc': 'Upload your own photos and icons to personalise the board for each child.',
    'home.features.history.title': 'Communication History',
    'home.features.history.desc': 'Supervisors can review past sessions and track vocabulary progress.',
    'home.features.private.title': 'Private & Secure',
    'home.features.private.desc': 'Your data stays private. No ads. No tracking. Secure authentication.',
    'home.who.title': 'Who is Snakke for?',
    'home.who.subtitle': 'Designed around the people who use it every day.',
    'home.who.children.role': 'Children & Individuals',
    'home.who.children.desc': 'Children and individuals with autism, cerebral palsy, apraxia, or other conditions that affect communication. Simple, colourful, and fast.',
    'home.who.parents.role': 'Parents & Guardians',
    'home.who.parents.desc': "Monitor communication sessions, add personalised icons, and pair your device to view your child's board in real time.",
    'home.who.therapists.role': 'Therapists & Teachers',
    'home.who.therapists.desc': 'Manage multiple students, review history across all paired users, and customise vocabulary for each individual.',
    'home.cta.title': 'Ready to get started?',
    'home.cta.subtitle': 'Free forever. No credit card required.',
    'home.cta.button': 'Create Free Account →',
    'home.footer.about': 'About',
    'home.footer.rights': 'All rights reserved.',

    // Learn mode UI
    'learn.title': 'Learn',
    'learn.subtitle': 'Choose two languages and flip flashcards to practise vocabulary.',
    'learn.iKnow': 'I know',
    'learn.iAmLearning': 'I\'m learning',
    'learn.swap': 'Swap',
    'learn.startSession': 'Start',
    'learn.cardOf': 'of',
    'learn.tapToReveal': 'Tap to reveal',
    'learn.knew': 'I knew it ✓',
    'learn.didntKnow': 'Not yet ✗',
    'learn.sessionDone': 'Session complete!',
    'learn.score': 'Score',
    'learn.restart': 'Restart',
    'learn.filterAll': 'All',
    'learn.hint': 'Hint',
    'learn.modeFlashcard': 'Flashcard',
    'learn.modeWriting': 'Writing',
    'learn.modeSpeaking': 'Speaking',
    'learn.typeAnswer': 'Type the word…',
    'learn.submit': 'Check',
    'learn.correct': 'Correct!',
    'learn.tryAgain': 'Not quite — the answer was',
    'learn.speakNow': 'Speak now',
    'learn.listening': 'Listening…',
    'learn.noSpeech': 'Nothing heard, try again',
    'learn.speechUnsupported': 'Speech recognition not supported in this browser',
    'learn.next': 'Next',

    // Profile page
    'profile.title': 'Profile',
    'profile.loading': 'Loading profile...',
    'profile.error': 'Could not load profile.',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.memberSince': 'Member since',
    'profile.edit': '✏️ Edit',
    'profile.save': 'Save',
    'profile.saving': '...',
    'profile.cancel': 'Cancel',
    'profile.saved': '✓ Name updated',
    'profile.voiceSettings': '⚙️ Voice Settings',
    'profile.communicate': '💬 Communicate',

    // Settings page
    'settings.title': 'Settings',
    'settings.subtitle': 'Adjust your voice, speech, and accessibility preferences',
    'settings.loading': 'Loading settings...',
    'settings.voice.title': 'Voice Settings',
    'settings.voice.speed': 'Speaking Speed',
    'settings.voice.pitch': 'Voice Pitch',
    'settings.voice.test': '🎤 Test Voice',
    'settings.voice.slow': 'Slow (0.5×)',
    'settings.voice.normal': 'Normal (1.0×)',
    'settings.voice.fast': 'Fast (2.0×)',
    'settings.voice.low': 'Low (0.5)',
    'settings.voice.high': 'High (2.0)',
    'settings.voice.saving': 'Saving...',
    'settings.voice.saved': '✓ Saved',
    'settings.accessibility.title': 'Accessibility',
    'settings.haptic.label': 'Haptic Feedback',
    'settings.haptic.desc': 'Vibrate the device briefly when tapping an icon (supported devices only)',
    'settings.highContrast.label': 'High Contrast',
    'settings.highContrast.desc': 'Increase colour contrast for text and borders — helps with visual impairments',
    'settings.reduceMotion.label': 'Reduce Motion',
    'settings.reduceMotion.desc': 'Disable animations and transitions throughout the app',
    'settings.textSize.label': 'Text Size',
    'settings.textSize.desc': 'Scale all text in the app',
    'settings.small': 'Small (0.8×)',
    'settings.large': 'Large (2.0×)',

    // Patients page
    'patients.title': 'Patients & Participants',
    'patients.subtitle': 'Manage who you monitor and who can see your data',
    'patients.invite': '+ Invite Participant',
    'patients.mine': 'My Patients / Participants',
    'patients.loading': 'Loading…',
    'patients.empty': 'No participants yet',
    'patients.empty.desc': 'Click "Invite Participant" to generate a link for a child or patient.',
    'patients.historyShared': 'History shared',
    'patients.exportAllowed': 'Export allowed',
    'patients.view': 'View',
    'patients.remove': 'Remove',
    'patients.accessTitle': 'People With Access to My Data',
    'patients.noAccess': 'No one currently has access to your communication data.',
    'patients.revoke': 'Revoke',
    'patients.editPrivacy': 'Edit Privacy',
    'patients.modal.title': 'Invite a Participant',
    'patients.modal.subtitle': 'Share this link with the patient or their parent. They will choose exactly what data to share when they accept.',
    'patients.modal.role': 'Your role / relationship',
    'patients.modal.emailLabel': 'Send invite by email',
    'patients.modal.emailOptional': '(optional)',
    'patients.modal.emailPlaceholder': 'participant@example.com',
    'patients.modal.cancel': 'Cancel',
    'patients.modal.generate': 'Generate Link',
    'patients.modal.generating': 'Generating…',
    'patients.modal.done': 'Done',
    'patients.modal.expires': 'Expires',
    'patients.modal.expiry': 'Valid for 7 days.',
    'patients.modal.copy': 'Copy',
    'patients.modal.copied': '✓ Copied',
    'patients.modal.emailSent': 'Invitation email sent to',

    // History page
    'history.title': 'Communication History',
    'history.back': '← Back',
    'history.viewingFor': 'Viewing history for',
    'history.noSessions': 'No sessions yet',
    'history.empty.user': 'Start communicating and your sentences will be saved here.',
    'history.replay': '▶ Replay',
    'history.replaying': 'Replaying…',

    // Login page
    'login.title': 'Welcome Back',
    'login.subtitle': 'Log in to continue to Snakke',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Log In',
    'login.submitting': 'Logging in...',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'login.backHome': '← Back to home',
    'login.error.invalid': 'Invalid email or password. If you just registered, check your inbox for a verification email.',
    'login.error.generic': 'An error occurred. Please try again.',
    'login.success.registered': 'Account created successfully! Please log in.',
    'login.success.verified': 'Email verified! You can now sign in.',
    'login.success.reset': 'Password updated! You can now sign in with your new password.',

    // Register page
    'register.title': 'Create Account',
    'register.subtitle': 'Join Snakke to start communicating',
    'register.name': 'Full Name',
    'register.namePlaceholder': 'John Doe',
    'register.email': 'Email',
    'register.role': 'I am a...',
    'register.role.child': 'Child/Student',
    'register.role.guardian': 'Parent/Guardian',
    'register.role.teacher': 'Teacher',
    'register.role.therapist': 'Therapist',
    'register.password': 'Password',
    'register.pw.contains': 'Password must contain:',
    'register.pw.length': 'At least 8 characters',
    'register.pw.uppercase': 'One uppercase letter',
    'register.pw.lowercase': 'One lowercase letter',
    'register.pw.number': 'One number',
    'register.confirmPassword': 'Confirm Password',
    'register.submit': 'Create Account',
    'register.submitting': 'Creating account...',
    'register.hasAccount': 'Already have an account?',
    'register.logIn': 'Log in',
    'register.backHome': '← Back to home',
    'register.error.failed': 'Registration failed',
    'register.error.fixBelow': 'Please fix the errors below',
    'register.error.requirements': 'Please ensure your password meets all requirements',
    'register.validation.name': 'Name must be at least 2 characters',
    'register.validation.passwords': 'Passwords do not match',

    // Forgot password page
    'forgotPw.title': 'Forgot password?',
    'forgotPw.subtitle': "Enter your email and we'll send you a reset link.",
    'forgotPw.emailLabel': 'Email address',
    'forgotPw.submit': 'Send Reset Link',
    'forgotPw.submitting': 'Sending...',
    'forgotPw.backToLogin': '← Back to sign in',
    'forgotPw.success.title': 'Check your inbox',
    'forgotPw.success.sent': 'A password reset link has been sent to',
    'forgotPw.success.expires': 'The link expires in 1 hour.',
    'forgotPw.success.back': 'Back to sign in',
    'forgotPw.error.generic': 'Something went wrong. Please try again.',
    'forgotPw.error.network': 'Network error. Please try again.',

    // Verify email page
    'verifyEmail.pending.title': 'Check your inbox',
    'verifyEmail.pending.sent': 'We sent a verification link to',
    'verifyEmail.pending.desc': 'Click the link in the email to activate your account. The link expires in 24 hours.',
    'verifyEmail.pending.notReceived': "Didn't receive it? Check your spam folder or",
    'verifyEmail.pending.registerAgain': 'register again',
    'verifyEmail.verifying.title': 'Verifying your email…',
    'verifyEmail.verifying.wait': 'Please wait a moment.',
    'verifyEmail.success.title': 'Email verified!',
    'verifyEmail.success.desc': 'Your account is now active. You can sign in to Snakke.',
    'verifyEmail.success.cta': 'Sign in',
    'verifyEmail.error.title': 'Verification failed',
    'verifyEmail.error.cta': 'Register again',

    // Reset password page
    'resetPw.title': 'New password',
    'resetPw.subtitle': 'Choose a strong password for your account.',
    'resetPw.newPassword': 'New password',
    'resetPw.confirmPassword': 'Confirm password',
    'resetPw.submit': 'Set new password',
    'resetPw.submitting': 'Saving…',
    'resetPw.error.mismatch': 'Passwords do not match.',
    'resetPw.error.requirements': 'Please ensure your password meets all requirements.',
    'resetPw.error.missingToken': 'Missing reset token. Please use the link from your email.',
    'resetPw.error.generic': 'Something went wrong. Please try again.',
    'resetPw.error.network': 'Network error. Please try again.',
    'resetPw.invalidLink.title': 'Invalid link',
    'resetPw.invalidLink.desc': 'This reset link is missing a token. Please request a new one.',
    'resetPw.requestNew': 'Request new link',

    // About page UI
    'about.badge': 'Built by Digital Ark AS',
    'about.title': 'About Snakke',
    'about.subtitle': 'Snakke is a free, privacy-first AAC (Augmentative and Alternative Communication) app that helps anyone with speech or communication challenges express themselves — and gives therapists, teachers, and researchers the tools to support them.',
    'about.toc': 'Contents',
    'about.contact.title': 'Contact',
    'about.contact.desc': 'Questions about Snakke, research collaboration, accessibility feedback, or commercial licensing? Get in touch with the team at',
    'about.footer.home': 'Home',
    'about.footer.signUp': 'Sign Up Free',
    'about.footer.rights': '© 2026 Digital Ark AS. All rights reserved.',

    // Contact form
    'contact.yourName': 'Your name',
    'contact.yourEmail': 'Your email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'contact.submitting': 'Sending...',
    'contact.success.title': 'Message sent!',
    'contact.success.desc': "We'll get back to you at your email address. Thank you for reaching out.",
    'contact.success.back': 'Send another message',
    'contact.error.required': 'Please fill in all required fields.',
    'contact.error.email': 'Please enter a valid email address.',
    'contact.error.messageShort': 'Message must be at least 10 characters.',
    'contact.error.generic': 'Something went wrong. Please try again.',
    'contact.sendsTo': 'Sends to',
  },
  no: {
    // Common
    'app.name': 'Snakke',
    'app.description': 'AAC-kommunikasjonsapp for barn',
    
    // Navigation
    'nav.communicate': 'Kommuniser',
    'nav.dashboard': 'Oversikt',
    'nav.profile': 'Profil',
    'nav.settings': 'Innstillinger',
    'nav.learn': 'Lær',
    'nav.signOut': 'Logg ut',
    
    // Communicate page
    'communicate.title': 'Snakke',
    'communicate.subtitle': 'Velg ikoner, skriv eller snakk for å kommunisere',
    'communicate.tab.icons': 'Ikoner',
    'communicate.tab.type': 'Skriv',
    'communicate.tab.speech': 'Tale',
    'communicate.recent': 'Nylig brukt',
    'communicate.phrases': 'Mine fraser',
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
    'type.examples': 'Velg kategori:',
    'type.quickPhrases': 'Raske fraser',
    
    // Categories
    'category.needs': 'Behov',
    'category.actions': 'Handlinger',
    'category.feelings': 'Følelser',
    'category.people': 'Personer',
    'category.places': 'Steder',
    'category.custom': 'Tilpasset',
    'category.sentences': 'Setninger',
    
    // Dashboard
    'dashboard.welcome': 'Velkommen tilbake',
    'dashboard.title': 'Oversikt',
    'dashboard.recent': 'Nylig aktivitet',
    'dashboard.stats': 'Din statistikk',
    'dashboard.start': 'Start kommunikasjon',
    'dashboard.role': 'Rolle',
    'dashboard.cards.communicate.title': 'Hurtighandlinger',
    'dashboard.cards.communicate.desc': 'Start kommunikasjon med ikoner',
    'dashboard.cards.history.title': 'Kommunikasjonshistorikk',
    'dashboard.cards.history.desc': 'Se gjennom tidligere setninger og spill av igjen',
    'dashboard.cards.settings.title': 'Innstillinger',
    'dashboard.cards.settings.desc': 'Tilpass opplevelsen din',
    'dashboard.cards.icons.title': 'Egendefinerte ikoner',
    'dashboard.cards.icons.desc': 'Last opp dine egne AAC-ikoner og bilder',
    'dashboard.cards.patients.title': 'Pasienter og deltakere',
    'dashboard.cards.patients.desc': 'Inviter deltakere og administrer personverninnstillinger',
    'dashboard.cards.learn.title': 'Språklæring',
    'dashboard.cards.learn.desc': 'Øv vokabular på 5 språk med flashkort, skriving og tale',
    
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
    'icon.you': 'Deg',
    'icon.they': 'De',
    
    // Icons - DIRECTIONS (within ACTIONS)
    'icon.up': 'Opp',
    'icon.down': 'Ned',
    'icon.left': 'Venstre',
    'icon.right': 'Høyre',
    
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
    'icon.wait': 'Vent',
    'icon.go': 'Gå',
    'icon.stop': 'Stopp',
    'icon.yes': 'Ja',
    'icon.no': 'Nei',
    'icon.please': 'Vær så snill',
    'icon.thankyou': 'Takk',

    // Landing page
    'home.skip': 'Hopp til hovedinnhold',
    'home.hero.badge': 'AAC — Alternativ og supplerende kommunikasjon',
    'home.hero.headline1': 'Alle fortjener',
    'home.hero.headline2': 'en stemme.',
    'home.hero.subtitle': 'Snakke er en moderne AAC-app som hjelper barn og enkeltpersoner med kommunikasjonsutfordringer å uttrykke seg gjennom ikoner og tale — online eller offline.',
    'home.hero.cta.start': 'Kom i gang gratis →',
    'home.hero.cta.login': 'Logg inn',
    'home.stats.icons': 'Innebygde ikoner',
    'home.stats.languages': 'Språk (EN/NO)',
    'home.stats.offline': 'Fungerer offline',
    'home.stats.free': 'Gratis',
    'home.stats.forever': 'For alltid',
    'home.demo.title': 'Se det i aksjon',
    'home.demo.subtitle': 'Trykk på ikoner for å bygge setninger. Snakk med ett trykk.',
    'home.demo.speak': '🔊 Snakk',
    'home.demo.cta': 'Prøv det nå — ingen registrering nødvendig →',
    'home.demo.note': 'Gratis for alltid. Ingen konto nødvendig for å kommunisere.',
    'home.features.title': 'Alt du trenger',
    'home.features.subtitle': 'Bygget for virkelig AAC-bruk — pålitelig, rask og tilgjengelig.',
    'home.features.icon_comm.title': 'Ikonbasert kommunikasjon',
    'home.features.icon_comm.desc': 'Trykk på ikoner for å bygge setninger. 89+ ARASAAC-piktogrammer i 6 kategorier.',
    'home.features.tts.title': 'Naturlig tekst-til-tale',
    'home.features.tts.desc': 'Justerbar hastighet og tonehøyde. Snakker på engelsk og norsk.',
    'home.features.offline.title': 'Fungerer offline',
    'home.features.offline.desc': 'Progressiv nettapp — installer den og bruk den hvor som helst, selv uten internett.',
    'home.features.custom.title': 'Egne ikoner',
    'home.features.custom.desc': 'Last opp egne bilder og ikoner for å tilpasse tavlen for hvert barn.',
    'home.features.history.title': 'Kommunikasjonshistorikk',
    'home.features.history.desc': 'Veiledere kan se gjennom tidligere økter og følge ordforrådsutvikling.',
    'home.features.private.title': 'Privat og sikker',
    'home.features.private.desc': 'Dataene dine forblir private. Ingen annonser. Ingen sporing. Sikker autentisering.',
    'home.who.title': 'Hvem er Snakke for?',
    'home.who.subtitle': 'Designet rundt menneskene som bruker det hver dag.',
    'home.who.children.role': 'Barn og enkeltpersoner',
    'home.who.children.desc': 'Barn og enkeltpersoner med autisme, cerebral parese, apraksi eller andre tilstander som påvirker kommunikasjon. Enkel, fargerik og rask.',
    'home.who.parents.role': 'Foreldre og foresatte',
    'home.who.parents.desc': 'Overvåk kommunikasjonsøkter, legg til personlige ikoner, og koble enheten din til å se barnets tavle i sanntid.',
    'home.who.therapists.role': 'Terapeuter og lærere',
    'home.who.therapists.desc': 'Administrer flere elever, gjennomgå historikk for alle tilkoblede brukere, og tilpass ordforråd for hvert individ.',
    'home.cta.title': 'Klar til å komme i gang?',
    'home.cta.subtitle': 'Gratis for alltid. Ingen kredittkort nødvendig.',
    'home.cta.button': 'Opprett gratis konto →',
    'home.footer.about': 'Om oss',
    'home.footer.rights': 'Alle rettigheter forbeholdt.',

    // Learn mode UI
    'learn.title': 'Lær',
    'learn.subtitle': 'Velg to språk og bla gjennom flashkort for å øve på ord.',
    'learn.iKnow': 'Jeg kan',
    'learn.iAmLearning': 'Jeg lærer',
    'learn.swap': 'Bytt',
    'learn.startSession': 'Start',
    'learn.cardOf': 'av',
    'learn.tapToReveal': 'Trykk for å avsløre',
    'learn.knew': 'Jeg visste det ✓',
    'learn.didntKnow': 'Ikke ennå ✗',
    'learn.sessionDone': 'Økt fullført!',
    'learn.score': 'Poeng',
    'learn.restart': 'Start på nytt',
    'learn.filterAll': 'Alle',
    'learn.hint': 'Hint',
    'learn.modeFlashcard': 'Flashkort',
    'learn.modeWriting': 'Skriving',
    'learn.modeSpeaking': 'Tale',
    'learn.typeAnswer': 'Skriv ordet…',
    'learn.submit': 'Sjekk',
    'learn.correct': 'Riktig!',
    'learn.tryAgain': 'Ikke helt — svaret var',
    'learn.speakNow': 'Si ordet nå',
    'learn.listening': 'Lytter…',
    'learn.noSpeech': 'Ingenting hørt, prøv igjen',
    'learn.speechUnsupported': 'Talegjenkjenning støttes ikke i denne nettleseren',
    'learn.next': 'Neste',

    // Profile page
    'profile.title': 'Profil',
    'profile.loading': 'Laster profil...',
    'profile.error': 'Kunne ikke laste profil.',
    'profile.email': 'E-post',
    'profile.role': 'Rolle',
    'profile.memberSince': 'Medlem siden',
    'profile.edit': '✏️ Rediger',
    'profile.save': 'Lagre',
    'profile.saving': '...',
    'profile.cancel': 'Avbryt',
    'profile.saved': '✓ Navn oppdatert',
    'profile.voiceSettings': '⚙️ Stemmeinnstillinger',
    'profile.communicate': '💬 Kommuniser',

    // Settings page
    'settings.title': 'Innstillinger',
    'settings.subtitle': 'Juster stemme-, tale- og tilgjengelighetsinnstillinger',
    'settings.loading': 'Laster innstillinger...',
    'settings.voice.title': 'Stemmeinnstillinger',
    'settings.voice.speed': 'Talehastighet',
    'settings.voice.pitch': 'Stemmeleie',
    'settings.voice.test': '🎤 Test stemmen',
    'settings.voice.slow': 'Langsom (0.5×)',
    'settings.voice.normal': 'Normal (1.0×)',
    'settings.voice.fast': 'Rask (2.0×)',
    'settings.voice.low': 'Lav (0.5)',
    'settings.voice.high': 'Høy (2.0)',
    'settings.voice.saving': 'Lagrer...',
    'settings.voice.saved': '✓ Lagret',
    'settings.accessibility.title': 'Tilgjengelighet',
    'settings.haptic.label': 'Haptic tilbakemelding',
    'settings.haptic.desc': 'Vibrer enheten kort når du trykker på et ikon (støttede enheter)',
    'settings.highContrast.label': 'Høy kontrast',
    'settings.highContrast.desc': 'Øk fargekontrasten for tekst og rammer — hjelper ved synshemminger',
    'settings.reduceMotion.label': 'Reduser bevegelse',
    'settings.reduceMotion.desc': 'Deaktiver animasjoner og overganger i hele appen',
    'settings.textSize.label': 'Tekststørrelse',
    'settings.textSize.desc': 'Skaler all tekst i appen',
    'settings.small': 'Liten (0.8×)',
    'settings.large': 'Stor (2.0×)',

    // Patients page
    'patients.title': 'Pasienter og deltakere',
    'patients.subtitle': 'Administrer hvem du overvåker og hvem som kan se dataene dine',
    'patients.invite': '+ Inviter deltaker',
    'patients.mine': 'Mine pasienter / deltakere',
    'patients.loading': 'Laster…',
    'patients.empty': 'Ingen deltakere ennå',
    'patients.empty.desc': 'Klikk på "Inviter deltaker" for å generere en lenke for et barn eller en pasient.',
    'patients.historyShared': 'Historikk delt',
    'patients.exportAllowed': 'Eksport tillatt',
    'patients.view': 'Vis',
    'patients.remove': 'Fjern',
    'patients.accessTitle': 'Personer med tilgang til mine data',
    'patients.noAccess': 'Ingen har for øyeblikket tilgang til kommunikasjonsdataene dine.',
    'patients.revoke': 'Opphev',
    'patients.editPrivacy': 'Rediger personvern',
    'patients.modal.title': 'Inviter en deltaker',
    'patients.modal.subtitle': 'Del denne lenken med pasienten eller deres foresatte. De velger selv hva de deler når de aksepterer.',
    'patients.modal.role': 'Din rolle / relasjon',
    'patients.modal.emailLabel': 'Send invitasjon via e-post',
    'patients.modal.emailOptional': '(valgfritt)',
    'patients.modal.emailPlaceholder': 'deltaker@eksempel.no',
    'patients.modal.cancel': 'Avbryt',
    'patients.modal.generate': 'Generer lenke',
    'patients.modal.generating': 'Genererer…',
    'patients.modal.done': 'Ferdig',
    'patients.modal.expires': 'Utløper',
    'patients.modal.expiry': 'Gyldig i 7 dager.',
    'patients.modal.copy': 'Kopier',
    'patients.modal.copied': '✓ Kopiert',
    'patients.modal.emailSent': 'Invitasjonse-post sendt til',

    // History page
    'history.title': 'Kommunikasjonshistorikk',
    'history.back': '← Tilbake',
    'history.viewingFor': 'Viser historikk for',
    'history.noSessions': 'Ingen økter ennå',
    'history.empty.user': 'Start kommunikasjon og setningene dine lagres her.',
    'history.replay': '▶ Spill av',
    'history.replaying': 'Spiller av…',

    // Login page
    'login.title': 'Velkommen tilbake',
    'login.subtitle': 'Logg inn for å fortsette til Snakke',
    'login.email': 'E-post',
    'login.password': 'Passord',
    'login.forgot': 'Glemt passord?',
    'login.submit': 'Logg inn',
    'login.submitting': 'Logger inn...',
    'login.noAccount': 'Har du ikke konto?',
    'login.signUp': 'Registrer deg',
    'login.backHome': '← Tilbake til forsiden',
    'login.error.invalid': 'Ugyldig e-post eller passord. Hvis du nettopp registrerte deg, sjekk innboksen for en bekreftelsese-post.',
    'login.error.generic': 'En feil oppstod. Prøv igjen.',
    'login.success.registered': 'Konto opprettet! Vennligst logg inn.',
    'login.success.verified': 'E-post bekreftet! Du kan nå logge inn.',
    'login.success.reset': 'Passord oppdatert! Du kan nå logge inn med ditt nye passord.',

    // Register page
    'register.title': 'Opprett konto',
    'register.subtitle': 'Bli med i Snakke for å kommunisere',
    'register.name': 'Fullt navn',
    'register.namePlaceholder': 'Ola Nordmann',
    'register.email': 'E-post',
    'register.role': 'Jeg er...',
    'register.role.child': 'Barn/Elev',
    'register.role.guardian': 'Forelder/Foresatt',
    'register.role.teacher': 'Lærer',
    'register.role.therapist': 'Terapeut',
    'register.password': 'Passord',
    'register.pw.contains': 'Passordet må inneholde:',
    'register.pw.length': 'Minst 8 tegn',
    'register.pw.uppercase': 'Én stor bokstav',
    'register.pw.lowercase': 'Én liten bokstav',
    'register.pw.number': 'Ett tall',
    'register.confirmPassword': 'Bekreft passord',
    'register.submit': 'Opprett konto',
    'register.submitting': 'Oppretter konto...',
    'register.hasAccount': 'Har du allerede konto?',
    'register.logIn': 'Logg inn',
    'register.backHome': '← Tilbake til forsiden',
    'register.error.failed': 'Registrering mislyktes',
    'register.error.fixBelow': 'Vennligst rett feilene nedenfor',
    'register.error.requirements': 'Sørg for at passordet oppfyller alle kravene',
    'register.validation.name': 'Navn må ha minst 2 tegn',
    'register.validation.passwords': 'Passordene stemmer ikke overens',

    // Forgot password page
    'forgotPw.title': 'Glemt passord?',
    'forgotPw.subtitle': 'Skriv inn e-posten din, så sender vi deg en tilbakestillingslenke.',
    'forgotPw.emailLabel': 'E-postadresse',
    'forgotPw.submit': 'Send tilbakestillingslenke',
    'forgotPw.submitting': 'Sender...',
    'forgotPw.backToLogin': '← Tilbake til innlogging',
    'forgotPw.success.title': 'Sjekk innboksen din',
    'forgotPw.success.sent': 'En lenke for tilbakestilling av passord er sendt til',
    'forgotPw.success.expires': 'Lenken utløper om 1 time.',
    'forgotPw.success.back': 'Tilbake til innlogging',
    'forgotPw.error.generic': 'Noe gikk galt. Prøv igjen.',
    'forgotPw.error.network': 'Nettverksfeil. Prøv igjen.',

    // Verify email page
    'verifyEmail.pending.title': 'Sjekk innboksen din',
    'verifyEmail.pending.sent': 'Vi sendte en bekreftelseslenke til',
    'verifyEmail.pending.desc': 'Klikk på lenken i e-posten for å aktivere kontoen. Lenken utløper om 24 timer.',
    'verifyEmail.pending.notReceived': 'Fikk du den ikke? Sjekk søppelpostmappen eller',
    'verifyEmail.pending.registerAgain': 'registrer deg på nytt',
    'verifyEmail.verifying.title': 'Bekrefter e-posten din…',
    'verifyEmail.verifying.wait': 'Vent litt.',
    'verifyEmail.success.title': 'E-post bekreftet!',
    'verifyEmail.success.desc': 'Kontoen din er nå aktiv. Du kan logge inn på Snakke.',
    'verifyEmail.success.cta': 'Logg inn',
    'verifyEmail.error.title': 'Bekreftelse mislyktes',
    'verifyEmail.error.cta': 'Registrer deg på nytt',

    // Reset password page
    'resetPw.title': 'Nytt passord',
    'resetPw.subtitle': 'Velg et sterkt passord for kontoen din.',
    'resetPw.newPassword': 'Nytt passord',
    'resetPw.confirmPassword': 'Bekreft passord',
    'resetPw.submit': 'Sett nytt passord',
    'resetPw.submitting': 'Lagrer…',
    'resetPw.error.mismatch': 'Passordene stemmer ikke overens.',
    'resetPw.error.requirements': 'Sørg for at passordet oppfyller alle kravene.',
    'resetPw.error.missingToken': 'Mangler tilbakestillingstoken. Bruk lenken fra e-posten din.',
    'resetPw.error.generic': 'Noe gikk galt. Prøv igjen.',
    'resetPw.error.network': 'Nettverksfeil. Prøv igjen.',
    'resetPw.invalidLink.title': 'Ugyldig lenke',
    'resetPw.invalidLink.desc': 'Denne tilbakestillingslenken mangler et token. Be om en ny.',
    'resetPw.requestNew': 'Be om ny lenke',

    // About page UI
    'about.badge': 'Bygget av Digital Ark AS',
    'about.title': 'Om Snakke',
    'about.subtitle': 'Snakke er en gratis, personvernfokusert AAC-app (Alternativ og supplerende kommunikasjon) som hjelper alle med tale- eller kommunikasjonsutfordringer å uttrykke seg — og gir terapeuter, lærere og forskere verktøyene de trenger.',
    'about.toc': 'Innhold',
    'about.contact.title': 'Kontakt',
    'about.contact.desc': 'Spørsmål om Snakke, forskningssamarbeid, tilgjengelighetsfeedback eller kommersiell lisensiering? Ta kontakt med teamet hos',
    'about.footer.home': 'Hjem',
    'about.footer.signUp': 'Registrer deg gratis',
    'about.footer.rights': '© 2026 Digital Ark AS. Alle rettigheter forbeholdt.',

    // Contact form
    'contact.yourName': 'Ditt navn',
    'contact.yourEmail': 'Din e-post',
    'contact.subject': 'Emne',
    'contact.message': 'Melding',
    'contact.submit': 'Send melding',
    'contact.submitting': 'Sender...',
    'contact.success.title': 'Melding sendt!',
    'contact.success.desc': 'Vi svarer deg på e-postadressen din. Takk for at du tok kontakt.',
    'contact.success.back': 'Send en ny melding',
    'contact.error.required': 'Vennligst fyll inn alle obligatoriske felt.',
    'contact.error.email': 'Vennligst skriv inn en gyldig e-postadresse.',
    'contact.error.messageShort': 'Meldingen må ha minst 10 tegn.',
    'contact.error.generic': 'Noe gikk galt. Prøv igjen.',
    'contact.sendsTo': 'Sendes til',
  },
  es: {
    // Icons - NEEDS
    'icon.eat': 'Comer', 'icon.drink': 'Beber', 'icon.water': 'Agua', 'icon.toilet': 'Baño',
    'icon.sleep': 'Dormir', 'icon.help': 'Ayuda', 'icon.medicine': 'Medicina',
    'icon.hungry': 'Hambriento', 'icon.thirsty': 'Sediento', 'icon.pain': 'Dolor',
    'icon.hot': 'Caliente', 'icon.cold': 'Frío', 'icon.want': 'Querer', 'icon.need': 'Necesitar',
    // Icons - ACTIONS
    'icon.play': 'Jugar', 'icon.walk': 'Caminar', 'icon.run': 'Correr', 'icon.sit': 'Sentarse',
    'icon.stand': 'Levantarse', 'icon.read': 'Leer', 'icon.write': 'Escribir', 'icon.draw': 'Dibujar',
    'icon.listen': 'Escuchar', 'icon.watch': 'Ver', 'icon.talk': 'Hablar', 'icon.sing': 'Cantar',
    'icon.dance': 'Bailar', 'icon.jump': 'Saltar', 'icon.do': 'Hacer', 'icon.make': 'Crear',
    'icon.wait': 'Esperar', 'icon.go': 'Ir', 'icon.stop': 'Parar',
    // Icons - FEELINGS
    'icon.happy': 'Feliz', 'icon.sad': 'Triste', 'icon.angry': 'Enojado', 'icon.scared': 'Asustado',
    'icon.excited': 'Emocionado', 'icon.tired': 'Cansado', 'icon.sick': 'Enfermo', 'icon.love': 'Amor',
    'icon.worried': 'Preocupado', 'icon.calm': 'Tranquilo', 'icon.proud': 'Orgulloso',
    'icon.surprised': 'Sorprendido', 'icon.like': 'Gustar',
    // Icons - PEOPLE
    'icon.mom': 'Mamá', 'icon.dad': 'Papá', 'icon.sister': 'Hermana', 'icon.brother': 'Hermano',
    'icon.grandma': 'Abuela', 'icon.grandpa': 'Abuelo', 'icon.friend': 'Amigo',
    'icon.teacher': 'Maestro', 'icon.doctor': 'Doctor', 'icon.baby': 'Bebé',
    'icon.family': 'Familia', 'icon.me': 'Yo',
    'icon.you': 'Tú', 'icon.they': 'Ellos',
    'icon.up': 'Arriba', 'icon.down': 'Abajo', 'icon.left': 'Izquierda', 'icon.right': 'Derecha',
    // Icons - PLACES
    'icon.home': 'Casa', 'icon.school': 'Escuela', 'icon.park': 'Parque', 'icon.hospital': 'Hospital',
    'icon.store': 'Tienda', 'icon.restaurant': 'Restaurante', 'icon.playground': 'Parque infantil',
    'icon.beach': 'Playa', 'icon.car': 'Coche', 'icon.bed': 'Cama', 'icon.bathroom': 'Baño',
    'icon.kitchen': 'Cocina',
    // Icons - CUSTOM
    'icon.apple': 'Manzana', 'icon.banana': 'Banana', 'icon.pizza': 'Pizza', 'icon.juice': 'Jugo',
    'icon.milk': 'Leche', 'icon.cookie': 'Galleta', 'icon.toy': 'Juguete', 'icon.book': 'Libro',
    'icon.ball': 'Pelota', 'icon.phone': 'Teléfono', 'icon.music': 'Música',
    'icon.yes': 'Sí', 'icon.no': 'No', 'icon.please': 'Por favor', 'icon.thankyou': 'Gracias',
  },
  fr: {
    // Icons - NEEDS
    'icon.eat': 'Manger', 'icon.drink': 'Boire', 'icon.water': 'Eau', 'icon.toilet': 'Toilettes',
    'icon.sleep': 'Dormir', 'icon.help': 'Aide', 'icon.medicine': 'Médicament',
    'icon.hungry': 'Faim', 'icon.thirsty': 'Soif', 'icon.pain': 'Douleur',
    'icon.hot': 'Chaud', 'icon.cold': 'Froid', 'icon.want': 'Vouloir', 'icon.need': 'Avoir besoin',
    // Icons - ACTIONS
    'icon.play': 'Jouer', 'icon.walk': 'Marcher', 'icon.run': 'Courir', 'icon.sit': "S'asseoir",
    'icon.stand': 'Se lever', 'icon.read': 'Lire', 'icon.write': 'Écrire', 'icon.draw': 'Dessiner',
    'icon.listen': 'Écouter', 'icon.watch': 'Regarder', 'icon.talk': 'Parler', 'icon.sing': 'Chanter',
    'icon.dance': 'Danser', 'icon.jump': 'Sauter', 'icon.do': 'Faire', 'icon.make': 'Créer',
    'icon.wait': 'Attendre', 'icon.go': 'Aller', 'icon.stop': 'Arrêter',
    // Icons - FEELINGS
    'icon.happy': 'Heureux', 'icon.sad': 'Triste', 'icon.angry': 'En colère', 'icon.scared': 'Effrayé',
    'icon.excited': 'Excité', 'icon.tired': 'Fatigué', 'icon.sick': 'Malade', 'icon.love': 'Amour',
    'icon.worried': 'Inquiet', 'icon.calm': 'Calme', 'icon.proud': 'Fier',
    'icon.surprised': 'Surpris', 'icon.like': 'Aimer',
    // Icons - PEOPLE
    'icon.mom': 'Maman', 'icon.dad': 'Papa', 'icon.sister': 'Sœur', 'icon.brother': 'Frère',
    'icon.grandma': 'Grand-mère', 'icon.grandpa': 'Grand-père', 'icon.friend': 'Ami',
    'icon.teacher': 'Professeur', 'icon.doctor': 'Médecin', 'icon.baby': 'Bébé',
    'icon.family': 'Famille', 'icon.me': 'Moi',
    'icon.you': 'Tu', 'icon.they': 'Ils',
    'icon.up': 'Haut', 'icon.down': 'Bas', 'icon.left': 'Gauche', 'icon.right': 'Droite',
    // Icons - PLACES
    'icon.home': 'Maison', 'icon.school': 'École', 'icon.park': 'Parc', 'icon.hospital': 'Hôpital',
    'icon.store': 'Magasin', 'icon.restaurant': 'Restaurant', 'icon.playground': 'Aire de jeux',
    'icon.beach': 'Plage', 'icon.car': 'Voiture', 'icon.bed': 'Lit', 'icon.bathroom': 'Salle de bain',
    'icon.kitchen': 'Cuisine',
    // Icons - CUSTOM
    'icon.apple': 'Pomme', 'icon.banana': 'Banane', 'icon.pizza': 'Pizza', 'icon.juice': 'Jus',
    'icon.milk': 'Lait', 'icon.cookie': 'Biscuit', 'icon.toy': 'Jouet', 'icon.book': 'Livre',
    'icon.ball': 'Ballon', 'icon.phone': 'Téléphone', 'icon.music': 'Musique',
    'icon.yes': 'Oui', 'icon.no': 'Non', 'icon.please': "S'il vous plaît", 'icon.thankyou': 'Merci',
  },
  de: {
    // Icons - NEEDS
    'icon.eat': 'Essen', 'icon.drink': 'Trinken', 'icon.water': 'Wasser', 'icon.toilet': 'Toilette',
    'icon.sleep': 'Schlafen', 'icon.help': 'Hilfe', 'icon.medicine': 'Medizin',
    'icon.hungry': 'Hungrig', 'icon.thirsty': 'Durstig', 'icon.pain': 'Schmerz',
    'icon.hot': 'Heiß', 'icon.cold': 'Kalt', 'icon.want': 'Wollen', 'icon.need': 'Brauchen',
    // Icons - ACTIONS
    'icon.play': 'Spielen', 'icon.walk': 'Gehen', 'icon.run': 'Laufen', 'icon.sit': 'Sitzen',
    'icon.stand': 'Stehen', 'icon.read': 'Lesen', 'icon.write': 'Schreiben', 'icon.draw': 'Zeichnen',
    'icon.listen': 'Zuhören', 'icon.watch': 'Schauen', 'icon.talk': 'Reden', 'icon.sing': 'Singen',
    'icon.dance': 'Tanzen', 'icon.jump': 'Springen', 'icon.do': 'Machen', 'icon.make': 'Erstellen',
    'icon.wait': 'Warten', 'icon.go': 'Gehen', 'icon.stop': 'Stoppen',
    // Icons - FEELINGS
    'icon.happy': 'Glücklich', 'icon.sad': 'Traurig', 'icon.angry': 'Wütend', 'icon.scared': 'Ängstlich',
    'icon.excited': 'Aufgeregt', 'icon.tired': 'Müde', 'icon.sick': 'Krank', 'icon.love': 'Liebe',
    'icon.worried': 'Besorgt', 'icon.calm': 'Ruhig', 'icon.proud': 'Stolz',
    'icon.surprised': 'Überrascht', 'icon.like': 'Mögen',
    // Icons - PEOPLE
    'icon.mom': 'Mama', 'icon.dad': 'Papa', 'icon.sister': 'Schwester', 'icon.brother': 'Bruder',
    'icon.grandma': 'Oma', 'icon.grandpa': 'Opa', 'icon.friend': 'Freund',
    'icon.teacher': 'Lehrer', 'icon.doctor': 'Arzt', 'icon.baby': 'Baby',
    'icon.family': 'Familie', 'icon.me': 'Ich',
    'icon.you': 'Du', 'icon.they': 'Sie',
    'icon.up': 'Oben', 'icon.down': 'Unten', 'icon.left': 'Links', 'icon.right': 'Rechts',
    // Icons - PLACES
    'icon.home': 'Zuhause', 'icon.school': 'Schule', 'icon.park': 'Park', 'icon.hospital': 'Krankenhaus',
    'icon.store': 'Geschäft', 'icon.restaurant': 'Restaurant', 'icon.playground': 'Spielplatz',
    'icon.beach': 'Strand', 'icon.car': 'Auto', 'icon.bed': 'Bett', 'icon.bathroom': 'Badezimmer',
    'icon.kitchen': 'Küche',
    // Icons - CUSTOM
    'icon.apple': 'Apfel', 'icon.banana': 'Banane', 'icon.pizza': 'Pizza', 'icon.juice': 'Saft',
    'icon.milk': 'Milch', 'icon.cookie': 'Keks', 'icon.toy': 'Spielzeug', 'icon.book': 'Buch',
    'icon.ball': 'Ball', 'icon.phone': 'Telefon', 'icon.music': 'Musik',
    'icon.yes': 'Ja', 'icon.no': 'Nein', 'icon.please': 'Bitte', 'icon.thankyou': 'Danke',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, getLanguageServerSnapshot);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    window.dispatchEvent(new Event(LANG_EVENT));
  };

  // Learn mode: learnFrom / learnTarget — lazy initialisation from localStorage (no effect needed)
  const [learnFrom, setLearnFromState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEYS.LEARN_FROM) as Language | null;
    return saved && saved in translations ? saved : 'en';
  });
  const [learnTarget, setLearnTargetState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'no';
    const saved = localStorage.getItem(STORAGE_KEYS.LEARN_TARGET) as Language | null;
    return saved && saved in translations ? saved : 'no';
  });

  const setLearnFrom = (lang: Language) => {
    setLearnFromState(lang);
    localStorage.setItem(STORAGE_KEYS.LEARN_FROM, lang);
  };

  const setLearnTarget = (lang: Language) => {
    setLearnTargetState(lang);
    localStorage.setItem(STORAGE_KEYS.LEARN_TARGET, lang);
  };

  const swapLearnLanguages = () => {
    setLearnFrom(learnTarget);
    setLearnTarget(learnFrom);
  };

  // Sync HTML lang attribute with current language for accessibility
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const tLang = (key: string, lang: Language): string => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  const tIcon = (iconId: string): string => {
    return translations[language]?.[`icon.${iconId}`] || iconId;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tIcon, tLang, learnFrom, learnTarget, setLearnFrom, setLearnTarget, swapLearnLanguages }}>
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
