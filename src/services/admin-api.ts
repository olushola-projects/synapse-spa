import { ApiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';

export interface VectorStore {
  id: string;
  name: string;
  status: string;
  fileCount: number;
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface VectorStoreDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface CreateVectorStoreRequest {
  name: string;
  metadata?: Record<string, any>;
}

export interface UploadDocumentsRequest {
  vectorStoreId: string;
  documents: VectorStoreDocument[];
}

export interface UploadResponse {
  success: boolean;
  uploadedCount: number;
  fileIds: string[];
  errors?: string[];
}

export interface VectorStoreFile {
  id: string;
  status: string;
  createdAt: number;
  lastError?: any;
}

export interface AdminDashboardStats {
  vectorStores: {
    total: number;
    totalFiles: number;
  };
}

export class AdminApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  // Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return this.apiClient.get<AdminDashboardStats>(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD);
  }

  // Vector Store Management
  async getVectorStores(): Promise<VectorStore[]> {
    return this.apiClient.get<VectorStore[]>(API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORES);
  }

  async getVectorStore(id: string): Promise<VectorStore> {
    return this.apiClient.get<VectorStore>(`${API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORES}/${id}`);
  }

  async createVectorStore(request: CreateVectorStoreRequest): Promise<VectorStore> {
    return this.apiClient.post<VectorStore>(API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORES, request);
  }

  async deleteVectorStore(id: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORES}/${id}`
    );
  }

  async uploadDocuments(request: UploadDocumentsRequest): Promise<UploadResponse> {
    return this.apiClient.post<UploadResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORE_UPLOAD,
      request
    );
  }

  async uploadJsonFile(vectorStoreId: string, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiClient.postFormData<UploadResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORE_JSON_UPLOAD(vectorStoreId),
      formData
    );
  }

  async getVectorStoreFiles(vectorStoreId: string): Promise<VectorStoreFile[]> {
    return this.apiClient.get<VectorStoreFile[]>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORE_FILES(vectorStoreId)
    );
  }

  async removeFileFromVectorStore(storeId: string, fileId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORE_REMOVE_FILE(storeId, fileId)
    );
  }

  async searchVectorStore(vectorStoreId: string, query: string): Promise<any[]> {
    return this.apiClient.post<any[]>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_STORE_SEARCH(vectorStoreId),
      { query }
    );
  }
}

export const adminApiService = new AdminApiService();
