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
    "url": "test-crop.png",
    "revision": "a7ed4d1d92c54f669e5c025091376944"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "15aa9ccac37dec633db60be178778b48"
  }, {
    "url": "pwa-512x512.png",
    "revision": "5c225ddae01b01abfebb537db8e695e2"
  }, {
    "url": "pwa-192x192.png",
    "revision": "05d7dca71dcdd2f78b8dcf57a4412421"
  }, {
    "url": "index.html",
    "revision": "bec61bbfc60bb44850b47ef737e4c8c6"
  }, {
    "url": "icon.svg",
    "revision": "57cfd89129ca0e4a3fd21db712c90b3a"
  }, {
    "url": "icon-512.png",
    "revision": "5c225ddae01b01abfebb537db8e695e2"
  }, {
    "url": "icon-192.png",
    "revision": "05d7dca71dcdd2f78b8dcf57a4412421"
  }, {
    "url": "favicon.ico",
    "revision": "b4024c622545807ec7b91d03270b5538"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "2a63f80f46885dd85759739128fa7c46"
  }, {
    "url": "assets/index-CQXK4iz7.css",
    "revision": null
  }, {
    "url": "assets/index-B1K9bSyk.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "2a63f80f46885dd85759739128fa7c46"
  }, {
    "url": "favicon.ico",
    "revision": "b4024c622545807ec7b91d03270b5538"
  }, {
    "url": "icon.svg",
    "revision": "57cfd89129ca0e4a3fd21db712c90b3a"
  }, {
    "url": "pwa-192x192.png",
    "revision": "05d7dca71dcdd2f78b8dcf57a4412421"
  }, {
    "url": "pwa-512x512.png",
    "revision": "5c225ddae01b01abfebb537db8e695e2"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "15aa9ccac37dec633db60be178778b48"
  }, {
    "url": "manifest.webmanifest",
    "revision": "25d060dac23bf5e547a12611ca7924bc"
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
