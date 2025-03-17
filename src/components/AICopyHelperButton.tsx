import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Check, RefreshCw, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

type ContentType = 'bio' | 'project' | 'experience' | 'skill' | 'education';
type ProfessionType = 'technology' | 'design' | 'legal' | 'healthcare' | 'education' | 'finance' | 'other';
type ToneType = 'formal' | 'conversational' | 'technical' | 'creative';

interface AICopyHelperButtonProps {
  contentType: ContentType;
  defaultContent?: string;
  onContentSelect: (content: string) => void;
  profession?: ProfessionType;
  experience?: string;
  education?: string;
  skills?: string[];
  compact?: boolean;
}

export function AICopyHelperButton({
  contentType,
  defaultContent = '',
  onContentSelect,
  profession = 'technology',
  experience = '',
  education = '',
  skills = [],
  compact = false
}: AICopyHelperButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneType>('formal');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generate' | 'enhance'>('generate');
  const [contentToEnhance, setContentToEnhance] = useState(defaultContent);
  
  const contentTypeLabels: Record<ContentType, string> = {
    bio: 'Professional Bio',
    project: 'Project Description',
    experience: 'Experience Description',
    skill: 'Professional Skills',
    education: 'Education Description'
  };
  
  const generateContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profession,
          contentType,
          experience,
          education,
          skills
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const enhanceExistingContent = async () => {
    if (!contentToEnhance.trim()) {
      setError('Please enter some content to enhance');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/enhance-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contentToEnhance,
          profession,
          tone: selectedTone
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enhance content');
      }
      
      const data = await response.json();
      setEnhancedContent(data.content);
    } catch (err) {
      setError('Failed to enhance content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContentSelect = (content: string) => {
    onContentSelect(content);
    setIsOpen(false);
    toast({
      title: 'Content applied',
      description: 'AI-generated content has been applied to your portfolio.',
      duration: 3000,
    });
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size={compact ? "sm" : "default"} 
          className={compact ? "h-8 px-2" : ""}
        >
          <Sparkles className={compact ? "h-4 w-4 mr-1" : "h-4 w-4 mr-2"} />
          {compact ? "AI" : "AI Assistant"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium flex items-center">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Content Helper - {contentTypeLabels[contentType]}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get AI-powered suggestions for your portfolio content
          </p>
        </div>
        
        <Tabs 
          defaultValue="generate" 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'generate' | 'enhance')}
          className="w-full"
        >
          <div className="px-4 pt-3">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="generate">
                Generate New
              </TabsTrigger>
              <TabsTrigger value="enhance">
                Enhance Existing
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="generate" className="p-4 pt-0 space-y-4">
            <div className="space-y-2 mt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={generateContent}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {contentTypeLabels[contentType]}
                  </>
                )}
              </Button>
              
              {error && (
                <div className="text-sm text-red-500 mt-2">
                  {error}
                </div>
              )}
              
              {generatedContent && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-md border p-3">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Generated Content</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={generateContent}
                        disabled={isLoading}
                        className="h-6 px-2"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="text-sm">
                      {generatedContent}
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleContentSelect(generatedContent)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Use This Content
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="enhance" className="p-4 pt-0 space-y-4">
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Tone</label>
                <Select
                  value={selectedTone}
                  onValueChange={(value) => setSelectedTone(value as ToneType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Content</label>
                <Textarea
                  placeholder={`Enter your ${contentTypeLabels[contentType].toLowerCase()} text here...`}
                  value={contentToEnhance}
                  onChange={(e) => setContentToEnhance(e.target.value)}
                  className="resize-none min-h-[100px]"
                />
              </div>
              
              <Button
                variant="default"
                className="w-full"
                onClick={enhanceExistingContent}
                disabled={isLoading || !contentToEnhance.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Enhance Content
                  </>
                )}
              </Button>
              
              {error && (
                <div className="text-sm text-red-500 mt-2">
                  {error}
                </div>
              )}
              
              {enhancedContent && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-md border p-3">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Enhanced Content</span>
                    </div>
                    <div className="text-sm">
                      {enhancedContent}
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleContentSelect(enhancedContent)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Use This Content
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="p-3 border-t text-xs text-muted-foreground flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by AI. Results may need review and personalization.
        </div>
      </PopoverContent>
    </Popover>
  );
} 