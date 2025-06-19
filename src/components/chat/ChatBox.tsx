
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Send, Bot } from 'lucide-react';
import { chatAPI } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

interface Message {
  _id: string;
  content: string;
  role: string;
  createdAt: Date;
}

const ChatBox = ({ isOpen, onClose, clientId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      query: inputText,
      type: 'personal',
      clientId: clientId,
    }
    setIsLoading(true);
    setInputText('');

    setMessages(prev => [...prev, {
      _id: Math.random().toString(),
      content: newMessage.query,
      role: 'consultant',
      createdAt: new Date(),
    }, {
      _id: Math.random().toString(),
      content: 'Loading...',
      role: 'assistant',
      createdAt: new Date(),
    }]);

    const response = await chatAPI.sendMessage(newMessage);
    console.log(response);
    setMessages(response.messages);
    setIsLoading(false);
  };

  const fetchChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory(clientId);
      setMessages(response.data);
      console.log(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    scrollToBottom(); 
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 w-1/3 z-50">
      <Card className="h-full flex flex-col bg-slate-900 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            MapleAI Chat
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-hide chat-container">
          <div className="flex-1 space-y-4 mb-4">
            {messages.length > 0 && messages?.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-sm px-3 py-2 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-gray-700 text-white border border-gray-600'
                      : 'bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  <p className="text-xs mt-1 opacity-70">
                    {/* {message?.createdAt?.toLocaleTimeString()} */}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-black border border-slate-900 font-bold"
            />
            <Button type="submit" size="sm" disabled={isLoading} className='border border-slate-500'>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBox;
