import * as Location from "expo-location";

const PROJECT_LOCATION = {
  latitude: -6.2088,
  longitude: 106.8456,
};

const MAX_DISTANCE_METERS = 500;

export async function requestLocationPermission(): Promise<Location.LocationPermissionResponse> {
  return await Location.requestForegroundPermissionsAsync();
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location;
  } catch {
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function validateLocation(
  location: Location.LocationObject | null
): Promise<{ valid: boolean; distance?: number; error?: string }> {
  if (!location) {
    return { valid: false, error: "Lokasi tidak tersedia. Aktifkan layanan lokasi." };
  }

  const distance = calculateDistance(
    location.coords.latitude,
    location.coords.longitude,
    PROJECT_LOCATION.latitude,
    PROJECT_LOCATION.longitude
  );

  if (distance > MAX_DISTANCE_METERS) {
    return {
      valid: false,
      distance,
      error: `Anda berada ${Math.round(distance)}m dari proyek. Maksimal ${MAX_DISTANCE_METERS}m.`,
    };
  }

  return { valid: true, distance };
}