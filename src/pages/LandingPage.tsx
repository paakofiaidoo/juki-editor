import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { engineClient } from "@/lib/client";
import { BreathingBackground } from "@/components/BreathingBackground";
import { useApp } from "@/hooks/useApp";
import { geminiService } from "@/lib/gemini";
import { ArrowRight, Box, Code, Layers, Zap, Layout, GitBranch, Sparkles, Trash2 } from "lucide-react";
import { Page } from "@/types";

export function LandingPage() {
    const [pingResponse, setPingResponse] = useState<string>("");
    const [projectName, setProjectName] = useState("");
    const [projectPrompt, setProjectPrompt] = useState("");
    const [creationStatus, setCreationStatus] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const { projects, addProject } = useApp();

    useEffect(() => {
        engineClient
            .ping({ message: "Editor Connected" })
            .then((res) => setPingResponse((res as any).message))
            .catch((err) => setPingResponse(`Error: ${err.message}`));
    }, []);

    const handleCreateProject = async () => {
        if (!projectName.trim()) return;

        setIsCreating(true);
        setCreationStatus("Initializing...");

        try {
            let initialData = undefined;

            if (projectPrompt.trim()) {
                setCreationStatus("AI is generating your project structure...");
                try {
                    const aiResult = await geminiService.generateProject(projectName, projectPrompt);

                    // Create a default Home page with the generated content
                    const homePage: Page = {
                        id: crypto.randomUUID(),
                        name: "Home",
                        description: "Generated Home Page",
                        route: "/",
                        props: { className: "min-h-screen bg-background" },
                        children: aiResult.content,
                    };

                    initialData = {
                        theme: aiResult.theme,
                        pages: [homePage],
                    };
                    setCreationStatus("AI generation complete. Creating project...");
                } catch (err) {
                    console.error("AI Generation failed, proceeding with empty project", err);
                    setCreationStatus("AI failed, creating empty project...");
                }
            } else {
                setCreationStatus("Creating project...");
            }

            const projectId = await addProject(projectName, projectPrompt, undefined, initialData);

            if (projectId) {
                setCreationStatus("Success! Redirecting...");
                setTimeout(() => {
                    navigate(`/editor/${projectId}`);
                }, 800);
            } else {
                throw new Error("Failed to get project ID");
            }
        } catch (err: any) {
            setCreationStatus(`Failed: ${err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation(); // Prevent navigation
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await engineClient.deleteProject({ id: projectId });
            // Refresh projects list - ideally we should have a context method for this or just reload
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete project", err);
            alert("Failed to delete project");
        }
    };

    return (
        <main className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
            <BreathingBackground />

            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 border-b border-white/5">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <span className="text-white font-mono text-lg font-bold">J</span>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Juki</span>
                </div>
                <div className="text-xs font-mono text-gray-500 flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${pingResponse.includes("Error") || pingResponse.includes("failed") ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}></div>
                    {pingResponse || "Connecting..."}
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-5xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        v1.0 Public Beta
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Ship Next.js Apps <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Visually.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        The first Visual Editor for the Next.js App Router. Edit Pages, Layouts, and Components visually. Own your code.
                    </p>

                    {/* Action Area */}
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-start max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        {/* Create Project Card */}
                        <div className="flex-1 w-full bg-gray-900/40 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl hover:border-blue-500/30 transition-all group">
                            <div className="bg-gray-950/50 rounded-xl p-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <Zap size={20} />
                                    </div>
                                    <h1 className="text-4xl font-bold mb-4">Juki Builder</h1>
                                </div>
                                <p className="text-xl text-muted-foreground mb-8">Visual Editor for Next.js App Router.</p>
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Project Name</label>
                                        <input
                                            type="text"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all font-mono text-sm"
                                            placeholder="my-app"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                                            <Sparkles size={12} className="text-purple-400" />
                                            Describe your app (Optional)
                                        </label>
                                        <textarea
                                            value={projectPrompt}
                                            onChange={(e) => setProjectPrompt(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all font-mono text-sm min-h-[80px] resize-none"
                                            placeholder="A landing page for a coffee shop with a hero section and menu..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleCreateProject}
                                        disabled={isCreating || !projectName.trim()}
                                        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        {isCreating ? (
                                            <>
                                                <span className="animate-spin">⟳</span> {creationStatus.includes("AI") ? "Generating..." : "Initializing..."}
                                            </>
                                        ) : (
                                            <>
                                                {projectPrompt.trim() ? <Sparkles size={16} className="text-purple-600" /> : null}
                                                Create Project <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {creationStatus && (
                                    <div
                                        className={`mt-4 text-xs font-mono p-3 rounded border ${
                                            creationStatus.includes("Success") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        }`}
                                    >
                                        {creationStatus}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Open Existing Project Card */}
                        <div className="flex-1 w-full bg-gray-900/40 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl hover:border-indigo-500/30 transition-all">
                            <div className="bg-gray-950/50 rounded-xl p-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <Layers size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
                                </div>

                                {projects.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-800 rounded-lg">
                                        <Box className="text-gray-700 mb-2" size={32} />
                                        <p className="text-sm text-gray-500">No projects found</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                                        {projects.map((project) => (
                                            <div
                                                key={project.id}
                                                onClick={() => navigate(`/editor/${project.id}`)}
                                                className="w-full text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 p-3 rounded-lg transition-all group flex items-center justify-between cursor-pointer"
                                            >
                                                <div>
                                                    <h4 className="font-medium text-gray-200 text-sm group-hover:text-white">{project.name}</h4>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{project.path}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => handleDeleteProject(e, project.id)}
                                                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <ArrowRight size={14} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
                    <FeatureCard icon={<Code size={24} />} title="Clean Code Export" description="Juki writes standard React code. No proprietary JSON blobs. You own your code." />
                    <FeatureCard icon={<Layout size={24} />} title="Visual Canvas" description="Drag, drop, and style with a Figma-like interface. Real-time preview." />
                    <FeatureCard icon={<GitBranch size={24} />} title="Local First" description="Works directly on your filesystem. Git friendly. No cloud dependency." />
                    <FeatureCard icon={<Sparkles size={24} />} title="AI Swarm (Coming Soon)" description="Orchestrate multiple AI agents to build complex features automatically." />
                    <FeatureCard icon={<Layers size={24} />} title="Plugin System & CMS" description="Extensible plugin architecture with built-in CMS integration support." />
                    <FeatureCard icon={<Zap size={24} />} title="Real-time Sync" description="Two-way sync with your codebase. Edit in VS Code, see it in Juki Instantly." />
                </div>
            </div>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/10">
            <div className="mb-4 text-gray-400">{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
