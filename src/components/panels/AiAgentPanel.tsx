import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useApp } from '../../hooks/useApp';
import { parseJsxToCanvasItem } from '../../utils/jsxParser';
import { Bot, User, SendHorizonal, PlusCircle } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const isLikelyJsx = (text: string): boolean => {
    const trimmed = text.trim();
    return trimmed.startsWith('<') && trimmed.endsWith('>') && trimmed.includes('</');
};

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-juki-dark mt-2 p-2 rounded text-xs text-juki-green font-mono whitespace-pre-wrap overflow-x-auto">
        <code>{code}</code>
    </pre>
);

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const { addItemsToPage, activePageId } = useApp();
    const isJsx = message.role === 'model' && isLikelyJsx(message.text);

    const handleAddToCanvas = () => {
        if (!activePageId) {
            alert("Please select a page first.");
            return;
        }
        try {
            const item = parseJsxToCanvasItem(message.text);
            addItemsToPage([item]);
        } catch (e) {
            alert(`Failed to add component to canvas: ${(e as Error).message}`);
        }
    };
    
    return (
        <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'model' && <Bot className="text-juki-green w-6 h-6 shrink-0 mt-1" />}
            <div
                className={`max-w-md px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user' ? 'bg-juki-green text-black' : 'bg-juki-dark-3 text-white'
                }`}
            >
                {isJsx ? (
                    <div>
                        <p>Here's the JSX for you. You can add it to your page.</p>
                        <CodeBlock code={message.text} />
                        <button 
                            onClick={handleAddToCanvas} 
                            disabled={!activePageId}
                            className="flex items-center gap-2 w-full mt-2 text-xs bg-juki-dark text-white font-bold p-2 rounded hover:bg-juki-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle size={14} /> Add to Canvas
                        </button>
                    </div>
                ) : (
                    message.text.split('\n').map((line, i) => <p key={i}>{line}</p>)
                )}
            </div>
             {message.role === 'user' && <User className="text-juki-green w-6 h-6 shrink-0 mt-1" />}
        </div>
    );
};


export const AiAgentPanel = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { activePageId } = useApp();
    const apiKey = process.env.API_KEY;

    useEffect(() => {
        if (apiKey && !chat) {
            const ai = new GoogleGenAI({ apiKey });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: {
                    systemInstruction: `You are Juki, an expert React and TailwindCSS developer acting as an AI assistant within a visual UI editor. Your primary function is to generate JSX code snippets based on user requests.
- When a user asks for a UI component, generate a single, clean block of JSX code using standard HTML tags and TailwindCSS.
- The generated JSX MUST have a single root element.
- Do NOT wrap your response in markdown backticks like \`\`\`jsx. Output ONLY the raw JSX code.
- If the user's request is ambiguous or lacks detail, you MUST ask one or two clarifying questions before generating the code.
- If the user provides feedback on a previously generated component, generate a NEW, updated JSX block that incorporates the feedback.
- Keep your conversational text very brief and to the point. Your main output should be code.`,
                },
            });
            setChat(chatSession);
             setMessages([
                { id: crypto.randomUUID(), role: 'model', text: "Hello! Describe a UI component you'd like me to build." }
            ]);
        }
    }, [chat, apiKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chat.sendMessageStream({ message: input });
            let currentText = '';
            
            const modelMessageId = crypto.randomUUID();
            setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

            for await (const chunk of result) {
                currentText += chunk.text;
                setMessages(prev => prev.map(m => 
                    m.id === modelMessageId ? { ...m, text: currentText } : m
                ));
            }
        } catch (error) {
            console.error("Gemini chat error:", error);
            setMessages(prev => [
                ...prev,
                { id: crypto.randomUUID(), role: 'model', text: `Sorry, I encountered an error: ${(error as Error).message}` }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKey) {
        return <p className="p-4 text-xs text-center text-gray-500">API_KEY not configured. AI features are disabled.</p>;
    }

    return (
        <div className="flex flex-col h-full bg-juki-dark">
            <div className="flex-1 p-3 overflow-y-auto space-y-4">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {isLoading && (
                     <div className="flex gap-3 justify-start">
                         <Bot className="text-juki-green w-6 h-6 shrink-0 mt-1" />
                        <div className="max-w-xs px-3 py-2 rounded-lg text-sm bg-juki-dark-3 text-white flex items-center gap-1">
                            <span className="animate-pulse">.</span><span className="animate-pulse delay-100">.</span><span className="animate-pulse delay-200">.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-juki-dark-3 shrink-0">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={activePageId ? "e.g., a login form with a bright blue button" : "Select a page to begin..."}
                        rows={3}
                        className="w-full bg-juki-dark-3 p-2 pr-10 rounded border border-juki-dark-3 focus:outline-none focus:ring-1 focus:ring-juki-green text-white text-sm resize-none"
                        disabled={isLoading || !activePageId}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim() || !activePageId}
                        className="absolute bottom-2.5 right-2.5 text-gray-400 hover:text-juki-green disabled:text-gray-600 disabled:cursor-not-allowed"
                        title="Send Message"
                    >
                        <SendHorizonal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};