'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, ShoppingCart, Upload, Pill } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { IProduct } from '@/lib/types/Product';
import { MedicineInfo } from '@/lib/medicines-database';
import SymptomInput from './SymptomInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  products?: IProduct[];
  medicines?: MedicineInfo[];
  recommendations?: Array<{medicine: MedicineInfo; matchScore: number; reasoning: string; precautions: string[]}>;
}

interface DetailedRecommendation {
  medicine: MedicineInfo;
  matchScore: number;
  reasoning: string;
  precautions: string[];
}

export default function AIPharmacist() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'symptoms'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Pharmacist. You can ask me about medicines, upload a prescription, or describe your symptoms for AI-powered medicine recommendations.",
      sender: 'ai',
    },
  ]);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [showPrescriptionInput, setShowPrescriptionInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demo, read text files or show a message for image files
    if (file.type.startsWith('text/')) {
      const text = await file.text();
      setPrescriptionText(text);
    } else if (file.type.startsWith('image/')) {
      setPrescriptionText(`[Prescription uploaded: ${file.name}]\n(In a real scenario, this would be processed with OCR)`);
    } else if (file.type === 'application/pdf') {
      setPrescriptionText(`[PDF Prescription uploaded: ${file.name}]\n(In a real scenario, this would be processed)`);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setErrorMessage(null);

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
        body: JSON.stringify({
          prompt: input,
          prescriptionData: prescriptionText,
        }),
      });
      const data = await response.json();

      if (response.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          products: data.products && data.products.length > 0 ? data.products : undefined,
        };
        setMessages(prev => [...prev, aiMessage]);
        setPrescriptionText('');
        setShowPrescriptionInput(false);
      } else {
        throw new Error(data.error || 'AI service unavailable');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'AI service unavailable';
      setErrorMessage(errorMsg);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm unable to process your request at the moment. Please try describing your symptoms or uploading your prescription again.",
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSymptomRecommendation = async (symptoms: string[], severity: 'mild' | 'moderate' | 'severe', duration: string) => {
    setIsThinking(true);
    setErrorMessage(null);
    setMode('chat');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Symptoms: ${symptoms.join(', ')} (${severity}, ${duration})`,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          severity,
          duration,
        }),
      });

      const data = await response.json();

      if (response.ok && data.recommendations) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          recommendations: data.recommendations,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'AI service unavailable';
      setErrorMessage(errorMsg);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm unable to process your symptoms at the moment. Please try again later or consult a healthcare professional.",
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
        <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
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

          {/* Messages - Chat Mode */}
          {mode === 'chat' && (
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
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2 w-full max-w-[95%]">
                    <p className="text-xs font-semibold text-gray-600 px-2">Recommended Products:</p>
                    {msg.products.map((product) => (
                      <div
                        key={product._id.toString()}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.genericName}</p>
                            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {product.strength}
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {product.form}
                              </span>
                            </div>
                            <p className="font-bold text-green-600 mt-2">Rs{product.price}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                Rs{product.originalPrice}
                              </p>
                            )}
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
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Medicine Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2 w-full max-w-[95%]">
                    <p className="text-xs font-semibold text-gray-600 px-2">🔬 AI-Recommended Medicines:</p>
                    {msg.recommendations.slice(0, 3).map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-gray-900">{rec.medicine.name}</p>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                {rec.matchScore.toFixed(0)}% Match
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{rec.medicine.genericName}</p>
                            <p className="text-xs text-gray-700 mb-2 font-medium">{rec.reasoning}</p>
                            <div className="flex gap-2 mb-2 text-xs">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                {rec.medicine.strength}
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                {rec.medicine.form}
                              </span>
                            </div>
                            <p className="font-bold text-green-600">Rs{rec.medicine.price}</p>
                            {rec.medicine.isPrescriptionOnly && (
                              <p className="text-xs text-red-600 mt-1">⚠️ Prescription Required</p>
                            )}
                          </div>
                          <button
                            onClick={() => addItem({
                              id: rec.medicine.id,
                              name: rec.medicine.name,
                              price: rec.medicine.price,
                              strength: rec.medicine.strength,
                              form: rec.medicine.form,
                              isPrescription: rec.medicine.isPrescriptionOnly
                            })}
                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          )}

          {/* Symptom Input Mode */}
          {mode === 'symptoms' && !isThinking && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <SymptomInput onSubmit={handleSymptomRecommendation} isLoading={isThinking} />
              <button
                onClick={() => setMode('chat')}
                className="mt-4 w-full px-3 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition-colors"
              >
                Back to Chat
              </button>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="px-4 py-2 bg-white border-b border-gray-200 flex gap-2">
            <button
              onClick={() => setMode('chat')}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                mode === 'chat'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setMode('symptoms')}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                mode === 'symptoms'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Pill className="w-4 h-4 inline mr-1" />
              Symptoms
            </button>
          </div>

          {/* Prescription Input Area */}
          {showPrescriptionInput && mode === 'chat' && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => setShowPrescriptionInput(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
              {prescriptionText && (
                <div className="text-xs bg-white p-2 rounded border border-gray-300 max-h-20 overflow-y-auto">
                  <strong>Prescription Data:</strong>
                  <p className="mt-1 text-gray-700">{prescriptionText.substring(0, 100)}...</p>
                </div>
              )}
            </div>
          )}

          {/* Input - Chat Mode Only */}
          {mode === 'chat' && (
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            {errorMessage && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {errorMessage}
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowPrescriptionInput(!showPrescriptionInput)}
                className={`p-2 rounded-md text-sm font-medium transition-colors ${
                  showPrescriptionInput
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Upload or paste prescription"
              >
                <Upload className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600">
                {prescriptionText ? '✓ Prescription attached' : 'Attach prescription'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThinking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
}
