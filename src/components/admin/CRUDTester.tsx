
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/lib/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Video,
  ImageIcon,
  Users,
  RefreshCw
} from 'lucide-react';
import {
  getVideos,
  getGalleries,
  getModels,
  createVideo,
  createGallery,
  createModel,
  updateVideo,
  updateGallery,
  updateModel,
  deleteVideo,
  deleteGallery,
  deleteModel
} from '@/lib/localStorage';
import { Video, Gallery, Model } from '@/lib/types';

interface TestResult {
  operation: string;
  entity: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export function CRUDTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('test');
  const { toast } = useToast();

  // Test data
  const testVideo = {
    title: 'Test Video CRUD',
    description: 'This is a test video for CRUD operations',
    url: 'https://example.com/test-video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1587502537104-605039215763?q=80&w=400&h=300&auto=format&fit=crop',
    duration: '5:30',
    modelId: 'test-model-id',
    status: 'Published' as const,
    isFeatured: false,
    tags: ['test', 'crud'],
    date: new Date().toISOString()
  };

  const testGallery = {
    title: 'Test Gallery CRUD',
    description: 'This is a test gallery for CRUD operations',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=400&h=600&auto=format&fit=crop',
        alt: 'Test image 1'
      }
    ],
    modelId: 'test-model-id',
    status: 'Published' as const,
    tags: ['test', 'crud'],
    date: new Date().toISOString()
  };

  const testModel = {
    name: 'Test Model CRUD',
    description: 'This is a test model for CRUD operations',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=400&h=600&auto=format&fit=crop',
    status: 'Active' as const,
    isFeatured: false,
    stats: {
      videos: 0,
      galleries: 0,
      likes: 0
    }
  };

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runAllTests = async () => {
    setLoading(true);
    clearResults();
    
    try {
      // Test Videos CRUD
      await testVideoCRUD();
      // Test Galleries CRUD
      await testGalleryCRUD();
      // Test Models CRUD
      await testModelCRUD();
      // Test Read Operations
      await testReadOperations();
      
      toast({
        title: "CRUD Testing Complete",
        description: "All CRUD operations have been tested",
      });
    } catch (error) {
      toast({
        title: "Testing Error",
        description: "An error occurred during testing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testVideoCRUD = async () => {
    try {
      // CREATE
      const createdVideo = createVideo(testVideo);
      addTestResult({
        operation: 'CREATE',
        entity: 'Video',
        status: 'success',
        message: `Video created with ID: ${createdVideo.id}`,
        data: createdVideo
      });

      // READ
      const videos = getVideos();
      const foundVideo = videos.find(v => v.id === createdVideo.id);
      if (foundVideo) {
        addTestResult({
          operation: 'READ',
          entity: 'Video',
          status: 'success',
          message: `Video found: ${foundVideo.title}`,
          data: foundVideo
        });
      }

      // UPDATE
      const updatedVideoData = { ...createdVideo, title: 'Updated Test Video CRUD' };
      const updatedVideo = updateVideo(createdVideo.id, updatedVideoData);
      if (updatedVideo) {
        addTestResult({
          operation: 'UPDATE',
          entity: 'Video',
          status: 'success',
          message: `Video updated: ${updatedVideo.title}`,
          data: updatedVideo
        });
      }

      // DELETE
      const deleted = deleteVideo(createdVideo.id);
      if (deleted) {
        addTestResult({
          operation: 'DELETE',
          entity: 'Video',
          status: 'success',
          message: `Video deleted successfully`,
        });
      }

    } catch (error) {
      addTestResult({
        operation: 'CRUD',
        entity: 'Video',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testGalleryCRUD = async () => {
    try {
      // CREATE
      const createdGallery = createGallery(testGallery);
      addTestResult({
        operation: 'CREATE',
        entity: 'Gallery',
        status: 'success',
        message: `Gallery created with ID: ${createdGallery.id}`,
        data: createdGallery
      });

      // READ
      const galleries = getGalleries();
      const foundGallery = galleries.find(g => g.id === createdGallery.id);
      if (foundGallery) {
        addTestResult({
          operation: 'READ',
          entity: 'Gallery',
          status: 'success',
          message: `Gallery found: ${foundGallery.title}`,
          data: foundGallery
        });
      }

      // UPDATE
      const updatedGalleryData = { ...createdGallery, title: 'Updated Test Gallery CRUD' };
      const updatedGallery = updateGallery(createdGallery.id, updatedGalleryData);
      if (updatedGallery) {
        addTestResult({
          operation: 'UPDATE',
          entity: 'Gallery',
          status: 'success',
          message: `Gallery updated: ${updatedGallery.title}`,
          data: updatedGallery
        });
      }

      // DELETE
      const deleted = deleteGallery(createdGallery.id);
      if (deleted) {
        addTestResult({
          operation: 'DELETE',
          entity: 'Gallery',
          status: 'success',
          message: `Gallery deleted successfully`,
        });
      }

    } catch (error) {
      addTestResult({
        operation: 'CRUD',
        entity: 'Gallery',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testModelCRUD = async () => {
    try {
      // CREATE
      const createdModel = createModel(testModel);
      addTestResult({
        operation: 'CREATE',
        entity: 'Model',
        status: 'success',
        message: `Model created with ID: ${createdModel.id}`,
        data: createdModel
      });

      // READ
      const models = getModels();
      const foundModel = models.find(m => m.id === createdModel.id);
      if (foundModel) {
        addTestResult({
          operation: 'READ',
          entity: 'Model',
          status: 'success',
          message: `Model found: ${foundModel.name}`,
          data: foundModel
        });
      }

      // UPDATE
      const updatedModelData = { ...createdModel, name: 'Updated Test Model CRUD' };
      const updatedModel = updateModel(createdModel.id, updatedModelData);
      if (updatedModel) {
        addTestResult({
          operation: 'UPDATE',
          entity: 'Model',
          status: 'success',
          message: `Model updated: ${updatedModel.name}`,
          data: updatedModel
        });
      }

      // DELETE
      const deleted = deleteModel(createdModel.id);
      if (deleted) {
        addTestResult({
          operation: 'DELETE',
          entity: 'Model',
          status: 'success',
          message: `Model deleted successfully`,
        });
      }

    } catch (error) {
      addTestResult({
        operation: 'CRUD',
        entity: 'Model',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testReadOperations = async () => {
    try {
      const videos = getVideos();
      const galleries = getGalleries();
      const models = getModels();

      addTestResult({
        operation: 'READ_ALL',
        entity: 'Videos',
        status: 'success',
        message: `Found ${videos.length} videos in storage`,
        data: { count: videos.length }
      });

      addTestResult({
        operation: 'READ_ALL',
        entity: 'Galleries',
        status: 'success',
        message: `Found ${galleries.length} galleries in storage`,
        data: { count: galleries.length }
      });

      addTestResult({
        operation: 'READ_ALL',
        entity: 'Models',
        status: 'success',
        message: `Found ${models.length} models in storage`,
        data: { count: models.length }
      });
    } catch (error) {
      addTestResult({
        operation: 'READ_ALL',
        entity: 'All',
        status: 'error',
        message: `Error reading data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">CRUD Testing</h1>
          <p className="text-muted-foreground">Test all Create, Read, Update, Delete operations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={runAllTests} 
            disabled={loading}
            className="w-full sm:w-auto touch-manipulation"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearResults}
            className="w-full sm:w-auto touch-manipulation"
          >
            Clear Results
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test">Test Results</TabsTrigger>
          <TabsTrigger value="manual">Manual Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Test Results ({testResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {testResults.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No test results yet. Click "Run All Tests" to start testing.
                </div>
              ) : (
                <div className="space-y-2 p-6 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {result.operation}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.entity}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                          {result.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="h-5 w-5" />
                  Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start touch-manipulation"
                  onClick={() => testVideoCRUD()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Test Video CRUD
                </Button>
                <div className="text-sm text-muted-foreground">
                  Tests create, read, update, delete operations for videos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5" />
                  Galleries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start touch-manipulation"
                  onClick={() => testGalleryCRUD()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Test Gallery CRUD
                </Button>
                <div className="text-sm text-muted-foreground">
                  Tests create, read, update, delete operations for galleries
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start touch-manipulation"
                  onClick={() => testModelCRUD()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Test Model CRUD
                </Button>
                <div className="text-sm text-muted-foreground">
                  Tests create, read, update, delete operations for models
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
