/**
 * Theme templates for different industries/professions
 * Each template includes color schemes, font preferences, and section layout recommendations
 */

export type ThemeTemplate = {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headerStyle: 'minimal' | 'centered' | 'sidebar' | 'card';
  recommendedSections: string[];
  sectionOrder: string[];
  cardStyle: 'rounded' | 'sharp' | 'bordered' | 'shadowed';
  preview?: string; // URL to preview image
};

/**
 * Collection of predefined theme templates for different professions
 */
export const themeTemplates: Record<string, ThemeTemplate> = {
  // Technology themes
  tech_modern: {
    id: 'tech_modern',
    name: 'Modern Tech',
    description: 'A clean, minimal design with vibrant accent colors for technology professionals',
    primaryColor: '#0F172A',
    secondaryColor: '#1E293B',
    accentColor: '#3B82F6',
    backgroundColor: '#F8FAFC',
    textColor: '#334155',
    fontFamily: 'Inter, sans-serif',
    headerStyle: 'minimal',
    recommendedSections: ['about', 'skills', 'projects', 'experience', 'education', 'contact'],
    sectionOrder: ['about', 'skills', 'projects', 'experience', 'education', 'contact'],
    cardStyle: 'rounded',
  },
  
  tech_dark: {
    id: 'tech_dark',
    name: 'Developer Dark',
    description: 'Dark theme with terminal-inspired design for developers and engineers',
    primaryColor: '#121212',
    secondaryColor: '#1e1e1e',
    accentColor: '#10B981',
    backgroundColor: '#0D0D0D',
    textColor: '#E5E7EB',
    fontFamily: 'JetBrains Mono, monospace',
    headerStyle: 'minimal',
    recommendedSections: ['about', 'skills', 'projects', 'experience', 'contact'],
    sectionOrder: ['about', 'skills', 'projects', 'experience', 'contact'],
    cardStyle: 'sharp',
  },
  
  // Design themes
  design_creative: {
    id: 'design_creative',
    name: 'Creative Portfolio',
    description: 'Visually striking design with ample whitespace for designers and creatives',
    primaryColor: '#FFFFFF',
    secondaryColor: '#F3F4F6',
    accentColor: '#EC4899',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    fontFamily: 'Poppins, sans-serif',
    headerStyle: 'centered',
    recommendedSections: ['about', 'projects', 'skills', 'testimonials', 'contact'],
    sectionOrder: ['about', 'projects', 'skills', 'testimonials', 'contact'],
    cardStyle: 'shadowed',
  },
  
  design_minimal: {
    id: 'design_minimal',
    name: 'Minimal Design',
    description: 'Elegant, minimalist design with focus on typography and imagery',
    primaryColor: '#FFFFFF',
    secondaryColor: '#FAFAFA',
    accentColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    textColor: '#18181B',
    fontFamily: 'DM Sans, sans-serif',
    headerStyle: 'card',
    recommendedSections: ['about', 'projects', 'skills', 'experience', 'contact'],
    sectionOrder: ['about', 'projects', 'experience', 'skills', 'contact'],
    cardStyle: 'bordered',
  },
  
  // Legal themes
  legal_professional: {
    id: 'legal_professional',
    name: 'Legal Professional',
    description: 'Sophisticated, traditional design suitable for legal professionals',
    primaryColor: '#14532D',
    secondaryColor: '#DCE5DD',
    accentColor: '#14532D',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    fontFamily: 'Garamond, serif',
    headerStyle: 'centered',
    recommendedSections: ['about', 'experience', 'education', 'publications', 'contact'],
    sectionOrder: ['about', 'experience', 'education', 'publications', 'contact'],
    cardStyle: 'bordered',
  },
  
  legal_modern: {
    id: 'legal_modern',
    name: 'Modern Legal',
    description: 'Contemporary design for forward-thinking legal professionals',
    primaryColor: '#1E293B',
    secondaryColor: '#E2E8F0',
    accentColor: '#4F46E5',
    backgroundColor: '#F8FAFC',
    textColor: '#334155',
    fontFamily: 'Source Serif Pro, serif',
    headerStyle: 'card',
    recommendedSections: ['about', 'experience', 'education', 'publications', 'contact'],
    sectionOrder: ['about', 'experience', 'education', 'publications', 'contact'],
    cardStyle: 'shadowed',
  },
  
  // Healthcare themes
  healthcare_professional: {
    id: 'healthcare_professional',
    name: 'Healthcare Professional',
    description: 'Clean, trustworthy design for medical and healthcare professionals',
    primaryColor: '#0369A1',
    secondaryColor: '#E0F2FE',
    accentColor: '#0284C7',
    backgroundColor: '#FFFFFF',
    textColor: '#334155',
    fontFamily: 'Montserrat, sans-serif',
    headerStyle: 'card',
    recommendedSections: ['about', 'experience', 'education', 'certifications', 'publications', 'contact'],
    sectionOrder: ['about', 'experience', 'education', 'certifications', 'publications', 'contact'],
    cardStyle: 'rounded',
  },
  
  // Education themes
  education_academic: {
    id: 'education_academic',
    name: 'Academic',
    description: 'Scholarly design for professors, researchers, and educators',
    primaryColor: '#7F1D1D',
    secondaryColor: '#FEF2F2',
    accentColor: '#B91C1C',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Merriweather, serif',
    headerStyle: 'centered',
    recommendedSections: ['about', 'education', 'research', 'publications', 'teaching', 'contact'],
    sectionOrder: ['about', 'education', 'research', 'publications', 'teaching', 'contact'],
    cardStyle: 'bordered',
  },
  
  // Finance themes
  finance_professional: {
    id: 'finance_professional',
    name: 'Finance Professional',
    description: 'Trustworthy, polished design for finance professionals',
    primaryColor: '#0F172A',
    secondaryColor: '#E2E8F0',
    accentColor: '#065F46',
    backgroundColor: '#F8FAFC',
    textColor: '#334155',
    fontFamily: 'Inter, sans-serif',
    headerStyle: 'sidebar',
    recommendedSections: ['about', 'experience', 'education', 'skills', 'certifications', 'contact'],
    sectionOrder: ['about', 'experience', 'education', 'skills', 'certifications', 'contact'],
    cardStyle: 'shadowed',
  },
  
  // Science/Math themes
  science_research: {
    id: 'science_research',
    name: 'Research Scientist',
    description: 'Clean, data-focused design for researchers and scientists',
    primaryColor: '#1D4ED8',
    secondaryColor: '#EFF6FF',
    accentColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Source Sans Pro, sans-serif',
    headerStyle: 'minimal',
    recommendedSections: ['about', 'research', 'publications', 'education', 'experience', 'contact'],
    sectionOrder: ['about', 'research', 'publications', 'education', 'experience', 'contact'],
    cardStyle: 'rounded',
  }
};

/**
 * Grouped templates by industry for easier selection
 */
export const templatesByIndustry = {
  technology: ['tech_modern', 'tech_dark'],
  design: ['design_creative', 'design_minimal'],
  legal: ['legal_professional', 'legal_modern'],
  healthcare: ['healthcare_professional'],
  education: ['education_academic'],
  finance: ['finance_professional'],
  science: ['science_research'],
};

/**
 * Get a theme template by ID
 */
export function getThemeTemplate(id: string): ThemeTemplate | undefined {
  return themeTemplates[id];
}

/**
 * Get all templates for a specific industry
 */
export function getTemplatesForIndustry(industry: string): ThemeTemplate[] {
  const templateIds = templatesByIndustry[industry as keyof typeof templatesByIndustry] || [];
  return templateIds.map(id => themeTemplates[id]);
}

/**
 * Get all available templates
 */
export function getAllTemplates(): ThemeTemplate[] {
  return Object.values(themeTemplates);
} 