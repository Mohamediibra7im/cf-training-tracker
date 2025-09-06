"use client";

import { useState } from "react";
import { Eye, Edit3, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    label = "Message",
    placeholder = "Enter your message...",
    rows = 4,
    required = false,
    className = "",
}) => {
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

    const markdownGuide = `
# Markdown Guide

## Headers
\`# H1\` → # Large Header
\`## H2\` → ## Medium Header
\`### H3\` → ### Small Header

## Text Formatting
\`**bold**\` → **bold**
\`*italic*\` → *italic*
\`~~strikethrough~~\` → ~~strikethrough~~
\`\`code\`\` → \`code\`

## Lists
\`- Item 1\` → Bullet list
\`1. Item 1\` → Numbered list

## Links & Images
\`[text](url)\` → [link](url)
\`![alt](url)\` → Image

## Code Blocks
\`\`\`
code block
\`\`\`

## Tables
\`| Col 1 | Col 2 |\`
\`|-------|-------|\`
\`| Data  | Data  |\`

## Emojis
Use standard emojis: 🎉 ✨ 📱 💻 🚀
`;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center justify-between">
                <Label htmlFor="markdown-editor" className="text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <HelpCircle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Markdown Guide
                                </DialogTitle>
                                <DialogDescription>
                                    Learn how to format your messages with Markdown
                                </DialogDescription>
                            </DialogHeader>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {markdownGuide}
                                </ReactMarkdown>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="edit" className="flex items-center gap-2">
                                <Edit3 className="h-4 w-4" />
                                Edit
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>

                <CardContent className="pt-0">
                    <Tabs value={activeTab}>
                        <TabsContent value="edit" className="mt-0">
                            <Textarea
                                id="markdown-editor"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                rows={rows}
                                required={required}
                                className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm leading-relaxed"
                            />
                            <div className="mt-2 text-xs text-muted-foreground">
                                Supports Markdown formatting. Click the help icon for a guide.
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="mt-0">
                            <div className="min-h-[120px] p-3 bg-gray-50 dark:bg-gray-900 rounded-md border">
                                {value.trim() ? (
                                    <div className="prose prose-sm max-w-none dark:prose-invert text-sm">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                        >
                                            {value}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground text-sm italic">
                                        Nothing to preview. Switch to Edit tab to write your message.
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default MarkdownEditor;
