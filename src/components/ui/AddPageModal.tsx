import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, route: string) => void;
}

export const AddPageModal = ({ isOpen, onClose, onCreate }: AddPageModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [route, setRoute] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setRoute("");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && route.trim()) {
            onCreate(name, description, route);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>Enter the details for your new page.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Page Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. About Us" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the page." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="route">Route</Label>
                        <Input id="route" value={route} onChange={(e) => setRoute(e.target.value)} placeholder="/about" required />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Page</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
