import React, { useState, useEffect } from "react";
import { engineClient } from "../../lib/client";
import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "../theme/ModeToggle";

interface CreateFirstProjectProps {
    onCreateProject: (name: string, description: string, githubUrl?: string) => void;
}

export const CreateFirstProject = ({ onCreateProject }: CreateFirstProjectProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [connectToGithub, setConnectToGithub] = useState(false);
    const [githubUrl, setGithubUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreateProject(name.trim(), description, connectToGithub ? githubUrl : undefined);
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await engineClient.ping({ message: "ping" });
                console.log("ConnectRPC Response:", response);
            } catch (error) {
                console.error("ConnectRPC Error:", error);
            }
        };
        checkConnection();
    }, []);

    return (
        <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>

            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <Card className="w-full max-w-md shadow-2xl border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-black">Welcome to Juki</CardTitle>
                    <CardDescription>Let's start by creating your first project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project-name">Project Name</Label>
                            <Input id="project-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Awesome Website" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (for &lt;head&gt; tag)</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of your project." />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="connect-github" checked={connectToGithub} onCheckedChange={(checked: boolean) => setConnectToGithub(checked)} />
                            <Label htmlFor="connect-github" className="font-normal cursor-pointer">
                                Connect to GitHub
                            </Label>
                        </div>
                        {connectToGithub && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="github-url">GitHub Repository URL</Label>
                                <div className="relative">
                                    <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="github-url" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="pl-9" placeholder="https://github.com/user/repo" />
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full font-bold text-lg mt-4" size="lg">
                            Create Project
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
