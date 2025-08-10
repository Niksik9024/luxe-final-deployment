
import type { ModelProfileWithImages } from './hero-sample-data';

export const getModelProfiles = (): ModelProfileWithImages[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('modelProfiles');
  return stored ? JSON.parse(stored) : [];
};

export const setModelProfiles = (profiles: ModelProfileWithImages[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('modelProfiles', JSON.stringify(profiles));
};

export const getModelProfileById = (id: string): ModelProfileWithImages | null => {
  const profiles = getModelProfiles();
  return profiles.find(profile => profile.id === id) || null;
};

export const getRandomModelProfile = (): ModelProfileWithImages | null => {
  const profiles = getModelProfiles();
  if (profiles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * profiles.length);
  return profiles[randomIndex];
};

export const saveModelProfile = (profile: ModelProfileWithImages) => {
  const profiles = getModelProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  setModelProfiles(profiles);
};

export const deleteModelProfile = (id: string) => {
  const profiles = getModelProfiles();
  const filtered = profiles.filter(profile => profile.id !== id);
  setModelProfiles(filtered);
};
