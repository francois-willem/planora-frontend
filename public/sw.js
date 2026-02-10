/**
 * Planora Service Worker v2
 * 
 * FIX: Changed from cache-first to network-first for HTML/navigation requests.
 * This ensures users always get fresh content when online, while still having
 * offline support via cached fallback.
 * 
 * Strategy:
 * - Navigation/HTML: NETWORK-FIRST (fresh content, cache as fallback)
 * - Static assets: CACHE-FIRST (fast loads, network as fallback)
 */

const CACHE_NAME = 'planora-v2';

// Static assets to pre-cache (NOT HTML pages)
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/planora-logo.png',
];

// ============================================
// INSTALL: Pre-cache static assets only
// ============================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Pre-cache failed:', error);
      })
  );
  // Activate immediately, don't wait for old SW to finish
  self.skipWaiting();
});

// ============================================
// ACTIVATE: Clean up old caches, take control immediately
// ============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// ============================================
// FETCH: Route requests to appropriate strategy
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip Next.js data requests and API routes (always network)
  if (url.pathname.startsWith('/_next/data') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Determine strategy based on request type
  if (request.mode === 'navigate' || request.destination === 'document') {
    // HTML/Navigation: NETWORK-FIRST
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(url.pathname)) {
    // Static assets: CACHE-FIRST
    event.respondWith(cacheFirst(request));
  } else {
    // Everything else: NETWORK-FIRST (safer default)
    event.respondWith(networkFirst(request));
  }
});

// ============================================
// NETWORK-FIRST STRATEGY
// Try network, fall back to cache, cache successful responses
// ============================================
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }
    
    // For navigation requests, serve cached home page as fallback
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/');
      if (fallback) {
        console.log('[SW] Serving offline fallback');
        return fallback;
      }
    }
    
    // Nothing in cache, throw error
    throw error;
  }
}

// ============================================
// CACHE-FIRST STRATEGY
// Try cache, fall back to network, cache successful responses
// ============================================
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Both cache and network failed
    console.error('[SW] Cache-first failed for:', request.url);
    throw error;
  }
}

// ============================================
// HELPER: Check if request is for a static asset
// ============================================
function isStaticAsset(pathname) {
  // Next.js static assets
  if (pathname.startsWith('/_next/static/')) {
    return true;
  }
  
  // Common static file extensions
  const staticExtensions = [
    '.js', '.css', '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
    '.json', '.xml'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}
