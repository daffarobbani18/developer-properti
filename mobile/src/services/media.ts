import * as ImagePicker from "expo-image-picker";

type PickImageOptions = {
  selectionLimit?: number;
};

const DEFAULT_IMAGE_QUALITY = 0.45;

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

export async function capturePhoto(): Promise<string | null> {
  await ensureCameraPermission();

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: DEFAULT_IMAGE_QUALITY,
    exif: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
}

export async function pickImages(options?: PickImageOptions): Promise<string[]> {
  await ensureLibraryPermission();

  const selectionLimit = options?.selectionLimit ?? 5;

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

  const uris = result.assets
    .map((item) => item.uri)
    .filter((uri): uri is string => Boolean(uri));

  return [...new Set(uris)].slice(0, selectionLimit);
}
