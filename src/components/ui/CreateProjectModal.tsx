import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Github } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const CreateProjectModal = () => {
  const { modalState, closeModal, addProject } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [connectToGithub, setConnectToGithub] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');

  const isOpen = modalState?.type === 'CREATE_PROJECT';

  useEffect(() => {
    if (isOpen) {
        setName('');
        setDescription('');
        setConnectToGithub(false);
        setGithubUrl('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addProject(name.trim(), description, connectToGithub ? githubUrl : undefined);
      closeModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Website"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your project."
            />
          </div>
          <div className="flex items-center space-x-2">
             <Checkbox
                id="connect-github-modal"
                checked={connectToGithub}
                onCheckedChange={(checked: boolean) => setConnectToGithub(checked)}
              />
              <Label htmlFor="connect-github-modal" className="font-normal cursor-pointer">Connect to GitHub</Label>
          </div>
          {connectToGithub && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <div className="relative">
                 <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <Input
                    id="github-url"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="pl-9"
                    placeholder="https://github.com/user/repo"
                 />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};