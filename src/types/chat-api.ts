// Types matching the ai-chat-backend DTOs and interfaces

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool'
}

export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum ThreadStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export interface ChatMessage {
  id: string;
  threadId: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  metadata?: Record<string, any>;
  attachments?: MessageAttachment[];
  toolCalls?: ToolCall[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  status: ThreadStatus;
  metadata?: Record<string, any>;
  messageCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  metadata?: Record<string, any>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
}

// DTOs matching backend
export interface CreateThreadDto {
  userId: string;
  title: string;
  metadata?: Record<string, any>;
}

export interface CreateMessageDto {
  threadId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  attachments?: File[];
}

export enum ExpertType {
  GENERAL = 'general',
  SOFTWARE_ENGINEER = 'software-engineer',
  DATA_SCIENTIST = 'data-scientist',
  BUSINESS_ANALYST = 'business-analyst',
  PRODUCT_MANAGER = 'product-manager',
  MARKETING_SPECIALIST = 'marketing-specialist',
  FINANCIAL_ADVISOR = 'financial-advisor',
  HEALTHCARE_PROFESSIONAL = 'healthcare-professional',
  LEGAL_ADVISOR = 'legal-advisor',
  CREATIVE_WRITER = 'creative-writer',
  TECHNICAL_WRITER = 'technical-writer',
  CUSTOMER_SUPPORT = 'customer-support',
  SFDR_EXPERT = 'sfdr-expert'
}

export interface ChatRequestDto {
  threadId: string;
  content: string;
  expertType?: ExpertType;
  systemInstructions?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  attachments?: File[];
}

// Streaming response types
export interface StreamChunk {
  type: 'message' | 'finished' | 'error' | 'thinking' | 'tool_call';
  data: any;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Chat context and memory types
export interface UserMemory {
  id: string;
  userId: string;
  facts: Record<string, any>;
  preferences: Record<string, any>;
  conversationHistory: string[];
  lastUpdated: Date;
}

export interface AvailableTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: string;
}
