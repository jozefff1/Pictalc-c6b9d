"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
  Apple, Activity, Smile, Users, Home, 
  Utensils, Coffee, Bath, Moon, Pill, HelpCircle,
  Gamepad2, Footprints, BookOpen, Pencil, Ear, Tv,
  Frown, Angry, Meh, User, School, Stethoscope,
  TreePine, Store, Hospital, Trash2, Volume2, Save
} from 'lucide-react';

const categories = [
  { id: 'needs', name: 'Needs', icon: Apple },
  { id: 'actions', name: 'Actions', icon: Activity },
  { id: 'feelings', name: 'Feelings', icon: Smile },
  { id: 'people', name: 'People', icon: Users },
  { id: 'places', name: 'Places', icon: Home },
];

interface IconItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface IconsData {
  [category: string]: IconItem[];
}

const iconsData: IconsData = {
  needs: [
    { id: 'eat', name: 'Eat', icon: Utensils },
    { id: 'drink', name: 'Drink', icon: Coffee },
    { id: 'toilet', name: 'Toilet', icon: Bath },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'medicine', name: 'Medicine', icon: Pill },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ],
  actions: [
    { id: 'play', name: 'Play', icon: Gamepad2 },
    { id: 'walk', name: 'Walk', icon: Footprints },
    { id: 'read', name: 'Read', icon: BookOpen },
    { id: 'draw', name: 'Draw', icon: Pencil },
    { id: 'listen', name: 'Listen', icon: Ear },
    { id: 'watch', name: 'Watch', icon: Tv },
  ],
  feelings: [
    { id: 'happy', name: 'Happy', icon: Smile },
    { id: 'sad', name: 'Sad', icon: Frown },
    { id: 'angry', name: 'Angry', icon: Angry },
    { id: 'tired', name: 'Tired', icon: Meh },
    { id: 'scared', name: 'Scared', icon: Frown }, // Using frown as placeholder
    { id: 'excited', name: 'Excited', icon: Smile },
  ],
  people: [
    { id: 'mom', name: 'Mom', icon: User },
    { id: 'dad', name: 'Dad', icon: User },
    { id: 'friend', name: 'Friend', icon: Users },
    { id: 'teacher', name: 'Teacher', icon: School },
    { id: 'doctor', name: 'Doctor', icon: Stethoscope },
    { id: 'family', name: 'Family', icon: Users },
  ],
  places: [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'school', name: 'School', icon: School },
    { id: 'park', name: 'Park', icon: TreePine },
    { id: 'store', name: 'Store', icon: Store },
    { id: 'hospital', name: 'Hospital', icon: Hospital },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
  ],
};

export default function CommunicateScreen() {
  const [selectedCategory, setSelectedCategory] = useState('needs');
  const [sentence, setSentence] = useState<IconItem[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(20);
      else if (type === 'heavy') navigator.vibrate([30, 50, 30]);
    }
  };

  const speakSentence = () => {
    if (sentence.length === 0 || !('speechSynthesis' in window)) return;
    
    const text = sentence.map(item => item.name).join(' ');
    setSpeaking(true);
    triggerHaptic('medium');
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  };

  const addToSentence = (item: IconItem) => {
    setSentence([...sentence, item]);
    triggerHaptic('light');
  };

  const removeFromSentence = (index: number) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
    triggerHaptic('medium');
  };

  const clearSentence = () => {
    setSentence([]);
    triggerHaptic('heavy');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundMesh} />
      
      {/* Sentence Builder */}
      <div className={styles.sentenceContainerWrapper}>
        <div className={`glass ${styles.sentenceContainer}`}>
          {sentence.length > 0 ? (
            <div className={styles.sentenceScrollContent}>
              {sentence.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={`${item.id}-${index}`} 
                    onClick={() => removeFromSentence(index)}
                    className={`${styles.sentenceItem} ${styles[`categoryBgLight_${selectedCategory}`]}`}
                  >
                    <Icon size={28} className={styles[`categoryText_${selectedCategory}`]} />
                    <span className={styles.sentenceItemText}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptySentence}>
              <span className={styles.emptySentenceText}>
                Tap icons to build your sentence
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sentence Actions */}
      <div className={styles.sentenceActions}>
        <button 
          onClick={clearSentence} 
          disabled={sentence.length === 0}
          className={`glass ${styles.actionIconButton}`}
        >
          <Trash2 size={26} color={sentence.length === 0 ? 'var(--text-muted)' : 'var(--color-error)'} />
        </button>
        
        <button 
          onClick={speakSentence} 
          disabled={sentence.length === 0} 
          className={`${styles.speakButton} ${sentence.length === 0 ? styles.disabledButton : speaking ? styles.speakingButton : styles.activeButton}`}
        >
          <Volume2 size={28} color={sentence.length === 0 ? 'var(--text-muted)' : '#FFF'} />
          <span style={{ color: sentence.length === 0 ? 'var(--text-muted)' : '#FFF' }}>
            {speaking ? "Speaking..." : "Speak"}
          </span>
        </button>
        
        <button 
          disabled={sentence.length === 0}
          className={`glass ${styles.actionIconButton}`}
        >
          <Save size={26} color={sentence.length === 0 ? 'var(--text-muted)' : 'var(--color-success)'} />
        </button>
      </div>

      {/* Categories */}
      <div className={styles.categoriesContainer}>
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                triggerHaptic('light');
              }}
              className={`${styles.categoryButton} ${isSelected ? styles[`categoryBg_${category.id}`] : 'glass'}`}
              style={{
                color: isSelected ? '#FFF' : `var(--color-${category.id})`
              }}
            >
              <Icon size={20} />
              <span style={{ color: isSelected ? '#FFF' : 'var(--text-dark)', fontWeight: isSelected ? '700' : '600' }}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Icons Grid */}
      <div className={styles.iconsContainer}>
        {iconsData[selectedCategory].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={styles.iconButtonWrapper}>
              <button onClick={() => addToSentence(item)} className={styles.tactileButton}>
                <div className={styles.iconKey}>
                  <div className={styles.iconKeyInner}>
                    <div className={`${styles.iconCircle} ${styles[`categoryBgLight_${selectedCategory}`]}`}>
                      <Icon size={38} className={styles[`categoryText_${selectedCategory}`]} />
                    </div>
                    <span className={styles.iconText}>{item.name}</span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
