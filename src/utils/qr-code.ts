import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL for the given portfolio URL
 * 
 * @param url The URL to encode in the QR code
 * @param options Optional configuration for the QR code generation
 * @returns Promise resolving to a data URL string containing the QR code
 */
export async function generateQRCode(
  url: string, 
  options: {
    size?: number;
    color?: string;
    backgroundColor?: string;
    logo?: string;
    margin?: number;
  } = {}
): Promise<string> {
  const {
    size = 300,
    color = '#000000',
    backgroundColor = '#FFFFFF',
    margin = 4
  } = options;
  
  try {
    // Generate basic QR code
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: margin,
      color: {
        dark: color,
        light: backgroundColor
      }
    });
    
    // If a logo is provided, we would overlay it on the QR code
    // This would require canvas manipulation which is omitted for simplicity
    // In a full implementation, you'd use canvas to overlay the logo on the QR code
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates a downloadable QR code file
 * 
 * @param url The URL to encode in the QR code
 * @param filename The name of the file to be downloaded
 * @param options Optional QR code configuration
 * @returns Promise resolving to a Blob URL that can be used for download
 */
export async function generateDownloadableQRCode(
  url: string,
  filename: string = 'portfolio-qr-code',
  options: {
    size?: number;
    color?: string;
    backgroundColor?: string;
    fileType?: 'png' | 'svg';
    margin?: number;
  } = {}
): Promise<{ blobUrl: string; filename: string }> {
  const {
    size = 500,
    color = '#000000',
    backgroundColor = '#FFFFFF',
    fileType = 'png',
    margin = 4
  } = options;
  
  try {
    let data: Buffer | string;
    let mimeType: string;
    let fullFilename = filename;
    
    // Generate QR code in the appropriate format
    if (fileType === 'svg') {
      data = await QRCode.toString(url, {
        type: 'svg',
        width: size,
        margin: margin,
        color: {
          dark: color,
          light: backgroundColor
        }
      });
      mimeType = 'image/svg+xml';
      fullFilename = `${filename}.svg`;
    } else {
      data = await QRCode.toBuffer(url, {
        type: 'png',
        width: size,
        margin: margin,
        color: {
          dark: color,
          light: backgroundColor
        }
      });
      mimeType = 'image/png';
      fullFilename = `${filename}.png`;
    }
    
    // Create a blob from the data
    const blob = new Blob(
      [data], 
      { type: mimeType }
    );
    
    // Create a blob URL for download
    const blobUrl = URL.createObjectURL(blob);
    
    return { blobUrl, filename: fullFilename };
  } catch (error) {
    console.error('Error generating downloadable QR code:', error);
    throw new Error('Failed to generate downloadable QR code');
  }
}

/**
 * Creates a vCard QR code for sharing contact information
 * 
 * @param contactInfo The contact information to encode in the QR code
 * @returns Promise resolving to a data URL containing the vCard QR code
 */
export async function generateContactQRCode(contactInfo: {
  name: string;
  title?: string;
  organization?: string;
  email?: string;
  phone?: string;
  website?: string;
  portfolioUrl: string;
}): Promise<string> {
  try {
    const { name, title, organization, email, phone, website, portfolioUrl } = contactInfo;
    
    // Create vCard format string
    let vCardData = 'BEGIN:VCARD\nVERSION:3.0\n';
    vCardData += `N:${name};\n`;
    vCardData += `FN:${name}\n`;
    
    if (title) vCardData += `TITLE:${title}\n`;
    if (organization) vCardData += `ORG:${organization}\n`;
    if (email) vCardData += `EMAIL:${email}\n`;
    if (phone) vCardData += `TEL:${phone}\n`;
    if (website) vCardData += `URL:${website}\n`;
    
    // Add portfolio as a URL
    vCardData += `URL;type=PORTFOLIO:${portfolioUrl}\n`;
    
    // Add note about the portfolio
    vCardData += `NOTE:View my professional portfolio at ${portfolioUrl}\n`;
    
    vCardData += 'END:VCARD';
    
    // Generate QR code with vCard data
    const qrDataUrl = await QRCode.toDataURL(vCardData, {
      width: 300,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating contact QR code:', error);
    throw new Error('Failed to generate contact QR code');
  }
} 