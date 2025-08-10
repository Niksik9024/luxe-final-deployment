
interface ModelProfile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ModelImage {
  id: string;
  modelProfileId: string;
  imageType: 'background' | 'main' | 'carousel';
  imagePosition: number | null; // 1-10 for carousel
  imageUrl: string;
  createdAt: Date;
}

interface ModelProfileWithImages extends ModelProfile {
  images: ModelImage[];
}

export const sampleModelData: ModelProfileWithImages = {
  id: 'sample-1',
  name: 'Sophia Martinez',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  images: [
    {
      id: 'img-1',
      modelProfileId: 'sample-1',
      imageType: 'background',
      imagePosition: null,
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600',
      createdAt: new Date()
    },
    {
      id: 'img-2',
      modelProfileId: 'sample-1',
      imageType: 'main',
      imagePosition: null,
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c0763c87?w=800',
      createdAt: new Date()
    },
    {
      id: 'img-3',
      modelProfileId: 'sample-1',
      imageType: 'carousel',
      imagePosition: 1,
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      createdAt: new Date()
    },
    {
      id: 'img-4',
      modelProfileId: 'sample-1',
      imageType: 'carousel',
      imagePosition: 2,
      imageUrl: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400',
      createdAt: new Date()
    },
    {
      id: 'img-5',
      modelProfileId: 'sample-1',
      imageType: 'carousel',
      imagePosition: 3,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      createdAt: new Date()
    },
    {
      id: 'img-6',
      modelProfileId: 'sample-1',
      imageType: 'carousel',
      imagePosition: 4,
      imageUrl: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
      createdAt: new Date()
    },
    {
      id: 'img-7',
      modelProfileId: 'sample-1',
      imageType: 'carousel',
      imagePosition: 5,
      imageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400',
      createdAt: new Date()
    }
  ]
};

export type { ModelProfileWithImages, ModelProfile, ModelImage };
