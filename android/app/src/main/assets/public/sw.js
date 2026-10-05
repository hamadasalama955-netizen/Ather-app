/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-5d155c7a'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "647951820ea76ebf244836e452fe56db"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4be010ab8d244e6c97e32a8ee1a8b2fc"
  }, {
    "url": "pwa-192x192.png",
    "revision": "5d95d56e456377da250723d095801096"
  }, {
    "url": "index.html",
    "revision": "a83b19af3dcb40054511dfcf9163c7d5"
  }, {
    "url": "icon.svg",
    "revision": "fcb5a7a615253f57be36606b0d5cd20f"
  }, {
    "url": "favicon.ico",
    "revision": "4ac1da697dcb8720f10ef4bfc28c84b7"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "72cdb937f1efac181e3308f7f4573a8d"
  }, {
    "url": "assets/index-CQ6DbWck.css",
    "revision": null
  }, {
    "url": "assets/index-CNlUTGX4.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "72cdb937f1efac181e3308f7f4573a8d"
  }, {
    "url": "favicon.ico",
    "revision": "4ac1da697dcb8720f10ef4bfc28c84b7"
  }, {
    "url": "icon.svg",
    "revision": "fcb5a7a615253f57be36606b0d5cd20f"
  }, {
    "url": "pwa-192x192.png",
    "revision": "5d95d56e456377da250723d095801096"
  }, {
    "url": "pwa-512x512.png",
    "revision": "4be010ab8d244e6c97e32a8ee1a8b2fc"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "647951820ea76ebf244836e452fe56db"
  }, {
    "url": "manifest.webmanifest",
    "revision": "3cd9c23e0cf9916a3e1e49b97e5a5284"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/api\.aladhan\.com\/.*/i, new workbox.NetworkFirst({
    "cacheName": "aladhan-api-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 86400
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/api\.alquran\.cloud\/.*/i, new workbox.CacheFirst({
    "cacheName": "alquran-api-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
