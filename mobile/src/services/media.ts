import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type PickImageOptions = {
  selectionLimit?: number;
  maxSizeBytes?: number;
};

const DEFAULT_IMAGE_QUALITY = 0.45;
const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

async function ensureCameraPermission(): Promise<void> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Izin kamera belum diberikan.");
  }
}

async function ensureLibraryPermission(): Promise<void> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Izin galeri belum diberikan.");
  }
}

async function validateFileSize(uri: string, maxSizeBytes: number): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists && "size" in fileInfo && typeof (fileInfo as { size?: number }).size === "number") {
      if ((fileInfo as { size: number }).size > maxSizeBytes) {
        throw new Error(`Ukuran file melebihi batas maksimal ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("melebihi batas")) {
      throw error;
    }
  }
}

export async function capturePhoto(options?: { maxSizeBytes?: number }): Promise<string | null> {
  await ensureCameraPermission();

  const maxSize = options?.maxSizeBytes ?? MAX_FILE_SIZE_BYTES;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: DEFAULT_IMAGE_QUALITY,
    exif: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const uri = result.assets[0].uri;
  await validateFileSize(uri, maxSize);

  return uri;
}

export async function pickImages(options?: PickImageOptions): Promise<string[]> {
  await ensureLibraryPermission();

  const selectionLimit = options?.selectionLimit ?? 5;
  const maxSize = options?.maxSizeBytes ?? MAX_FILE_SIZE_BYTES;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    allowsMultipleSelection: selectionLimit > 1,
    selectionLimit,
    quality: DEFAULT_IMAGE_QUALITY,
    exif: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return [];
  }

  const validUris: string[] = [];
  for (const asset of result.assets) {
    try {
      await validateFileSize(asset.uri, maxSize);
      validUris.push(asset.uri);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  return [...new Set(validUris)].slice(0, selectionLimit);
}

export async function uploadPhoto(
  uri: string,
  auth: { token: string } | null
): Promise<{ url: string } | null> {
  if (!auth) {
    return null;
  }

  try {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append("image", {
      uri,
      name: filename,
      type,
    } as any);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { url: data.url };
  } catch {
    return null;
  }
}

export async function uploadPhotoForPayment(
  uri: string,
  auth: { token: string } | null,
  maxSizeBytes?: number
): Promise<{ url: string } | null> {
  if (!auth) {
    return null;
  }

  try {
    const maxSize = maxSizeBytes ?? MAX_FILE_SIZE_BYTES;
    await validateFileSize(uri, maxSize);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/mobile/customer/payments/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uri }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { url: data.url };
  } catch {
    return null;
  }
}

export async function downloadDocument(
  url: string,
  fileName: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Create download directory if needed
    const downloadDir = FileSystem.Paths.document;
    const downloadPath = `${downloadDir.uri}downloads/`;

    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(downloadPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadPath, { intermediates: true });
    }

    // Download the file
    const localPath = `${downloadPath}${fileName}.pdf`;
    const downloadResult = await FileSystem.downloadAsync(url, localPath);

    if (downloadResult.status !== 200) {
      return { success: false, message: "Gagal mengunduh dokumen" };
    }

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localPath, {
        mimeType: "application/pdf",
        dialogTitle: `Unduh ${fileName}`,
        UTI: "com.adobe.pdf",
      });
    }

    return { success: true, message: "Dokumen berhasil diunduh" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengunduh";
    return { success: false, message };
  }
}