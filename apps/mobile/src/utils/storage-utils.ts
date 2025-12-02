import { supabase } from '../config/supabase';

const BUCKET_NAME = 'idea-files';

export interface UploadedFile {
    name: string;
    url: string;
    size: number;
    type: string;
}

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadIdeaFile(
    file: { uri: string; name: string; mimeType?: string; size?: number },
    userId: string
): Promise<UploadedFile | null> {
    try {
        console.log('📤 Starting file upload:', file.name);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${timestamp}_${file.name}`;

        console.log('📁 Target path:', fileName);

        // Fetch the file from local URI and convert to ArrayBuffer
        console.log('🔄 Fetching file from URI...');
        const response = await fetch(file.uri);

        if (!response.ok) {
            console.error('❌ Failed to fetch file:', response.status);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('✅ File fetched, size:', arrayBuffer.byteLength, 'bytes');

        // Convert ArrayBuffer to Uint8Array for Supabase
        const fileData = new Uint8Array(arrayBuffer);

        console.log('☁️ Uploading to Supabase Storage...');

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileData, {
                contentType: file.mimeType || 'application/octet-stream',
                upsert: false
            });

        if (error) {
            console.error('❌ Supabase upload error:', {
                message: error.message,
                name: error.name,
                cause: error.cause
            });

            // Check if bucket exists
            const { data: buckets } = await supabase.storage.listBuckets();
            console.log('📦 Available buckets:', buckets?.map(b => b.name));

            return null;
        }

        console.log('✅ Upload successful:', data);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log('🔗 Public URL:', urlData.publicUrl);

        return {
            name: file.name,
            url: urlData.publicUrl,
            size: file.size || arrayBuffer.byteLength,
            type: file.mimeType || 'application/octet-stream'
        };
    } catch (error) {
        console.error('❌ Error in uploadIdeaFile:', error);
        return null;
    }
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadIdeaFiles(
    files: Array<{ uri: string; name: string; mimeType?: string; size?: number }>,
    userId: string
): Promise<UploadedFile[]> {
    console.log(`📤 Uploading ${files.length} files...`);
    const uploadPromises = files.map(file => uploadIdeaFile(file, userId));
    const results = await Promise.all(uploadPromises);

    // Filter out failed uploads
    const successful = results.filter((file): file is UploadedFile => file !== null);
    console.log(`✅ Successfully uploaded ${successful.length}/${files.length} files`);

    return successful;
}

/**
 * Get public URL for a file
 */
export function getFileUrl(filePath: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteIdeaFile(filePath: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting file:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteIdeaFile:', error);
        return false;
    }
}

/**
 * Delete multiple files from Supabase Storage
 */
export async function deleteIdeaFiles(filePaths: string[]): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(filePaths);

        if (error) {
            console.error('Error deleting files:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteIdeaFiles:', error);
        return false;
    }
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
