import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Paintbrush, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  themeTemplates, 
  templatesByIndustry, 
  getAllTemplates, 
  getTemplatesForIndustry, 
  ThemeTemplate 
} from '@/lib/theme-templates';

type IndustryType = keyof typeof templatesByIndustry;

const industries: { id: IndustryType; name: string; icon?: React.ReactNode }[] = [
  { id: 'technology', name: 'Technology' },
  { id: 'design', name: 'Design & Creative' },
  { id: 'legal', name: 'Legal' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' },
  { id: 'science', name: 'Science & Research' },
];

interface ThemeSelectorProps {
  onSelectTheme: (theme: ThemeTemplate) => void;
  selectedThemeId?: string;
}

export function ThemeSelector({ onSelectTheme, selectedThemeId }: ThemeSelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('technology');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(selectedThemeId || 'tech_modern');
  
  const handleIndustryChange = (value: string) => {
    const industry = value as IndustryType;
    setSelectedIndustry(industry);
    
    // Select the first template of the industry by default
    const templates = getTemplatesForIndustry(industry);
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  };
  
  const handleTemplateChange = (template: ThemeTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTheme(template);
  };
  
  const industryTemplates = getTemplatesForIndustry(selectedIndustry);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Select Your Industry</h3>
        <Tabs 
          defaultValue={selectedIndustry} 
          value={selectedIndustry}
          onValueChange={handleIndustryChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 h-auto md:grid-cols-7">
            {industries.map(industry => (
              <TabsTrigger 
                key={industry.id}
                value={industry.id}
                className="py-3"
              >
                {industry.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Select a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => handleTemplateChange(template)}
            />
          ))}
        </div>
      </div>
      
      {industryTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No templates found for this industry. Please select another industry.
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: ThemeTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer overflow-hidden transition-all border-2",
        isSelected 
          ? "border-primary ring-2 ring-primary ring-offset-2" 
          : "hover:border-muted-foreground"
      )}
      onClick={onSelect}
    >
      <div 
        className="h-32 relative" 
        style={{ 
          backgroundColor: template.primaryColor,
          backgroundImage: `linear-gradient(to bottom right, ${template.primaryColor}, ${template.accentColor})`
        }}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
        )}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to top, ${template.backgroundColor}, transparent)`
          }}
        >
          <div 
            className="absolute bottom-4 left-4 right-4 h-8 rounded-md"
            style={{ 
              backgroundColor: template.secondaryColor,
              border: template.cardStyle === 'bordered' ? `1px solid ${template.accentColor}` : 'none',
              boxShadow: template.cardStyle === 'shadowed' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              borderRadius: template.cardStyle === 'sharp' ? '2px' : '8px'
            }}
          />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h4 
          className="font-medium mb-1" 
          style={{ 
            color: template.textColor,
            fontFamily: template.fontFamily.split(',')[0].trim()
          }}
        >
          {template.name}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <div className="flex mt-3 gap-1">
          {['primaryColor', 'secondaryColor', 'accentColor'].map(color => (
            <div 
              key={color}
              className="w-5 h-5 rounded-full border border-gray-200"
              style={{ backgroundColor: template[color as keyof ThemeTemplate] as string }}
            />
          ))}
          <div className="text-xs text-muted-foreground ml-auto">
            {template.cardStyle}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 