import { useState } from 'react';
import { geocodeAddress } from '../../lib/geocoding';
import { withGlobalLoading } from '../../stores';
import type { GeocodedLocation } from '../../lib/geocoding';

type LocationState =
  | { address: string; status: 'idle' }
  | { address: string; status: 'loading' }
  | { address: string; status: 'not-found' }
  | { address: string; status: 'error'; message: string }
  | { address: string; status: 'found'; location: GeocodedLocation };

export function OrderLocationMap({ address }: { address: string }) {
  const [lookup, setLookup] = useState<LocationState>({
    address,
    status: 'idle',
  });
  const currentLookup: LocationState =
    lookup.address === address ? lookup : { address, status: 'idle' };

  const locateAddress = async () => {
    setLookup({ address, status: 'loading' });

    try {
      const location = await withGlobalLoading(() => geocodeAddress(address));
      setLookup(
        location
          ? { address, status: 'found', location }
          : { address, status: 'not-found' },
      );
    } catch (error) {
      setLookup({
        address,
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The delivery location could not be loaded.',
      });
    }
  };

  return (
    <section className='overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm'>
      <div className='flex flex-col gap-4 border-b border-teal-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7'>
        <div className='flex items-start gap-4'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
            <MapIcon />
          </span>
          <div>
            <h2 className='text-xl font-bold text-teal-950'>Delivery location</h2>
            <p className='mt-1 max-w-xl text-sm leading-6 text-slate-600'>
              Locate the shipping address and view its approximate position on OpenStreetMap.
            </p>
          </div>
        </div>

        {currentLookup.status !== 'found' && (
          <button
            type='button'
            onClick={() => void locateAddress()}
            disabled={currentLookup.status === 'loading'}
            className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            <SearchIcon />
            {currentLookup.status === 'loading' ? 'Locating...' : 'Show on map'}
          </button>
        )}
      </div>

      {currentLookup.status === 'idle' && (
        <div className='px-5 py-7 sm:px-7'>
          <p className='break-words text-sm font-semibold text-teal-950'>{address}</p>
          <p className='mt-3 text-xs leading-5 text-slate-500'>
            The address is sent to the Photon location service only when you choose “Show on map”. No API key is required.
          </p>
        </div>
      )}

      {currentLookup.status === 'loading' && (
        <div className='min-h-40 px-5 py-7 sm:px-7' aria-busy='true' />
      )}

      {currentLookup.status === 'not-found' && (
        <LocationMessage
          tone='warning'
          title='Address not found'
          message='The map service could not find a reliable match for this shipping address. The saved order address has not been changed.'
        />
      )}

      {currentLookup.status === 'error' && (
        <LocationMessage
          tone='error'
          title='Map unavailable'
          message={currentLookup.message}
        />
      )}

      {currentLookup.status === 'found' && (
        <LocationResult
          address={address}
          location={currentLookup.location}
          onSearchAgain={() => void locateAddress()}
        />
      )}
    </section>
  );
}

function LocationResult({
  address,
  location,
  onSearchAgain,
}: {
  address: string;
  location: GeocodedLocation;
  onSearchAgain: () => void;
}) {
  const embedUrl = openStreetMapEmbedUrl(location);
  const mapUrl = openStreetMapUrl(location);

  return (
    <div>
      <div className='flex flex-col gap-3 bg-teal-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-wide text-teal-600'>
            Matched location
          </p>
          <p className='mt-1 break-words text-sm font-semibold text-teal-950'>
            {location.label}
          </p>
        </div>
        <button
          type='button'
          onClick={onSearchAgain}
          className='shrink-0 text-left text-xs font-bold text-teal-700 underline underline-offset-2 hover:text-teal-950'
        >
          Search again
        </button>
      </div>

      <iframe
        src={embedUrl}
        title={`Delivery location map for ${address}`}
        loading='lazy'
        className='h-80 w-full border-0 sm:h-96'
      />

      <div className='flex flex-col gap-2 border-t border-teal-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7'>
        <p>
          Geocoding by{' '}
          <a
            href='https://github.com/komoot/photon'
            target='_blank'
            rel='noreferrer'
            className='font-semibold text-teal-700 hover:text-teal-950'
          >
            Photon
          </a>
          {' · '}Map data ©{' '}
          <a
            href='https://www.openstreetmap.org/copyright'
            target='_blank'
            rel='noreferrer'
            className='font-semibold text-teal-700 hover:text-teal-950'
          >
            OpenStreetMap contributors
          </a>
        </p>
        <a
          href={mapUrl}
          target='_blank'
          rel='noreferrer'
          className='font-bold text-teal-700 hover:text-teal-950'
        >
          Open larger map ↗
        </a>
      </div>
    </div>
  );
}

function LocationMessage({
  tone,
  title,
  message,
}: {
  tone: 'warning' | 'error';
  title: string;
  message: string;
}) {
  return (
    <div
      className={`px-5 py-7 sm:px-7 ${
        tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'
      }`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <p className='font-bold'>{title}</p>
      <p className='mt-1 text-sm leading-6'>{message}</p>
    </div>
  );
}

function openStreetMapEmbedUrl(location: GeocodedLocation): string {
  const longitudeDelta = 0.012;
  const latitudeDelta = 0.007;
  const query = new URLSearchParams({
    bbox: [
      location.longitude - longitudeDelta,
      location.latitude - latitudeDelta,
      location.longitude + longitudeDelta,
      location.latitude + latitudeDelta,
    ].join(','),
    layer: 'mapnik',
    marker: `${location.latitude},${location.longitude}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${query.toString()}`;
}

function openStreetMapUrl(location: GeocodedLocation): string {
  return `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=17/${location.latitude}/${location.longitude}`;
}

function MapIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z' />
      <path strokeLinecap='round' d='M9 3v15m6-12v15' />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className='h-4 w-4' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <circle cx='8.5' cy='8.5' r='5.5' />
      <path strokeLinecap='round' d='m13 13 4 4' />
    </svg>
  );
}
