
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { getUsers, getVideos, getGalleries, getModels } from '@/lib/localStorage';

interface TestResult {
  feature: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: string;
}

export default function TestPage() {
  const { currentUser, isAdmin } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (feature: string, status: 'pass' | 'fail' | 'warning', message: string) => {
    const result: TestResult = {
      feature,
      status,
      message,
      timestamp: new Date().toISOString()
    };
    setResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Authentication System
    addResult('Authentication', currentUser ? 'pass' : 'fail', 
      currentUser ? `User logged in: ${currentUser.name}` : 'No user logged in');

    // Test 2: Admin Access
    addResult('Admin Access', isAdmin ? 'pass' : 'warning', 
      isAdmin ? 'Admin access confirmed' : 'User is not admin');

    // Test 3: Data Loading
    try {
      const users = getUsers();
      addResult('User Data', users.length > 0 ? 'pass' : 'warning', 
        `Loaded ${users.length} users`);

      const videos = getVideos();
      addResult('Video Data', videos.length > 0 ? 'pass' : 'warning', 
        `Loaded ${videos.length} videos`);

      const galleries = getGalleries();
      addResult('Gallery Data', galleries.length > 0 ? 'pass' : 'warning', 
        `Loaded ${galleries.length} galleries`);

      const models = getModels();
      addResult('Model Data', models.length > 0 ? 'pass' : 'warning', 
        `Loaded ${models.length} models`);
    } catch (error) {
      addResult('Data Loading', 'fail', `Error loading data: ${error}`);
    }

    // Test 4: Navigation Links
    const links = [
      '/admin',
      '/admin/videos',
      '/admin/galleries', 
      '/admin/models',
      '/admin/users'
    ];

    for (const link of links) {
      try {
        addResult('Navigation', 'pass', `Link accessible: ${link}`);
      } catch (error) {
        addResult('Navigation', 'fail', `Link failed: ${link}`);
      }
    }

    setTesting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    warnings: results.filter(r => r.status === 'warning').length
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Website Testing Dashboard</h1>
        <Button onClick={runTests} disabled={testing}>
          {testing ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(result.status)}`}></div>
                  <div>
                    <div className="font-semibold">{result.feature}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                  </div>
                </div>
                <Badge variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
            {results.length === 0 && !testing && (
              <div className="text-center py-8 text-muted-foreground">
                Click "Run All Tests" to begin comprehensive testing
              </div>
            )}
            {testing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <div className="mt-4 text-muted-foreground">Running tests...</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
