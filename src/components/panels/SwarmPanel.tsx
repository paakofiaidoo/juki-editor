import React, { useState } from "react";
import { Send, Bot, User, Sparkles, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { engineClient } from "../../lib/client";
import { useApp } from "../../hooks/useApp";

interface SwarmStep {
    id: string;
    description: string;
    status: string;
}

export const SwarmPanel = () => {
    const { activeProject, openModal } = useApp();
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>([
        { role: "system", content: "Welcome to the Juki Swarm. I am the Manager Agent. Describe your goal, and I will break it down for my worker agents." },
    ]);
    const [plan, setPlan] = useState<SwarmStep[]>([]);
    const [logs, setLogs] = useState<{ stepId: string; message: string; level: string }[]>([]);

    if (!activeProject?.apiKey) {
        return (
            <div className="flex flex-col h-full bg-juki-dark-2 items-center justify-center p-6 text-center">
                <div className="bg-juki-dark-3 p-6 rounded-lg border border-juki-dark-1 max-w-md">
                    <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Key Required</h3>
                    <p className="text-gray-400 text-sm mb-6">To use the Swarm Multi-Agent System, you need to configure your Gemini API Key in the project settings.</p>
                    <button onClick={() => openModal({ type: "SETTINGS" })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:brightness-110 transition-colors w-full">
                        Open Settings
                    </button>
                </div>
            </div>
        );
    }

    const handleSend = async () => {
        if (!prompt.trim() || !activeProject?.id) return;

        const userPrompt = prompt;
        setMessages((prev) => [...prev, { role: "user", content: userPrompt }]);
        setPrompt("");
        setIsLoading(true);
        setPlan([]);
        setLogs([]);

        try {
            const stream = engineClient.runSwarm({ projectId: activeProject.id, prompt: userPrompt });

            for await (const res of stream) {
                switch (res.event.case) {
                    case "plan":
                        if (res.event.value) {
                            const plan = res.event.value;
                            setPlan(plan.steps.map((s) => ({ id: s.id, description: s.description, status: s.status })));
                            setMessages((prev) => [...prev, { role: "assistant", content: "I have created a plan. Executing now..." }]);
                        }
                        break;
                    case "log":
                        if (res.event.value) {
                            const log = res.event.value;
                            setLogs((prev) => [...prev, { stepId: log.stepId, message: log.message, level: log.level }]);

                            if (log.message.startsWith("Starting")) {
                                setPlan((prev) => prev.map((s) => (s.id === log.stepId ? { ...s, status: "running" } : s)));
                            } else if (log.message === "Done.") {
                                setPlan((prev) => prev.map((s) => (s.id === log.stepId ? { ...s, status: "completed" } : s)));
                            }
                        }
                        break;
                    case "result":
                        if (res.event.value) {
                            const result = res.event.value;
                            setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
                        }
                        break;
                }
            }
        } catch (e) {
            console.error(e);
            setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${(e as Error).message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-juki-dark-2">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-purple-600"}`}>
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-lg text-sm max-w-[85%] ${msg.role === "user" ? "bg-blue-600/20 text-blue-100" : "bg-purple-600/20 text-purple-100"}`}>{msg.content}</div>
                    </div>
                ))}

                {plan.length > 0 && (
                    <div className="bg-juki-dark-3 rounded-lg p-4 border border-juki-dark-1">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                            <Sparkles size={14} className="text-yellow-400" /> Execution Plan
                        </h3>
                        <div className="space-y-2">
                            {plan.map((step) => (
                                <div key={step.id} className="flex items-start gap-2 text-sm">
                                    <div className="mt-0.5">
                                        {step.status === "completed" ? (
                                            <CheckCircle2 size={14} className="text-green-400" />
                                        ) : step.status === "running" ? (
                                            <Loader2 size={14} className="text-blue-400 animate-spin" />
                                        ) : (
                                            <Circle size={14} className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-gray-300 ${step.status === "completed" ? "line-through opacity-50" : ""}`}>{step.description}</div>
                                        {step.status === "running" && <div className="text-xs text-gray-500 mt-1 font-mono">{logs.filter((l) => l.stepId === step.id).slice(-1)[0]?.message}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-juki-dark-3">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Describe your goal..."
                        disabled={isLoading}
                        className="w-full bg-juki-dark-3 text-white rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm disabled:opacity-50"
                        rows={3}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="absolute bottom-3 right-3 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
