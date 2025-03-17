import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Download, Share, QrCode, LinkIcon, User } from 'lucide-react';

// Note: We're using a simple color input rather than a full color picker component

interface PortfolioQRCodeProps {
  portfolioSlug: string;
  portfolioTitle: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userWebsite?: string;
  userJobTitle?: string;
}

export function PortfolioQRCode({
  portfolioSlug,
  portfolioTitle,
  userName,
  userEmail,
  userPhone,
  userWebsite,
  userJobTitle
}: PortfolioQRCodeProps) {
  // State for QR code options
  const [qrSize, setQrSize] = useState(300);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [includeContact, setIncludeContact] = useState(false);
  const [qrFormat, setQrFormat] = useState<'dataURL' | 'svg' | 'png'>('dataURL');
  
  // State for QR code data
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the base URL
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : '';
  
  // Portfolio URL
  const portfolioUrl = `${baseUrl}/${portfolioSlug}`;
  
  // Function to generate QR code
  const generateQRCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build the API URL with query parameters
      const apiUrl = new URL(`/api/portfolio/${portfolioSlug}/qrcode`, baseUrl);
      apiUrl.searchParams.append('size', qrSize.toString());
      apiUrl.searchParams.append('color', qrColor);
      apiUrl.searchParams.append('backgroundColor', qrBgColor);
      apiUrl.searchParams.append('includeContact', includeContact.toString());
      apiUrl.searchParams.append('format', qrFormat);
      
      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      const data = await response.json();
      
      // In a real implementation, this would be data.qrCode
      // For now, just fake it with a placeholder
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(portfolioUrl)}`);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to download QR code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${portfolioTitle.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to share QR code
  const shareQRCode = async () => {
    if (!qrCodeUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${portfolioTitle}`,
          text: `Scan this QR code to view my portfolio: ${portfolioTitle}`,
          url: portfolioUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(portfolioUrl);
      alert('Portfolio URL copied to clipboard!');
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode size={20} />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Create a QR code for your portfolio to share with others
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <LinkIcon size={14} />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <User size={14} />
              Contact Info
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <div className="flex">
                <Input 
                  id="portfolioUrl" 
                  value={portfolioUrl} 
                  readOnly 
                  className="flex-1 rounded-r-none"
                />
                <Button 
                  variant="secondary" 
                  className="rounded-l-none"
                  onClick={() => navigator.clipboard.writeText(portfolioUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeContact" 
                checked={includeContact}
                onCheckedChange={(checked) => setIncludeContact(checked as boolean)}
              />
              <Label htmlFor="includeContact">
                Include contact information in QR code
              </Label>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {includeContact ? (
                <div className="space-y-2">
                  <p>The QR code will include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Name: {userName}</li>
                    {userJobTitle && <li>Title: {userJobTitle}</li>}
                    {userEmail && <li>Email: {userEmail}</li>}
                    {userPhone && <li>Phone: {userPhone}</li>}
                    {userWebsite && <li>Website: {userWebsite}</li>}
                    <li>Portfolio: {portfolioUrl}</li>
                  </ul>
                </div>
              ) : (
                <p>The QR code will only contain your portfolio URL.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="qrSize">Size</Label>
              <Select 
                value={qrSize.toString()}
                onValueChange={(value) => setQrSize(parseInt(value))}
              >
                <SelectTrigger id="qrSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">Small (200px)</SelectItem>
                  <SelectItem value="300">Medium (300px)</SelectItem>
                  <SelectItem value="400">Large (400px)</SelectItem>
                  <SelectItem value="500">Extra Large (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="qrFormat">Format</Label>
              <Select 
                value={qrFormat}
                onValueChange={(value) => setQrFormat(value as 'dataURL' | 'svg' | 'png')}
              >
                <SelectTrigger id="qrFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="svg">SVG Vector</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="qrColor">QR Code Color</Label>
              <div className="flex h-10 items-center gap-2">
                <Input
                  id="qrColor"
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="qrBgColor">Background Color</Label>
              <div className="flex h-10 items-center gap-2">
                <Input
                  id="qrBgColor"
                  type="color"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={generateQRCode} 
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {qrCodeUrl && (
          <div className="mt-6 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[300px] mb-4">
              <Image
                src={qrCodeUrl}
                alt={`QR Code for ${portfolioTitle}`}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={downloadQRCode}
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={shareQRCode}
              >
                <Share size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 