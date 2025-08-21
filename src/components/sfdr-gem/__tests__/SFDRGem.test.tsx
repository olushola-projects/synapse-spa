import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SFDRGem } from '../SFDRGem';

// Mock dependencies
vi.mock('@/services/sfdrService', () => ({
  classifyFund: vi.fn(),
  getClassifications: vi.fn(),
  getClassificationHistory: vi.fn()
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

describe('SFDRGem Component', () => {
  const _mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to render SFDRGem with proper Tabs context
  const renderSFDRGem = () => {
    return render(
      <Tabs defaultValue='chat'>
        <TabsList>
          <TabsTrigger value='chat'>Chat</TabsTrigger>
          <TabsTrigger value='classification'>Classification</TabsTrigger>
          <TabsTrigger value='documents'>Documents</TabsTrigger>
        </TabsList>
        <TabsContent value='chat'>
          <SFDRGem />
        </TabsContent>
        <TabsContent value='classification'>
          <SFDRGem />
        </TabsContent>
        <TabsContent value='documents'>
          <SFDRGem />
        </TabsContent>
      </Tabs>
    );
  };

  describe('Component Rendering', () => {
    it('should render SFDRGem component correctly', () => {
      renderSFDRGem();

      // Check for main component elements
      expect(screen.getByText(/SFDR GEM/i)).toBeInTheDocument();
      expect(screen.getByText(/AI-powered SFDR compliance assistant/i)).toBeInTheDocument();
    });

    it('should display chat interface', () => {
      renderSFDRGem();

      // Check for chat elements
      expect(screen.getByPlaceholderText(/Ask about SFDR compliance/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should show document upload functionality', () => {
      renderSFDRGem();

      // Check for document upload elements
      expect(screen.getByText(/Upload Documents/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    });
  });

  describe('Chat Functionality', () => {
    it('should allow typing in chat input', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      await user.type(chatInput, 'What is Article 8?');

      expect(chatInput).toHaveValue('What is Article 8?');
    });

    it('should handle sending chat messages', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(chatInput, 'What is Article 8?');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('What is Article 8?')).toBeInTheDocument();
      });
    });

    it('should display AI responses', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(chatInput, 'What is Article 8?');
      await user.click(sendButton);

      await waitFor(
        () => {
          expect(
            screen.getByText(/Article 8 funds promote environmental or social characteristics/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Document Upload', () => {
    it('should handle document upload', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      await user.click(uploadButton);

      // Check for file input (hidden)
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toBeInTheDocument();
    });

    it('should show upload progress', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      await user.click(uploadButton);

      // Simulate file selection
      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/Analyzing document/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle chat errors gracefully', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Mock a network error
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await user.type(chatInput, 'Test message');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
      });
    });

    it('should validate empty chat input', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      // Should not send empty message
      expect(screen.queryByText(/Sorry, I encountered an error/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderSFDRGem();

      expect(screen.getByLabelText(/Chat input/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Send message/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Upload documents/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      chatInput.focus();

      await user.type(chatInput, 'Test message');
      await user.keyboard('{Tab}');

      expect(screen.getByRole('button', { name: /send/i })).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('should handle rapid message sending', async () => {
      const user = userEvent.setup();
      renderSFDRGem();

      const chatInput = screen.getByPlaceholderText(/Ask about SFDR compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Send multiple messages quickly
      for (let i = 0; i < 3; i++) {
        await user.clear(chatInput);
        await user.type(chatInput, `Message ${i + 1}`);
        await user.click(sendButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Message 3')).toBeInTheDocument();
      });
    });
  });
});
