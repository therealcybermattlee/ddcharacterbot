// R2 Storage Manager for Character Portraits and Campaign Assets
// Provides utilities for file upload, optimization, and management

import type { R2Bucket, R2Object } from '@cloudflare/workers-types';

export interface AssetMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  uploaderId: string;
  campaignId?: string;
  characterId?: string;
  assetType: 'portrait' | 'token' | 'map' | 'handout' | 'other';
  isPublic: boolean;
  tags: string[];
  r2Key: string;
}

export interface UploadOptions {
  assetType: AssetMetadata['assetType'];
  campaignId?: string;
  characterId?: string;
  isPublic?: boolean;
  tags?: string[];
  generateThumbnail?: boolean;
}

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'contain' | 'cover' | 'fill';
}

export class R2Manager {
  private bucket: R2Bucket;
  private baseUrl: string;

  constructor(bucket: R2Bucket, bucketName: string) {
    this.bucket = bucket;
    this.baseUrl = `https://pub-${bucketName}.r2.dev`;
  }

  // File Upload
  async uploadFile(
    file: File | ArrayBuffer,
    uploaderId: string,
    options: UploadOptions
  ): Promise<AssetMetadata> {
    const fileId = crypto.randomUUID();
    const timestamp = Date.now();
    
    // Extract file info
    let filename: string;
    let originalName: string;
    let mimeType: string;
    let sizeBytes: number;
    let buffer: ArrayBuffer;

    if (file instanceof File) {
      filename = this.sanitizeFilename(file.name);
      originalName = file.name;
      mimeType = file.type;
      sizeBytes = file.size;
      buffer = await file.arrayBuffer();
    } else {
      buffer = file;
      sizeBytes = buffer.byteLength;
      mimeType = 'application/octet-stream';
      filename = `upload_${timestamp}`;
      originalName = filename;
    }

    // Validate file
    this.validateFile(buffer, mimeType, sizeBytes);

    // Generate R2 key with organized structure
    const r2Key = this.generateR2Key(fileId, filename, options);

    // Upload to R2
    const uploadResult = await this.bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        uploaderId,
        originalName,
        assetType: options.assetType,
        uploadTimestamp: timestamp.toString(),
        ...(options.campaignId && { campaignId: options.campaignId }),
        ...(options.characterId && { characterId: options.characterId }),
      },
    });

    if (!uploadResult) {
      throw new Error('Failed to upload file to R2');
    }

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;
    
    if (this.isImage(mimeType)) {
      try {
        const dimensions = await this.getImageDimensions(buffer);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.warn('Failed to get image dimensions:', error);
      }
    }

    const assetMetadata: AssetMetadata = {
      id: fileId,
      filename,
      originalName,
      mimeType,
      sizeBytes,
      width,
      height,
      uploaderId,
      campaignId: options.campaignId,
      characterId: options.characterId,
      assetType: options.assetType,
      isPublic: options.isPublic || false,
      tags: options.tags || [],
      r2Key,
    };

    // Generate thumbnail for images if requested
    if (options.generateThumbnail && this.isImage(mimeType)) {
      await this.generateThumbnail(r2Key, buffer, mimeType);
    }

    return assetMetadata;
  }

  // File Download
  async downloadFile(r2Key: string): Promise<R2Object | null> {
    return await this.bucket.get(r2Key);
  }

  // Get file URL for public access
  getPublicUrl(r2Key: string): string {
    return `${this.baseUrl}/${r2Key}`;
  }

  // Get signed URL for private access
  async getSignedUrl(r2Key: string, expiresIn = 3600): Promise<string> {
    // Note: Cloudflare R2 signed URLs require API tokens
    // This would need to be implemented with the R2 API
    // For now, return the public URL
    return this.getPublicUrl(r2Key);
  }

  // Delete file
  async deleteFile(r2Key: string): Promise<void> {
    await this.bucket.delete(r2Key);
    
    // Also delete thumbnail if exists
    const thumbnailKey = this.getThumbnailKey(r2Key);
    try {
      await this.bucket.delete(thumbnailKey);
    } catch {
      // Thumbnail might not exist, ignore error
    }
  }

  // Image processing and optimization
  async processImage(
    r2Key: string,
    options: ImageProcessingOptions
  ): Promise<string> {
    const originalFile = await this.bucket.get(r2Key);
    if (!originalFile) {
      throw new Error('File not found');
    }

    const buffer = await originalFile.arrayBuffer();
    
    // Note: Image processing would typically use Cloudflare Images or a service like Sharp
    // For this example, we'll store the processed image with a new key
    const processedKey = `${r2Key.replace(/\.[^.]+$/, '')}_processed_${Date.now()}${this.getExtensionFromMimeType(originalFile.httpMetadata?.contentType || 'image/jpeg')}`;
    
    // In a real implementation, you'd process the image here
    // For now, just copy the original
    await this.bucket.put(processedKey, buffer, {
      httpMetadata: originalFile.httpMetadata,
    });

    return processedKey;
  }

  // Generate thumbnail
  private async generateThumbnail(
    originalKey: string,
    buffer: ArrayBuffer,
    mimeType: string
  ): Promise<string> {
    const thumbnailKey = this.getThumbnailKey(originalKey);
    
    // Note: In a real implementation, you'd resize the image here
    // For this example, we'll just copy the original as thumbnail
    await this.bucket.put(thumbnailKey, buffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        isThumbnail: 'true',
        originalKey,
      },
    });

    return thumbnailKey;
  }

  // List files with filtering
  async listFiles(options: {
    prefix?: string;
    campaignId?: string;
    characterId?: string;
    assetType?: string;
    limit?: number;
  } = {}): Promise<R2Object[]> {
    const prefix = options.prefix || '';
    const listOptions: any = { prefix };
    
    if (options.limit) {
      listOptions.limit = options.limit;
    }

    const result = await this.bucket.list(listOptions);
    return result.objects;
  }

  // Cleanup orphaned files
  async cleanupOrphanedFiles(validKeys: string[]): Promise<number> {
    const allFiles = await this.listFiles();
    const orphanedFiles = allFiles.filter(file => !validKeys.includes(file.key));
    
    await Promise.all(
      orphanedFiles.map(file => this.bucket.delete(file.key))
    );

    return orphanedFiles.length;
  }

  // Bulk delete files
  async bulkDelete(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.bucket.delete(key)));
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = `health_check_${Date.now()}.txt`;
      const testData = 'Health check test';
      
      // Upload test file
      await this.bucket.put(testKey, testData, {
        httpMetadata: {
          contentType: 'text/plain',
        },
      });

      // Retrieve test file
      const retrieved = await this.bucket.get(testKey);
      const content = await retrieved?.text();

      // Delete test file
      await this.bucket.delete(testKey);

      return content === testData;
    } catch {
      return false;
    }
  }

  // Private helper methods
  private generateR2Key(fileId: string, filename: string, options: UploadOptions): string {
    const parts: string[] = ['assets'];
    
    if (options.campaignId) {
      parts.push('campaigns', options.campaignId);
    } else if (options.characterId) {
      parts.push('characters', options.characterId);
    } else {
      parts.push('users');
    }
    
    parts.push(options.assetType, `${fileId}_${filename}`);
    
    return parts.join('/');
  }

  private getThumbnailKey(originalKey: string): string {
    const parts = originalKey.split('.');
    const extension = parts.pop();
    const base = parts.join('.');
    return `${base}_thumb.${extension}`;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  private validateFile(buffer: ArrayBuffer, mimeType: string, sizeBytes: number): void {
    // Size limits (10MB for images, 50MB for other files)
    const maxSize = this.isImage(mimeType) ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    
    if (sizeBytes > maxSize) {
      throw new Error(`File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Validate file signature for security
    if (this.isImage(mimeType)) {
      this.validateImageSignature(buffer, mimeType);
    }
  }

  private validateImageSignature(buffer: ArrayBuffer, mimeType: string): void {
    const bytes = new Uint8Array(buffer, 0, 8);
    
    // Check file signatures to prevent upload of malicious files
    const signatures: Record<string, number[][]> = {
      'image/jpeg': [[0xFF, 0xD8, 0xFF]],
      'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
      'image/gif': [[0x47, 0x49, 0x46, 0x38], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
      'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header, WebP is more complex
    };

    const expectedSignatures = signatures[mimeType];
    if (!expectedSignatures) return;

    const isValid = expectedSignatures.some(signature =>
      signature.every((byte, index) => bytes[index] === byte)
    );

    if (!isValid) {
      throw new Error('Invalid file signature for declared MIME type');
    }
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private async getImageDimensions(buffer: ArrayBuffer): Promise<{ width: number; height: number }> {
    // Note: This would typically use a library like image-size or sharp
    // For this example, return placeholder dimensions
    return { width: 512, height: 512 };
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
    };
    
    return extensions[mimeType] || '';
  }
}