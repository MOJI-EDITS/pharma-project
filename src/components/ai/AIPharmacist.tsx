'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, ShoppingCart } from 'lucide-react';
import { productsData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/cartStore';
import { IProduct } from '@/lib/types/Product';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  products?: IProduct[];
}

export default function AIPharmacist() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Pharmacist. How can I help you today? Describe your symptoms or ask about a product.",
      sender: 'ai',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = (text: string): IProduct[] => {
    const lowerText = text.toLowerCase();
    const recommendations: IProduct[] = [];

    if (lowerText.includes('headache') || lowerText.includes('pain') || lowerText.includes('fever')) {
      const painRelievers = productsData.filter(p => 
        p.category === 'Pain Relief' || p.name.includes('Aspirin') || p.name.includes('Ibuprofen')
      );
      recommendations.push(...painRelievers);
    }

    if (lowerText.includes('infection') || lowerText.includes('bacteria') || lowerText.includes('throat')) {
      const antibiotics = productsData.filter(p => p.category === 'Antibiotics');
      recommendations.push(...antibiotics);
    }

    if (lowerText.includes('allergy') || lowerText.includes('sneeze') || lowerText.includes('runny') || lowerText.includes('itch')) {
      const allergyMeds = productsData.filter(p => p.category === 'Allergy');
      recommendations.push(...allergyMeds);
    }

    // Deduplicate recommendations
    return Array.from(new Set(recommendations));
  };

  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      if (response.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'AI service unavailable');
      }
    } catch {
      const recommendedProducts = analyzeSymptoms(userMessage.text);
      let aiText = '';

      if (recommendedProducts.length > 0) {
        aiText = `Based on your symptoms, I recommend the following products. Please consult with a doctor if symptoms persist.`;
      } else {
        aiText = "I'm not sure which product to recommend for those symptoms. Please consult a healthcare professional for advice.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        products: recommendedProducts.length > 0 ? recommendedProducts : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-40 ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">AI Pharmacist</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>

                {/* Product Recommendations */}
                {msg.products && (
                  <div className="mt-2 space-y-2 w-full max-w-[90%]">
                    {msg.products.map((product) => (
                      <div
                        key={product._id.toString()}
                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">Rs{product.price}</p>
                        </div>
                        <button
                          onClick={() => addItem({
                            id: product._id.toString(),
                            name: product.name,
                            price: product.price,
                            strength: product.strength,
                            form: product.form,
                            isPrescription: product.isPrescription
                          })}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your symptoms..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThinking ? 'Thinking…' : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
