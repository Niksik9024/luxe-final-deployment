
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/lib/use-toast';
import { 
  getModels, 
  getVideos, 
  getGalleries, 
  addModel, 
  addVideo, 
  addGallery,
  updateModel, 
  updateVideo, 
  updateGallery,
  deleteModel, 
  deleteVideo, 
  deleteGallery 
} from '@/lib/localStorage';
import { Model, Video, Gallery } from '@/lib/types';
import { Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  operation: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  time?: number;
}

export function CRUDTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runCRUDTests = async () => {
    setIsRunning(true);
    clearResults();

    try {
      // Test Models CRUD
      await testModelsCRUD();
      
      // Test Videos CRUD
      await testVideosCRUD();
      
      // Test Galleries CRUD
      await testGalleriesCRUD();

      toast({
        title: "CRUD Tests Complete",
        description: "All CRUD operations have been tested",
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Some tests failed to complete",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testModelsCRUD = async () => {
    const startTime = Date.now();
    
    try {
      // CREATE
      const testModel: Model = {
        id: 'test-model-' + Date.now(),
        name: 'Test Model',
        image: 'https://via.placeholder.com/300x400',
        description: 'Test model for CRUD operations',
        height: '5\'8"',
        bust: '34B',
        waist: '24"',
        hips: '36"',
        famousFor: 'Testing purposes'
      };

      addModel(testModel);
      addTestResult({
        operation: 'Models CREATE',
        status: 'success',
        message: 'Successfully created test model',
        time: Date.now() - startTime
      });

      // READ
      const models = getModels();
      const createdModel = models.find(m => m.id === testModel.id);
      if (createdModel) {
        addTestResult({
          operation: 'Models READ',
          status: 'success',
          message: `Successfully retrieved model: ${createdModel.name}`,
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Model not found after creation');
      }

      // UPDATE
      updateModel(testModel.id, { description: 'Updated test model description' });
      const updatedModels = getModels();
      const updatedModel = updatedModels.find(m => m.id === testModel.id);
      if (updatedModel?.description === 'Updated test model description') {
        addTestResult({
          operation: 'Models UPDATE',
          status: 'success',
          message: 'Successfully updated model description',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Model update failed');
      }

      // DELETE
      deleteModel(testModel.id);
      const finalModels = getModels();
      if (!finalModels.find(m => m.id === testModel.id)) {
        addTestResult({
          operation: 'Models DELETE',
          status: 'success',
          message: 'Successfully deleted test model',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Model deletion failed');
      }

    } catch (error) {
      addTestResult({
        operation: 'Models CRUD',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        time: Date.now() - startTime
      });
    }
  };

  const testVideosCRUD = async () => {
    const startTime = Date.now();
    
    try {
      // CREATE
      const testVideo: Video = {
        id: 'test-video-' + Date.now(),
        title: 'Test Video',
        description: 'Test video for CRUD operations',
        image: 'https://via.placeholder.com/400x300',
        videoUrl: 'https://via.placeholder.com/video.mp4',
        models: ['Test Model'],
        tags: ['test', 'crud'],
        keywords: ['test', 'video'],
        date: new Date().toISOString(),
        status: 'Published' as const,
        duration: 120,
        resolution: '1080p',
        category: 'Test'
      };

      addVideo(testVideo);
      addTestResult({
        operation: 'Videos CREATE',
        status: 'success',
        message: 'Successfully created test video',
        time: Date.now() - startTime
      });

      // READ
      const videos = getVideos();
      const createdVideo = videos.find(v => v.id === testVideo.id);
      if (createdVideo) {
        addTestResult({
          operation: 'Videos READ',
          status: 'success',
          message: `Successfully retrieved video: ${createdVideo.title}`,
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Video not found after creation');
      }

      // UPDATE
      updateVideo(testVideo.id, { description: 'Updated test video description' });
      const updatedVideos = getVideos();
      const updatedVideo = updatedVideos.find(v => v.id === testVideo.id);
      if (updatedVideo?.description === 'Updated test video description') {
        addTestResult({
          operation: 'Videos UPDATE',
          status: 'success',
          message: 'Successfully updated video description',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Video update failed');
      }

      // DELETE
      deleteVideo(testVideo.id);
      const finalVideos = getVideos();
      if (!finalVideos.find(v => v.id === testVideo.id)) {
        addTestResult({
          operation: 'Videos DELETE',
          status: 'success',
          message: 'Successfully deleted test video',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Video deletion failed');
      }

    } catch (error) {
      addTestResult({
        operation: 'Videos CRUD',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        time: Date.now() - startTime
      });
    }
  };

  const testGalleriesCRUD = async () => {
    const startTime = Date.now();
    
    try {
      // CREATE
      const testGallery: Gallery = {
        id: 'test-gallery-' + Date.now(),
        title: 'Test Gallery',
        description: 'Test gallery for CRUD operations',
        image: 'https://via.placeholder.com/400x300',
        album: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x301'],
        models: ['Test Model'],
        tags: ['test', 'crud'],
        keywords: ['test', 'gallery'],
        date: new Date().toISOString(),
        status: 'Published' as const,
        resolution: '1080p',
        category: 'Test'
      };

      addGallery(testGallery);
      addTestResult({
        operation: 'Galleries CREATE',
        status: 'success',
        message: 'Successfully created test gallery',
        time: Date.now() - startTime
      });

      // READ
      const galleries = getGalleries();
      const createdGallery = galleries.find(g => g.id === testGallery.id);
      if (createdGallery) {
        addTestResult({
          operation: 'Galleries READ',
          status: 'success',
          message: `Successfully retrieved gallery: ${createdGallery.title}`,
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Gallery not found after creation');
      }

      // UPDATE
      updateGallery(testGallery.id, { description: 'Updated test gallery description' });
      const updatedGalleries = getGalleries();
      const updatedGallery = updatedGalleries.find(g => g.id === testGallery.id);
      if (updatedGallery?.description === 'Updated test gallery description') {
        addTestResult({
          operation: 'Galleries UPDATE',
          status: 'success',
          message: 'Successfully updated gallery description',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Gallery update failed');
      }

      // DELETE
      deleteGallery(testGallery.id);
      const finalGalleries = getGalleries();
      if (!finalGalleries.find(g => g.id === testGallery.id)) {
        addTestResult({
          operation: 'Galleries DELETE',
          status: 'success',
          message: 'Successfully deleted test gallery',
          time: Date.now() - startTime
        });
      } else {
        throw new Error('Gallery deletion failed');
      }

    } catch (error) {
      addTestResult({
        operation: 'Galleries CRUD',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        time: Date.now() - startTime
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            CRUD Operations Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runCRUDTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run CRUD Tests'}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No test results yet. Click "Run CRUD Tests" to start testing.
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.operation}</p>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.time && (
                        <span className="text-xs text-muted-foreground">
                          {result.time}ms
                        </span>
                      )}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">What this tests:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>CREATE:</strong> Adds new models, videos, and galleries</li>
              <li>• <strong>READ:</strong> Retrieves and verifies created content</li>
              <li>• <strong>UPDATE:</strong> Modifies existing content</li>
              <li>• <strong>DELETE:</strong> Removes content and verifies deletion</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
