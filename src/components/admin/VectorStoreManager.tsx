import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Upload, Trash2, Database, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import {
  adminApiService,
  type VectorStore,
  type VectorStoreFile,
  type CreateVectorStoreRequest,
  type VectorStoreDocument
} from '@/services/admin-api';

export const VectorStoreManager: React.FC = () => {
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<VectorStore | null>(null);
  const [files, setFiles] = useState<VectorStoreFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);

  // Form states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeMetadata, setStoreMetadata] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [jsonDocuments, setJsonDocuments] = useState('');

  useEffect(() => {
    loadVectorStores();
  }, []);

  const loadVectorStores = async () => {
    setLoading(true);
    try {
      const stores = await adminApiService.getVectorStores();
      setVectorStores(stores);
    } catch (error) {
      toast.error('Failed to load vector stores');
      console.error('Error loading vector stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (storeId: string) => {
    setFilesLoading(true);
    try {
      const storeFiles = await adminApiService.getVectorStoreFiles(storeId);
      setFiles(storeFiles);
    } catch (error) {
      toast.error('Failed to load vector store files');
      console.error('Error loading files:', error);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      toast.error('Store name is required');
      return;
    }

    try {
      let metadata: Record<string, any> | undefined;
      if (storeMetadata.trim()) {
        try {
          metadata = JSON.parse(storeMetadata);
        } catch {
          toast.error('Invalid metadata JSON format');
          return;
        }
      }

      const request: CreateVectorStoreRequest = {
        name: storeName,
        metadata
      };

      const newStore = await adminApiService.createVectorStore(request);
      setVectorStores([...vectorStores, newStore]);
      setCreateDialogOpen(false);
      setStoreName('');
      setStoreMetadata('');
      toast.success('Vector store created successfully');
    } catch (error) {
      toast.error('Failed to create vector store');
      console.error('Error creating store:', error);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      await adminApiService.deleteVectorStore(storeId);
      setVectorStores(vectorStores.filter(store => store.id !== storeId));
      if (selectedStore?.id === storeId) {
        setSelectedStore(null);
        setFiles([]);
      }
      toast.success('Vector store deleted successfully');
    } catch (error) {
      toast.error('Failed to delete vector store');
      console.error('Error deleting store:', error);
    }
  };

  const handleUploadJson = async () => {
    if (!selectedStore) {
      toast.error('Please select a vector store');
      return;
    }

    if (!uploadFile && !jsonDocuments.trim()) {
      toast.error('Please select a JSON file or provide JSON content');
      return;
    }

    try {
      let result;

      if (uploadFile) {
        result = await adminApiService.uploadJsonFile(selectedStore.id, uploadFile);
      } else {
        // Parse JSON documents and upload
        const documents: VectorStoreDocument[] = JSON.parse(jsonDocuments);
        result = await adminApiService.uploadDocuments({
          vectorStoreId: selectedStore.id,
          documents
        });
      }

      if (result.success) {
        toast.success(`Successfully uploaded ${result.uploadedCount} documents`);
        loadFiles(selectedStore.id);
        loadVectorStores(); // Refresh to update file counts
      } else {
        toast.error('Upload failed');
      }

      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => toast.error(error));
      }

      setUploadDialogOpen(false);
      setUploadFile(null);
      setJsonDocuments('');
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        toast.error('Failed to upload documents');
      }
      console.error('Error uploading documents:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast.error('Please select a JSON file');
        return;
      }
      setUploadFile(file);
      setJsonDocuments(''); // Clear text input when file is selected
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Vector Store Manager</h1>
          <p className='text-muted-foreground'>Manage OpenAI vector stores and upload documents</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={loadVectorStores} variant='outline' disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Create Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vector Store</DialogTitle>
                <DialogDescription>
                  Create a new OpenAI vector store for document storage
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='storeName'>Store Name</Label>
                  <Input
                    id='storeName'
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder='Enter store name'
                  />
                </div>
                <div>
                  <Label htmlFor='storeMetadata'>Metadata (Optional JSON)</Label>
                  <Textarea
                    id='storeMetadata'
                    value={storeMetadata}
                    onChange={e => setStoreMetadata(e.target.value)}
                    placeholder='{"category": "documents", "department": "compliance"}'
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStore}>Create Store</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='stores' className='w-full'>
        <TabsList>
          <TabsTrigger value='stores'>Vector Stores</TabsTrigger>
          {selectedStore && <TabsTrigger value='files'>Files ({selectedStore.name})</TabsTrigger>}
        </TabsList>

        <TabsContent value='stores' className='space-y-4'>
          {loading ? (
            <div className='flex justify-center py-8'>
              <RefreshCw className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {vectorStores.map(store => (
                <Card key={store.id} className='cursor-pointer hover:shadow-md transition-shadow'>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='text-lg'>{store.name}</CardTitle>
                        <CardDescription>ID: {store.id}</CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(store.status)}>{store.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <FileText className='h-4 w-4 mr-2' />
                        {store.fileCount} files
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Created: {formatDate(store.createdAt)}
                      </div>
                      {store.metadata && Object.keys(store.metadata).length > 0 && (
                        <div className='text-sm'>
                          <Badge variant='secondary'>Has Metadata</Badge>
                        </div>
                      )}
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setSelectedStore(store);
                          loadFiles(store.id);
                        }}
                      >
                        <Database className='h-4 w-4 mr-1' />
                        View Files
                      </Button>
                      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size='sm' onClick={() => setSelectedStore(store)}>
                            <Upload className='h-4 w-4 mr-1' />
                            Upload
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>Upload Documents</DialogTitle>
                            <DialogDescription>Upload documents to {store.name}</DialogDescription>
                          </DialogHeader>
                          <div className='space-y-4'>
                            <div>
                              <Label htmlFor='jsonFile'>Upload JSON File</Label>
                              <Input
                                id='jsonFile'
                                type='file'
                                accept='.json'
                                onChange={handleFileUpload}
                              />
                              <p className='text-sm text-muted-foreground mt-1'>
                                JSON file with array of documents:{' '}
                                {`[{"id": "doc1", "content": "...", "metadata": {...}}, ...]`}
                              </p>
                            </div>
                            <div className='text-center text-muted-foreground'>OR</div>
                            <div>
                              <Label htmlFor='jsonContent'>Paste JSON Content</Label>
                              <Textarea
                                id='jsonContent'
                                value={jsonDocuments}
                                onChange={e => {
                                  setJsonDocuments(e.target.value);
                                  setUploadFile(null); // Clear file when typing
                                }}
                                placeholder={`[
  {
    "id": "doc1",
    "content": "Document content here...",
    "metadata": {
      "title": "Sample Document",
      "category": "policy"
    }
  }
]`}
                                rows={10}
                                className='font-mono text-sm'
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant='outline' onClick={() => setUploadDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUploadJson}>
                              <Upload className='h-4 w-4 mr-2' />
                              Upload Documents
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size='sm' variant='destructive'>
                            <Trash2 className='h-4 w-4 mr-1' />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Vector Store</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{store.name}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStore(store.id)}
                              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && vectorStores.length === 0 && (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Database className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold mb-2'>No Vector Stores</h3>
                <p className='text-muted-foreground text-center mb-4'>
                  Create your first vector store to get started with document storage
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Vector Store
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {selectedStore && (
          <TabsContent value='files' className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Files in {selectedStore.name}</h2>
              <Button
                onClick={() => loadFiles(selectedStore.id)}
                variant='outline'
                disabled={filesLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${filesLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {filesLoading ? (
              <div className='flex justify-center py-8'>
                <RefreshCw className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='space-y-2'>
                {files.map(file => (
                  <Card key={file.id}>
                    <CardContent className='flex justify-between items-center py-4'>
                      <div className='flex items-center space-x-4'>
                        <FileText className='h-5 w-5 text-muted-foreground' />
                        <div>
                          <p className='font-medium'>{file.id}</p>
                          <p className='text-sm text-muted-foreground'>
                            Created: {formatDate(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Badge className={getStatusBadgeColor(file.status)}>{file.status}</Badge>
                        {file.lastError && (
                          <Badge variant='destructive'>
                            <AlertCircle className='h-3 w-3 mr-1' />
                            Error
                          </Badge>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size='sm' variant='destructive'>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this file from the vector store?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await adminApiService.removeFileFromVectorStore(
                                      selectedStore.id,
                                      file.id
                                    );
                                    loadFiles(selectedStore.id);
                                    toast.success('File removed successfully');
                                  } catch (error) {
                                    console.error('Error removing file:', error);
                                    toast.error('Failed to remove file');
                                  }
                                }}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {files.length === 0 && (
                  <Card>
                    <CardContent className='flex flex-col items-center justify-center py-12'>
                      <FileText className='h-12 w-12 text-muted-foreground mb-4' />
                      <h3 className='text-lg font-semibold mb-2'>No Files</h3>
                      <p className='text-muted-foreground text-center'>
                        This vector store is empty. Upload some documents to get started.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
