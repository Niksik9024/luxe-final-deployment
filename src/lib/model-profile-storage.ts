import type { ModelProfileWithImages, ModelImage } from './hero-sample-data';

// Assuming getGalleries is defined elsewhere and returns an array of gallery objects
// For demonstration purposes, let's define a placeholder here if it's not globally available
// In a real scenario, this would likely be imported from another file or context.
declare function getGalleries(): { id: string; models?: { id: string }[]; images: { id: string; url: string }[] }[];


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

export const saveModelProfile = (profileData: any): ModelProfileWithImages => {
  const profiles = getModelProfiles();

  const newProfile: ModelProfileWithImages = {
    id: Date.now().toString(),
    name: profileData.name,
    description: profileData.description || null,
    category: profileData.category,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: []
  };

  // Add background image
  if (profileData.backgroundImage) {
    newProfile.images.push({
      id: `bg-${Date.now()}`,
      modelProfileId: newProfile.id,
      imageType: 'background',
      imagePosition: null,
      imageUrl: profileData.backgroundImage,
      createdAt: new Date()
    });
  }

  // Add main image
  if (profileData.mainImage) {
    newProfile.images.push({
      id: `main-${Date.now()}`,
      modelProfileId: newProfile.id,
      imageType: 'main',
      imagePosition: null,
      imageUrl: profileData.mainImage,
      createdAt: new Date()
    });
  }

  // Add carousel images
  profileData.carouselImages?.forEach((carouselImg: any, index: number) => {
    if (carouselImg.url) {
      newProfile.images.push({
        id: `carousel-${Date.now()}-${index}`,
        modelProfileId: newProfile.id,
        imageType: 'carousel',
        imagePosition: carouselImg.position || (index + 1),
        imageUrl: carouselImg.url,
        createdAt: new Date()
      });
    }
  });

  profiles.push(newProfile);
  setModelProfiles(profiles);

  return newProfile;
};

export const updateModelProfile = (id: string, profileData: any): ModelProfileWithImages | null => {
  const profiles = getModelProfiles();
  const profileIndex = profiles.findIndex(profile => profile.id === id);

  if (profileIndex === -1) return null;

  const existingProfile = profiles[profileIndex];

  const updatedProfile: ModelProfileWithImages = {
    ...existingProfile,
    name: profileData.name,
    description: profileData.description || null,
    category: profileData.category,
    updatedAt: new Date(),
    images: []
  };

  // Add background image
  if (profileData.backgroundImage) {
    updatedProfile.images.push({
      id: `bg-${Date.now()}`,
      modelProfileId: updatedProfile.id,
      imageType: 'background',
      imagePosition: null,
      imageUrl: profileData.backgroundImage,
      createdAt: new Date()
    });
  }

  // Add main image
  if (profileData.mainImage) {
    updatedProfile.images.push({
      id: `main-${Date.now()}`,
      modelProfileId: updatedProfile.id,
      imageType: 'main',
      imagePosition: null,
      imageUrl: profileData.mainImage,
      createdAt: new Date()
    });
  }

  // Add carousel images
  profileData.carouselImages?.forEach((carouselImg: any, index: number) => {
    if (carouselImg.url) {
      updatedProfile.images.push({
        id: `carousel-${Date.now()}-${index}`,
        modelProfileId: updatedProfile.id,
        imageType: 'carousel',
        imagePosition: carouselImg.position || (index + 1),
        imageUrl: carouselImg.url,
        createdAt: new Date()
      });
    }
  });

  profiles[profileIndex] = updatedProfile;
  setModelProfiles(profiles);

  return updatedProfile;
};

export const populateCarouselFromGallery = (modelId: string): ModelImage[] => {
  // Get the model's gallery images
  const galleries = getGalleries();
  const modelGalleries = galleries.filter(gallery => 
    gallery.models && gallery.models.some(model => model.id === modelId)
  );

  const carouselImages: ModelImage[] = [];
  let position = 1;

  // Extract up to 10 images from the model's galleries
  for (const gallery of modelGalleries) {
    for (const image of gallery.images) {
      if (position > 10) break;

      carouselImages.push({
        id: `carousel-${gallery.id}-${image.id}`,
        modelProfileId: modelId,
        imageType: 'carousel',
        imagePosition: position,
        imageUrl: image.url,
        createdAt: new Date()
      });
      position++;
    }
    if (position > 10) break;
  }

  return carouselImages;
};

export const deleteModelProfile = (id: string) => {
  const profiles = getModelProfiles();
  const filtered = profiles.filter(profile => profile.id !== id);
  setModelProfiles(filtered);
};