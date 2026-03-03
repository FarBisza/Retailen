import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface LiveChatDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
}

interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    time: string;
}

const AUTO_RESPONSES: Record<string, string> = {
    'account': 'To reactivate your account, please provide your registered email address and we\'ll send you a reactivation link within 24 hours.',
    'block': 'If your account has been blocked, this may be due to suspicious activity. Please provide your account email and our team will review it within 1-2 business days.',
    'order': 'You can track your order status in My Purchases. If you have issues, please provide your order number and we\'ll investigate.',
    'return': 'To initiate a return, go to My Purchases → select the order → click "Return". Returns are accepted within 30 days of delivery.',
    'payment': 'We accept credit/debit cards, PayPal, Apple Pay, and bank transfers. If your payment failed, please try again or use a different method.',
    'shipping': 'Standard delivery takes 3-14 business days. Orders over $500 qualify for free shipping. Otherwise, shipping costs $29.99.',
    'help': 'I can help with:\n• Account issues & reactivation\n• Order tracking\n• Returns & refunds\n• Payment problems\n• Shipping information\n\nJust type your question!',
};

const getAutoResponse = (message: string): string => {
    const lower = message.toLowerCase();
    for (const [keyword, response] of Object.entries(AUTO_RESPONSES)) {
        if (lower.includes(keyword)) return response;
    }
    return 'Thank you for your message. A support agent will review your inquiry shortly. In the meantime, try asking about: account, order, return, payment, or shipping.';
};

const getTimeString = (): string => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({ isOpen, onClose, userName }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            text: `Hello${userName ? ` ${userName}` : ''}! 👋 Welcome to Retailen Support.\n\nHow can I help you today? You can ask about:\n• Account issues & reactivation\n• Order tracking\n• Returns & refunds\n• Payment or shipping`,
            sender: 'bot',
            time: getTimeString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: ChatMessage = {
            id: Date.now(),
            text,
            sender: 'user',
            time: getTimeString(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: Date.now() + 1,
                text: getAutoResponse(text),
                sender: 'bot',
                time: getTimeString(),
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 1200);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[130] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[140] shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Retailen Support</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'bot' ? 'bg-slate-900 text-white' : 'bg-blue-500 text-white'}`}>
                                    {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <div>
                                    <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${msg.sender === 'bot'
                                        ? 'bg-white border border-gray-100 text-slate-700 rounded-tl-sm shadow-sm'
                                        : 'bg-slate-900 text-white rounded-tr-sm'}`}>
                                        {msg.text}
                                    </div>
                                    <span className={`text-[10px] text-gray-400 mt-1 block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-2 items-end">
                                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                    <Bot size={14} />
                                </div>
                                <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick actions */}
                <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                    {['Account issue', 'Track order', 'Return item', 'Shipping info'].map((q) => (
                        <button
                            key={q}
                            onClick={() => { setInput(q); }}
                            className="px-3 py-1.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors uppercase tracking-wider"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${input.trim()
                                ? 'bg-slate-900 text-white hover:bg-black shadow-lg'
                                : 'bg-gray-100 text-gray-300'}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveChatDrawer;
