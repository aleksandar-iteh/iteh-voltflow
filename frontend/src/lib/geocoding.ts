export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  label: string;
}

interface PhotonResponse {
  features?: unknown;
}

interface PhotonFeature {
  geometry?: {
    coordinates?: unknown;
  };
  properties?: Record<string, unknown>;
}

const PHOTON_ENDPOINT = (
  import.meta.env.VITE_GEOCODING_URL ?? 'https://photon.komoot.io/api'
).replace(/\/$/, '');
const MIN_REQUEST_INTERVAL_MS = 1_100;
const locationCache = new Map<string, Promise<GeocodedLocation | null>>();
let geocodingQueue: Promise<void> = Promise.resolve();
let lastRequestStartedAt = 0;

export function geocodeAddress(
  address: string,
): Promise<GeocodedLocation | null> {
  const normalizedAddress = address.trim().replace(/\s+/g, ' ');
  const cacheKey = normalizedAddress.toLocaleLowerCase('en');
  const cached = locationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const request = queueGeocodingRequest(() => lookupAddress(normalizedAddress));
  const cachedRequest = request.catch((error: unknown) => {
    locationCache.delete(cacheKey);
    throw error;
  });
  locationCache.set(cacheKey, cachedRequest);

  return cachedRequest;
}

async function lookupAddress(
  address: string,
): Promise<GeocodedLocation | null> {
  const query = new URLSearchParams({
    q: address,
    limit: '1',
    lang: 'en',
  });
  const response = await fetch(`${PHOTON_ENDPOINT}/?${query.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? 'The location service is busy. Please try again shortly.'
        : 'The location service is currently unavailable.',
    );
  }

  const payload = (await response.json()) as PhotonResponse;

  if (!Array.isArray(payload.features) || payload.features.length === 0) {
    return null;
  }

  return parseFeature(payload.features[0]);
}

function parseFeature(value: unknown): GeocodedLocation | null {
  if (!isObject(value)) {
    return null;
  }

  const feature = value as PhotonFeature;
  const coordinates = feature.geometry?.coordinates;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    typeof coordinates[0] !== 'number' ||
    typeof coordinates[1] !== 'number'
  ) {
    return null;
  }

  const [longitude, latitude] = coordinates;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
    label: locationLabel(feature.properties),
  };
}

function locationLabel(properties?: Record<string, unknown>): string {
  if (!properties) {
    return 'Matched delivery location';
  }

  const houseNumber = stringProperty(properties, 'housenumber');
  const street = stringProperty(properties, 'street');
  const streetLine = [street, houseNumber].filter(Boolean).join(' ');
  const parts = [
    stringProperty(properties, 'name'),
    streetLine,
    stringProperty(properties, 'postcode'),
    stringProperty(properties, 'city'),
    stringProperty(properties, 'state'),
    stringProperty(properties, 'country'),
  ].filter((part): part is string => Boolean(part));
  const uniqueParts = parts.filter(
    (part, index) =>
      parts.findIndex(
        (candidate) => candidate.toLocaleLowerCase() === part.toLocaleLowerCase(),
      ) === index,
  );

  return uniqueParts.join(', ') || 'Matched delivery location';
}

function stringProperty(
  properties: Record<string, unknown>,
  key: string,
): string | null {
  const value = properties[key];

  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function queueGeocodingRequest<T>(operation: () => Promise<T>): Promise<T> {
  const queued = geocodingQueue.then(async () => {
    const elapsed = Date.now() - lastRequestStartedAt;
    const waitTime = Math.max(0, MIN_REQUEST_INTERVAL_MS - elapsed);

    if (waitTime > 0) {
      await delay(waitTime);
    }

    lastRequestStartedAt = Date.now();

    return operation();
  });

  geocodingQueue = queued.then(
    () => undefined,
    () => undefined,
  );

  return queued;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
