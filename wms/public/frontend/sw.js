try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const St = (t, ...e) => {
  let n = t;
  return e.length > 0 && (n += ` :: ${JSON.stringify(e)}`), n;
}, Tt = St;
class f extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, n) {
    const r = Tt(e, n);
    super(r), this.name = e, this.details = n;
  }
}
const m = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, G = (t) => [m.prefix, t, m.suffix].filter((e) => e && e.length > 0).join("-"), At = (t) => {
  for (const e of Object.keys(m))
    t(e);
}, K = {
  updateDetails: (t) => {
    At((e) => {
      typeof t[e] == "string" && (m[e] = t[e]);
    });
  },
  getGoogleAnalyticsName: (t) => t || G(m.googleAnalytics),
  getPrecacheName: (t) => t || G(m.precache),
  getPrefix: () => m.prefix,
  getRuntimeName: (t) => t || G(m.runtime),
  getSuffix: () => m.suffix
};
function Se(t, e) {
  const n = e();
  return t.waitUntil(n), n;
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
const kt = "__WB_REVISION__";
function Rt(t) {
  if (!t)
    throw new f("add-to-cache-list-unexpected-type", { entry: t });
  if (typeof t == "string") {
    const i = new URL(t, location.href);
    return {
      cacheKey: i.href,
      url: i.href
    };
  }
  const { revision: e, url: n } = t;
  if (!n)
    throw new f("add-to-cache-list-unexpected-type", { entry: t });
  if (!e) {
    const i = new URL(n, location.href);
    return {
      cacheKey: i.href,
      url: i.href
    };
  }
  const r = new URL(n, location.href), s = new URL(n, location.href);
  return r.searchParams.set(kt, e), {
    cacheKey: r.href,
    url: s.href
  };
}
class Dt {
  constructor() {
    this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: e, state: n }) => {
      n && (n.originalRequest = e);
    }, this.cachedResponseWillBeUsed = async ({ event: e, state: n, cachedResponse: r }) => {
      if (e.type === "install" && n && n.originalRequest && n.originalRequest instanceof Request) {
        const s = n.originalRequest.url;
        r ? this.notUpdatedURLs.push(s) : this.updatedURLs.push(s);
      }
      return r;
    };
  }
}
class Ot {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: n, params: r }) => {
      const s = (r == null ? void 0 : r.cacheKey) || this._precacheController.getCacheKeyForURL(n.url);
      return s ? new Request(s, { headers: n.headers }) : n;
    }, this._precacheController = e;
  }
}
let N;
function Nt() {
  if (N === void 0) {
    const t = new Response("");
    if ("body" in t)
      try {
        new Response(t.body), N = !0;
      } catch {
        N = !1;
      }
    N = !1;
  }
  return N;
}
async function Mt(t, e) {
  let n = null;
  if (t.url && (n = new URL(t.url).origin), n !== self.location.origin)
    throw new f("cross-origin-copy-response", { origin: n });
  const r = t.clone(), s = {
    headers: new Headers(r.headers),
    status: r.status,
    statusText: r.statusText
  }, i = e ? e(s) : s, a = Nt() ? r.body : await r.blob();
  return new Response(a, i);
}
const Lt = (t) => new URL(String(t), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function Te(t, e) {
  const n = new URL(t);
  for (const r of e)
    n.searchParams.delete(r);
  return n.href;
}
async function Pt(t, e, n, r) {
  const s = Te(e.url, n);
  if (e.url === s)
    return t.match(e, r);
  const i = Object.assign(Object.assign({}, r), { ignoreSearch: !0 }), a = await t.keys(e, i);
  for (const o of a) {
    const c = Te(o.url, n);
    if (s === c)
      return t.match(o, r);
  }
}
let Bt = class {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, n) => {
      this.resolve = e, this.reject = n;
    });
  }
};
const xt = /* @__PURE__ */ new Set();
async function Ut() {
  for (const t of xt)
    await t();
}
function $t(t) {
  return new Promise((e) => setTimeout(e, t));
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function x(t) {
  return typeof t == "string" ? new Request(t) : t;
}
class Ft {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, n) {
    this._cacheKeys = {}, Object.assign(this, n), this.event = n.event, this._strategy = e, this._handlerDeferred = new Bt(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const r of this._plugins)
      this._pluginStateMap.set(r, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: n } = this;
    let r = x(e);
    if (r.mode === "navigate" && n instanceof FetchEvent && n.preloadResponse) {
      const a = await n.preloadResponse;
      if (a)
        return a;
    }
    const s = this.hasCallback("fetchDidFail") ? r.clone() : null;
    try {
      for (const a of this.iterateCallbacks("requestWillFetch"))
        r = await a({ request: r.clone(), event: n });
    } catch (a) {
      if (a instanceof Error)
        throw new f("plugin-error-request-will-fetch", {
          thrownErrorMessage: a.message
        });
    }
    const i = r.clone();
    try {
      let a;
      a = await fetch(r, r.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const o of this.iterateCallbacks("fetchDidSucceed"))
        a = await o({
          event: n,
          request: i,
          response: a
        });
      return a;
    } catch (a) {
      throw s && await this.runCallbacks("fetchDidFail", {
        error: a,
        event: n,
        originalRequest: s.clone(),
        request: i.clone()
      }), a;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const n = await this.fetch(e), r = n.clone();
    return this.waitUntil(this.cachePut(e, r)), n;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const n = x(e);
    let r;
    const { cacheName: s, matchOptions: i } = this._strategy, a = await this.getCacheKey(n, "read"), o = Object.assign(Object.assign({}, i), { cacheName: s });
    r = await caches.match(a, o);
    for (const c of this.iterateCallbacks("cachedResponseWillBeUsed"))
      r = await c({
        cacheName: s,
        matchOptions: i,
        cachedResponse: r,
        request: a,
        event: this.event
      }) || void 0;
    return r;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, n) {
    const r = x(e);
    await $t(0);
    const s = await this.getCacheKey(r, "write");
    if (!n)
      throw new f("cache-put-with-no-response", {
        url: Lt(s.url)
      });
    const i = await this._ensureResponseSafeToCache(n);
    if (!i)
      return !1;
    const { cacheName: a, matchOptions: o } = this._strategy, c = await self.caches.open(a), l = this.hasCallback("cacheDidUpdate"), u = l ? await Pt(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      c,
      s.clone(),
      ["__WB_REVISION__"],
      o
    ) : null;
    try {
      await c.put(s, l ? i.clone() : i);
    } catch (d) {
      if (d instanceof Error)
        throw d.name === "QuotaExceededError" && await Ut(), d;
    }
    for (const d of this.iterateCallbacks("cacheDidUpdate"))
      await d({
        cacheName: a,
        oldResponse: u,
        newResponse: i.clone(),
        request: s,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, n) {
    const r = `${e.url} | ${n}`;
    if (!this._cacheKeys[r]) {
      let s = e;
      for (const i of this.iterateCallbacks("cacheKeyWillBeUsed"))
        s = x(await i({
          mode: n,
          request: s,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[r] = s;
    }
    return this._cacheKeys[r];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const n of this._strategy.plugins)
      if (e in n)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, n) {
    for (const r of this.iterateCallbacks(e))
      await r(n);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const n of this._strategy.plugins)
      if (typeof n[e] == "function") {
        const r = this._pluginStateMap.get(n);
        yield (i) => {
          const a = Object.assign(Object.assign({}, i), { state: r });
          return n[e](a);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let n = e, r = !1;
    for (const s of this.iterateCallbacks("cacheWillUpdate"))
      if (n = await s({
        request: this.request,
        response: n,
        event: this.event
      }) || void 0, r = !0, !n)
        break;
    return r || n && n.status !== 200 && (n = void 0), n;
  }
}
class jt {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = K.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [n] = this.handleAll(e);
    return n;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const n = e.event, r = typeof e.request == "string" ? new Request(e.request) : e.request, s = "params" in e ? e.params : void 0, i = new Ft(this, { event: n, request: r, params: s }), a = this._getResponse(i, r, n), o = this._awaitComplete(a, i, r, n);
    return [a, o];
  }
  async _getResponse(e, n, r) {
    await e.runCallbacks("handlerWillStart", { event: r, request: n });
    let s;
    try {
      if (s = await this._handle(n, e), !s || s.type === "error")
        throw new f("no-response", { url: n.url });
    } catch (i) {
      if (i instanceof Error) {
        for (const a of e.iterateCallbacks("handlerDidError"))
          if (s = await a({ error: i, event: r, request: n }), s)
            break;
      }
      if (!s)
        throw i;
    }
    for (const i of e.iterateCallbacks("handlerWillRespond"))
      s = await i({ event: r, request: n, response: s });
    return s;
  }
  async _awaitComplete(e, n, r, s) {
    let i, a;
    try {
      i = await e;
    } catch {
    }
    try {
      await n.runCallbacks("handlerDidRespond", {
        event: s,
        request: r,
        response: i
      }), await n.doneWaiting();
    } catch (o) {
      o instanceof Error && (a = o);
    }
    if (await n.runCallbacks("handlerDidComplete", {
      event: s,
      request: r,
      response: i,
      error: a
    }), n.destroy(), a)
      throw a;
  }
}
class y extends jt {
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor(e = {}) {
    e.cacheName = K.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(y.copyRedirectedCacheableResponsesPlugin);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, n) {
    const r = await n.cacheMatch(e);
    return r || (n.event && n.event.type === "install" ? await this._handleInstall(e, n) : await this._handleFetch(e, n));
  }
  async _handleFetch(e, n) {
    let r;
    const s = n.params || {};
    if (this._fallbackToNetwork) {
      const i = s.integrity, a = e.integrity, o = !a || a === i;
      r = await n.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? a || i : void 0
      })), i && o && e.mode !== "no-cors" && (this._useDefaultCacheabilityPluginIfNeeded(), await n.cachePut(e, r.clone()));
    } else
      throw new f("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return r;
  }
  async _handleInstall(e, n) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const r = await n.fetch(e);
    if (!await n.cachePut(e, r.clone()))
      throw new f("bad-precaching-response", {
        url: e.url,
        status: r.status
      });
    return r;
  }
  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, n = 0;
    for (const [r, s] of this.plugins.entries())
      s !== y.copyRedirectedCacheableResponsesPlugin && (s === y.defaultPrecacheCacheabilityPlugin && (e = r), s.cacheWillUpdate && n++);
    n === 0 ? this.plugins.push(y.defaultPrecacheCacheabilityPlugin) : n > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
y.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: t }) {
    return !t || t.status >= 400 ? null : t;
  }
};
y.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: t }) {
    return t.redirected ? await Mt(t) : t;
  }
};
class Ht {
  /**
   * Create a new PrecacheController.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] The cache to use for precaching.
   * @param {string} [options.plugins] Plugins to use when precaching as well
   * as responding to fetch events for precached assets.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor({ cacheName: e, plugins: n = [], fallbackToNetwork: r = !0 } = {}) {
    this._urlsToCacheKeys = /* @__PURE__ */ new Map(), this._urlsToCacheModes = /* @__PURE__ */ new Map(), this._cacheKeysToIntegrities = /* @__PURE__ */ new Map(), this._strategy = new y({
      cacheName: K.getPrecacheName(e),
      plugins: [
        ...n,
        new Ot({ precacheController: this })
      ],
      fallbackToNetwork: r
    }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
  }
  /**
   * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  get strategy() {
    return this._strategy;
  }
  /**
   * Adds items to the precache list, removing any duplicates and
   * stores the files in the
   * {@link workbox-core.cacheNames|"precache cache"} when the service
   * worker installs.
   *
   * This method can be called multiple times.
   *
   * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
   */
  precache(e) {
    this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
   *     Array of entries to precache.
   */
  addToCacheList(e) {
    const n = [];
    for (const r of e) {
      typeof r == "string" ? n.push(r) : r && r.revision === void 0 && n.push(r.url);
      const { cacheKey: s, url: i } = Rt(r), a = typeof r != "string" && r.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(i) && this._urlsToCacheKeys.get(i) !== s)
        throw new f("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(i),
          secondEntry: s
        });
      if (typeof r != "string" && r.integrity) {
        if (this._cacheKeysToIntegrities.has(s) && this._cacheKeysToIntegrities.get(s) !== r.integrity)
          throw new f("add-to-cache-list-conflicting-integrities", {
            url: i
          });
        this._cacheKeysToIntegrities.set(s, r.integrity);
      }
      if (this._urlsToCacheKeys.set(i, s), this._urlsToCacheModes.set(i, a), n.length > 0) {
        const o = `Workbox is precaching URLs without revision info: ${n.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(o);
      }
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.InstallResult>}
   */
  install(e) {
    return Se(e, async () => {
      const n = new Dt();
      this.strategy.plugins.push(n);
      for (const [i, a] of this._urlsToCacheKeys) {
        const o = this._cacheKeysToIntegrities.get(a), c = this._urlsToCacheModes.get(i), l = new Request(i, {
          integrity: o,
          cache: c,
          credentials: "same-origin"
        });
        await Promise.all(this.strategy.handleAll({
          params: { cacheKey: a },
          request: l,
          event: e
        }));
      }
      const { updatedURLs: r, notUpdatedURLs: s } = n;
      return { updatedURLs: r, notUpdatedURLs: s };
    });
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.CleanupResult>}
   */
  activate(e) {
    return Se(e, async () => {
      const n = await self.caches.open(this.strategy.cacheName), r = await n.keys(), s = new Set(this._urlsToCacheKeys.values()), i = [];
      for (const a of r)
        s.has(a.url) || (await n.delete(a), i.push(a.url));
      return { deletedURLs: i };
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(e) {
    const n = new URL(e, location.href);
    return this._urlsToCacheKeys.get(n.href);
  }
  /**
   * @param {string} url A cache key whose SRI you want to look up.
   * @return {string} The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForCacheKey(e) {
    return this._cacheKeysToIntegrities.get(e);
  }
  /**
   * This acts as a drop-in replacement for
   * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param {string|Request} request The key (without revisioning parameters)
   * to look up in the precache.
   * @return {Promise<Response|undefined>}
   */
  async matchPrecache(e) {
    const n = e instanceof Request ? e.url : e, r = this.getCacheKeyForURL(n);
    if (r)
      return (await self.caches.open(this.strategy.cacheName)).match(r);
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @return {workbox-routing~handlerCallback}
   */
  createHandlerBoundToURL(e) {
    const n = this.getCacheKeyForURL(e);
    if (!n)
      throw new f("non-precached-url", { url: e });
    return (r) => (r.request = new Request(e), r.params = Object.assign({ cacheKey: n }, r.params), this.strategy.handle(r));
  }
}
let J;
const je = () => (J || (J = new Ht()), J);
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const He = "GET", U = (t) => t && typeof t == "object" ? t : { handle: t };
class L {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, n, r = He) {
    this.handler = U(n), this.match = e, this.method = r;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = U(e);
  }
}
class Kt extends L {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, n, r) {
    const s = ({ url: i }) => {
      const a = e.exec(i.href);
      if (a && !(i.origin !== location.origin && a.index !== 0))
        return a.slice(1);
    };
    super(s, n, r);
  }
}
class Vt {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: n } = e, r = this.handleRequest({ request: n, event: e });
      r && e.respondWith(r);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: n } = e.data, r = Promise.all(n.urlsToCache.map((s) => {
          typeof s == "string" && (s = [s]);
          const i = new Request(...s);
          return this.handleRequest({ request: i, event: e });
        }));
        e.waitUntil(r), e.ports && e.ports[0] && r.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: n }) {
    const r = new URL(e.url, location.href);
    if (!r.protocol.startsWith("http"))
      return;
    const s = r.origin === location.origin, { params: i, route: a } = this.findMatchingRoute({
      event: n,
      request: e,
      sameOrigin: s,
      url: r
    });
    let o = a && a.handler;
    const c = e.method;
    if (!o && this._defaultHandlerMap.has(c) && (o = this._defaultHandlerMap.get(c)), !o)
      return;
    let l;
    try {
      l = o.handle({ url: r, request: e, event: n, params: i });
    } catch (d) {
      l = Promise.reject(d);
    }
    const u = a && a.catchHandler;
    return l instanceof Promise && (this._catchHandler || u) && (l = l.catch(async (d) => {
      if (u)
        try {
          return await u.handle({ url: r, request: e, event: n, params: i });
        } catch (E) {
          E instanceof Error && (d = E);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: r, request: e, event: n });
      throw d;
    })), l;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: n, request: r, event: s }) {
    const i = this._routes.get(r.method) || [];
    for (const a of i) {
      let o;
      const c = a.match({ url: e, sameOrigin: n, request: r, event: s });
      if (c)
        return o = c, (Array.isArray(o) && o.length === 0 || c.constructor === Object && // eslint-disable-line
        Object.keys(c).length === 0 || typeof c == "boolean") && (o = void 0), { route: a, params: o };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, n = He) {
    this._defaultHandlerMap.set(n, U(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = U(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new f("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const n = this._routes.get(e.method).indexOf(e);
    if (n > -1)
      this._routes.get(e.method).splice(n, 1);
    else
      throw new f("unregister-route-route-not-registered");
  }
}
let M;
const Wt = () => (M || (M = new Vt(), M.addFetchListener(), M.addCacheListener()), M);
function qt(t, e, n) {
  let r;
  if (typeof t == "string") {
    const i = new URL(t, location.href), a = ({ url: o }) => o.href === i.href;
    r = new L(a, e, n);
  } else if (t instanceof RegExp)
    r = new Kt(t, e, n);
  else if (typeof t == "function")
    r = new L(t, e, n);
  else if (t instanceof L)
    r = t;
  else
    throw new f("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return Wt().registerRoute(r), r;
}
function zt(t, e = []) {
  for (const n of [...t.searchParams.keys()])
    e.some((r) => r.test(n)) && t.searchParams.delete(n);
  return t;
}
function* Gt(t, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: n = "index.html", cleanURLs: r = !0, urlManipulation: s } = {}) {
  const i = new URL(t, location.href);
  i.hash = "", yield i.href;
  const a = zt(i, e);
  if (yield a.href, n && a.pathname.endsWith("/")) {
    const o = new URL(a.href);
    o.pathname += n, yield o.href;
  }
  if (r) {
    const o = new URL(a.href);
    o.pathname += ".html", yield o.href;
  }
  if (s) {
    const o = s({ url: i });
    for (const c of o)
      yield c.href;
  }
}
class Jt extends L {
  /**
   * @param {PrecacheController} precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param {Object} [options] Options to control how requests are matched
   * against the list of precached URLs.
   * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
   * check cache entries for a URLs ending with '/' to see if there is a hit when
   * appending the `directoryIndex` value.
   * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
   * array of regex's to remove search params when looking for a cache match.
   * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
   * check the cache for the URL with a `.html` added to the end of the end.
   * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  constructor(e, n) {
    const r = ({ request: s }) => {
      const i = e.getURLsToCacheKeys();
      for (const a of Gt(s.url, n)) {
        const o = i.get(a);
        if (o) {
          const c = e.getIntegrityForCacheKey(o);
          return { cacheKey: o, integrity: c };
        }
      }
    };
    super(r, e.strategy);
  }
}
function Yt(t) {
  const e = je(), n = new Jt(e, t);
  qt(n);
}
const Xt = "-precache-", Qt = async (t, e = Xt) => {
  const r = (await self.caches.keys()).filter((s) => s.includes(e) && s.includes(self.registration.scope) && s !== t);
  return await Promise.all(r.map((s) => self.caches.delete(s))), r;
};
function Zt() {
  self.addEventListener("activate", (t) => {
    const e = K.getPrecacheName();
    t.waitUntil(Qt(e).then((n) => {
    }));
  });
}
function en(t) {
  je().precache(t);
}
function tn(t, e) {
  en(t), Yt(e);
}
function nn() {
  self.addEventListener("activate", () => self.clients.claim());
}
const rn = () => {
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ke = function(t) {
  const e = [];
  let n = 0;
  for (let r = 0; r < t.length; r++) {
    let s = t.charCodeAt(r);
    s < 128 ? e[n++] = s : s < 2048 ? (e[n++] = s >> 6 | 192, e[n++] = s & 63 | 128) : (s & 64512) === 55296 && r + 1 < t.length && (t.charCodeAt(r + 1) & 64512) === 56320 ? (s = 65536 + ((s & 1023) << 10) + (t.charCodeAt(++r) & 1023), e[n++] = s >> 18 | 240, e[n++] = s >> 12 & 63 | 128, e[n++] = s >> 6 & 63 | 128, e[n++] = s & 63 | 128) : (e[n++] = s >> 12 | 224, e[n++] = s >> 6 & 63 | 128, e[n++] = s & 63 | 128);
  }
  return e;
}, sn = function(t) {
  const e = [];
  let n = 0, r = 0;
  for (; n < t.length; ) {
    const s = t[n++];
    if (s < 128)
      e[r++] = String.fromCharCode(s);
    else if (s > 191 && s < 224) {
      const i = t[n++];
      e[r++] = String.fromCharCode((s & 31) << 6 | i & 63);
    } else if (s > 239 && s < 365) {
      const i = t[n++], a = t[n++], o = t[n++], c = ((s & 7) << 18 | (i & 63) << 12 | (a & 63) << 6 | o & 63) - 65536;
      e[r++] = String.fromCharCode(55296 + (c >> 10)), e[r++] = String.fromCharCode(56320 + (c & 1023));
    } else {
      const i = t[n++], a = t[n++];
      e[r++] = String.fromCharCode((s & 15) << 12 | (i & 63) << 6 | a & 63);
    }
  }
  return e.join("");
}, Ve = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob == "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(t, e) {
    if (!Array.isArray(t))
      throw Error("encodeByteArray takes an array as a parameter");
    this.init_();
    const n = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [];
    for (let s = 0; s < t.length; s += 3) {
      const i = t[s], a = s + 1 < t.length, o = a ? t[s + 1] : 0, c = s + 2 < t.length, l = c ? t[s + 2] : 0, u = i >> 2, d = (i & 3) << 4 | o >> 4;
      let E = (o & 15) << 2 | l >> 6, B = l & 63;
      c || (B = 64, a || (E = 64)), r.push(n[u], n[d], n[E], n[B]);
    }
    return r.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? btoa(t) : this.encodeByteArray(Ke(t), e);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? atob(t) : sn(this.decodeStringToByteArray(t, e));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(t, e) {
    this.init_();
    const n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [];
    for (let s = 0; s < t.length; ) {
      const i = n[t.charAt(s++)], o = s < t.length ? n[t.charAt(s)] : 0;
      ++s;
      const l = s < t.length ? n[t.charAt(s)] : 64;
      ++s;
      const d = s < t.length ? n[t.charAt(s)] : 64;
      if (++s, i == null || o == null || l == null || d == null)
        throw new an();
      const E = i << 2 | o >> 4;
      if (r.push(E), l !== 64) {
        const B = o << 4 & 240 | l >> 2;
        if (r.push(B), d !== 64) {
          const vt = l << 6 & 192 | d;
          r.push(vt);
        }
      }
    }
    return r;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
      for (let t = 0; t < this.ENCODED_VALS.length; t++)
        this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t), this.charToByteMap_[this.byteToCharMap_[t]] = t, this.byteToCharMapWebSafe_[t] = this.ENCODED_VALS_WEBSAFE.charAt(t), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t, t >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t);
    }
  }
};
class an extends Error {
  constructor() {
    super(...arguments), this.name = "DecodeBase64StringError";
  }
}
const on = function(t) {
  const e = Ke(t);
  return Ve.encodeByteArray(e, !0);
}, We = function(t) {
  return on(t).replace(/\./g, "");
}, cn = function(t) {
  try {
    return Ve.decodeString(t, !0);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ln() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unable to locate global object.");
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const un = () => ln().__FIREBASE_DEFAULTS__, hn = () => {
  if (typeof process > "u" || typeof process.env > "u")
    return;
  const t = process.env.__FIREBASE_DEFAULTS__;
  if (t)
    return JSON.parse(t);
}, dn = () => {
  if (typeof document > "u")
    return;
  let t;
  try {
    t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch {
    return;
  }
  const e = t && cn(t[1]);
  return e && JSON.parse(e);
}, fn = () => {
  try {
    return rn() || un() || hn() || dn();
  } catch (t) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);
    return;
  }
}, qe = () => {
  var t;
  return (t = fn()) === null || t === void 0 ? void 0 : t.config;
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class pn {
  constructor() {
    this.reject = () => {
    }, this.resolve = () => {
    }, this.promise = new Promise((e, n) => {
      this.resolve = e, this.reject = n;
    });
  }
  /**
   * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(e) {
    return (n, r) => {
      n ? this.reject(n) : this.resolve(r), typeof e == "function" && (this.promise.catch(() => {
      }), e.length === 1 ? e(n) : e(n, r));
    };
  }
}
function ze() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function Ge() {
  return new Promise((t, e) => {
    try {
      let n = !0;
      const r = "validate-browser-context-for-indexeddb-analytics-module", s = self.indexedDB.open(r);
      s.onsuccess = () => {
        s.result.close(), n || self.indexedDB.deleteDatabase(r), t(!0);
      }, s.onupgradeneeded = () => {
        n = !1;
      }, s.onerror = () => {
        var i;
        e(((i = s.error) === null || i === void 0 ? void 0 : i.message) || "");
      };
    } catch (n) {
      e(n);
    }
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gn = "FirebaseError";
class O extends Error {
  constructor(e, n, r) {
    super(n), this.code = e, this.customData = r, this.name = gn, Object.setPrototypeOf(this, O.prototype), Error.captureStackTrace && Error.captureStackTrace(this, V.prototype.create);
  }
}
class V {
  constructor(e, n, r) {
    this.service = e, this.serviceName = n, this.errors = r;
  }
  create(e, ...n) {
    const r = n[0] || {}, s = `${this.service}/${e}`, i = this.errors[e], a = i ? mn(i, r) : "Error", o = `${this.serviceName}: ${a} (${s}).`;
    return new O(s, o, r);
  }
}
function mn(t, e) {
  return t.replace(bn, (n, r) => {
    const s = e[r];
    return s != null ? String(s) : `<${r}?>`;
  });
}
const bn = /\{\$([^}]+)}/g;
function ae(t, e) {
  if (t === e)
    return !0;
  const n = Object.keys(t), r = Object.keys(e);
  for (const s of n) {
    if (!r.includes(s))
      return !1;
    const i = t[s], a = e[s];
    if (Ae(i) && Ae(a)) {
      if (!ae(i, a))
        return !1;
    } else if (i !== a)
      return !1;
  }
  for (const s of r)
    if (!n.includes(s))
      return !1;
  return !0;
}
function Ae(t) {
  return t !== null && typeof t == "object";
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Je(t) {
  return t && t._delegate ? t._delegate : t;
}
class S {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(e, n, r) {
    this.name = e, this.instanceFactory = n, this.type = r, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
  }
  setInstantiationMode(e) {
    return this.instantiationMode = e, this;
  }
  setMultipleInstances(e) {
    return this.multipleInstances = e, this;
  }
  setServiceProps(e) {
    return this.serviceProps = e, this;
  }
  setInstanceCreatedCallback(e) {
    return this.onInstanceCreated = e, this;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const C = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class wn {
  constructor(e, n) {
    this.name = e, this.container = n, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide multiple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(e) {
    const n = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(n)) {
      const r = new pn();
      if (this.instancesDeferred.set(n, r), this.isInitialized(n) || this.shouldAutoInitialize())
        try {
          const s = this.getOrInitializeService({
            instanceIdentifier: n
          });
          s && r.resolve(s);
        } catch {
        }
    }
    return this.instancesDeferred.get(n).promise;
  }
  getImmediate(e) {
    var n;
    const r = this.normalizeInstanceIdentifier(e == null ? void 0 : e.identifier), s = (n = e == null ? void 0 : e.optional) !== null && n !== void 0 ? n : !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({
          instanceIdentifier: r
        });
      } catch (i) {
        if (s)
          return null;
        throw i;
      }
    else {
      if (s)
        return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (this.component = e, !!this.shouldAutoInitialize()) {
      if (_n(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: C });
        } catch {
        }
      for (const [n, r] of this.instancesDeferred.entries()) {
        const s = this.normalizeInstanceIdentifier(n);
        try {
          const i = this.getOrInitializeService({
            instanceIdentifier: s
          });
          r.resolve(i);
        } catch {
        }
      }
    }
  }
  clearInstance(e = C) {
    this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter((n) => "INTERNAL" in n).map((n) => n.INTERNAL.delete()),
      ...e.filter((n) => "_delete" in n).map((n) => n._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = C) {
    return this.instances.has(e);
  }
  getOptions(e = C) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: n = {} } = e, r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const s = this.getOrInitializeService({
      instanceIdentifier: r,
      options: n
    });
    for (const [i, a] of this.instancesDeferred.entries()) {
      const o = this.normalizeInstanceIdentifier(i);
      r === o && a.resolve(s);
    }
    return s;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(e, n) {
    var r;
    const s = this.normalizeInstanceIdentifier(n), i = (r = this.onInitCallbacks.get(s)) !== null && r !== void 0 ? r : /* @__PURE__ */ new Set();
    i.add(e), this.onInitCallbacks.set(s, i);
    const a = this.instances.get(s);
    return a && e(a, s), () => {
      i.delete(e);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(e, n) {
    const r = this.onInitCallbacks.get(n);
    if (r)
      for (const s of r)
        try {
          s(e, n);
        } catch {
        }
  }
  getOrInitializeService({ instanceIdentifier: e, options: n = {} }) {
    let r = this.instances.get(e);
    if (!r && this.component && (r = this.component.instanceFactory(this.container, {
      instanceIdentifier: yn(e),
      options: n
    }), this.instances.set(e, r), this.instancesOptions.set(e, n), this.invokeOnInitCallbacks(r, e), this.component.onInstanceCreated))
      try {
        this.component.onInstanceCreated(this.container, e, r);
      } catch {
      }
    return r || null;
  }
  normalizeInstanceIdentifier(e = C) {
    return this.component ? this.component.multipleInstances ? e : C : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function yn(t) {
  return t === C ? void 0 : t;
}
function _n(t) {
  return t.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class In {
  constructor(e) {
    this.name = e, this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(e) {
    const n = this.getProvider(e.name);
    if (n.isComponentSet())
      throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    n.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(e) {
    if (this.providers.has(e))
      return this.providers.get(e);
    const n = new wn(e, this);
    return this.providers.set(e, n), n;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var h;
(function(t) {
  t[t.DEBUG = 0] = "DEBUG", t[t.VERBOSE = 1] = "VERBOSE", t[t.INFO = 2] = "INFO", t[t.WARN = 3] = "WARN", t[t.ERROR = 4] = "ERROR", t[t.SILENT = 5] = "SILENT";
})(h || (h = {}));
const En = {
  debug: h.DEBUG,
  verbose: h.VERBOSE,
  info: h.INFO,
  warn: h.WARN,
  error: h.ERROR,
  silent: h.SILENT
}, Cn = h.INFO, vn = {
  [h.DEBUG]: "log",
  [h.VERBOSE]: "log",
  [h.INFO]: "info",
  [h.WARN]: "warn",
  [h.ERROR]: "error"
}, Sn = (t, e, ...n) => {
  if (e < t.logLevel)
    return;
  const r = (/* @__PURE__ */ new Date()).toISOString(), s = vn[e];
  if (s)
    console[s](`[${r}]  ${t.name}:`, ...n);
  else
    throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);
};
class Tn {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(e) {
    this.name = e, this._logLevel = Cn, this._logHandler = Sn, this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in h))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? En[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function")
      throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, h.DEBUG, ...e), this._logHandler(this, h.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, h.VERBOSE, ...e), this._logHandler(this, h.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, h.INFO, ...e), this._logHandler(this, h.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, h.WARN, ...e), this._logHandler(this, h.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, h.ERROR, ...e), this._logHandler(this, h.ERROR, ...e);
  }
}
const An = (t, e) => e.some((n) => t instanceof n);
let ke, Re;
function kn() {
  return ke || (ke = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Rn() {
  return Re || (Re = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Ye = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap();
function Dn(t) {
  const e = new Promise((n, r) => {
    const s = () => {
      t.removeEventListener("success", i), t.removeEventListener("error", a);
    }, i = () => {
      n(b(t.result)), s();
    }, a = () => {
      r(t.error), s();
    };
    t.addEventListener("success", i), t.addEventListener("error", a);
  });
  return e.then((n) => {
    n instanceof IDBCursor && Ye.set(n, t);
  }).catch(() => {
  }), fe.set(e, t), e;
}
function On(t) {
  if (oe.has(t))
    return;
  const e = new Promise((n, r) => {
    const s = () => {
      t.removeEventListener("complete", i), t.removeEventListener("error", a), t.removeEventListener("abort", a);
    }, i = () => {
      n(), s();
    }, a = () => {
      r(t.error || new DOMException("AbortError", "AbortError")), s();
    };
    t.addEventListener("complete", i), t.addEventListener("error", a), t.addEventListener("abort", a);
  });
  oe.set(t, e);
}
let ce = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return oe.get(t);
      if (e === "objectStoreNames")
        return t.objectStoreNames || Xe.get(t);
      if (e === "store")
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return b(t[e]);
  },
  set(t, e, n) {
    return t[e] = n, !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  }
};
function Nn(t) {
  ce = t(ce);
}
function Mn(t) {
  return t === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...n) {
    const r = t.call(X(this), e, ...n);
    return Xe.set(r, e.sort ? e.sort() : [e]), b(r);
  } : Rn().includes(t) ? function(...e) {
    return t.apply(X(this), e), b(Ye.get(this));
  } : function(...e) {
    return b(t.apply(X(this), e));
  };
}
function Ln(t) {
  return typeof t == "function" ? Mn(t) : (t instanceof IDBTransaction && On(t), An(t, kn()) ? new Proxy(t, ce) : t);
}
function b(t) {
  if (t instanceof IDBRequest)
    return Dn(t);
  if (Y.has(t))
    return Y.get(t);
  const e = Ln(t);
  return e !== t && (Y.set(t, e), fe.set(e, t)), e;
}
const X = (t) => fe.get(t);
function W(t, e, { blocked: n, upgrade: r, blocking: s, terminated: i } = {}) {
  const a = indexedDB.open(t, e), o = b(a);
  return r && a.addEventListener("upgradeneeded", (c) => {
    r(b(a.result), c.oldVersion, c.newVersion, b(a.transaction), c);
  }), n && a.addEventListener("blocked", (c) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), o.then((c) => {
    i && c.addEventListener("close", () => i()), s && c.addEventListener("versionchange", (l) => s(l.oldVersion, l.newVersion, l));
  }).catch(() => {
  }), o;
}
function Q(t, { blocked: e } = {}) {
  const n = indexedDB.deleteDatabase(t);
  return e && n.addEventListener("blocked", (r) => e(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    r.oldVersion,
    r
  )), b(n).then(() => {
  });
}
const Pn = ["get", "getKey", "getAll", "getAllKeys", "count"], Bn = ["put", "add", "delete", "clear"], Z = /* @__PURE__ */ new Map();
function De(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (Z.get(e))
    return Z.get(e);
  const n = e.replace(/FromIndex$/, ""), r = e !== n, s = Bn.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(s || Pn.includes(n))
  )
    return;
  const i = async function(a, ...o) {
    const c = this.transaction(a, s ? "readwrite" : "readonly");
    let l = c.store;
    return r && (l = l.index(o.shift())), (await Promise.all([
      l[n](...o),
      s && c.done
    ]))[0];
  };
  return Z.set(e, i), i;
}
Nn((t) => ({
  ...t,
  get: (e, n, r) => De(e, n) || t.get(e, n, r),
  has: (e, n) => !!De(e, n) || t.has(e, n)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xn {
  constructor(e) {
    this.container = e;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    return this.container.getProviders().map((n) => {
      if (Un(n)) {
        const r = n.getImmediate();
        return `${r.library}/${r.version}`;
      } else
        return null;
    }).filter((n) => n).join(" ");
  }
}
function Un(t) {
  const e = t.getComponent();
  return (e == null ? void 0 : e.type) === "VERSION";
}
const le = "@firebase/app", Oe = "0.11.2";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const w = new Tn("@firebase/app"), $n = "@firebase/app-compat", Fn = "@firebase/analytics-compat", jn = "@firebase/analytics", Hn = "@firebase/app-check-compat", Kn = "@firebase/app-check", Vn = "@firebase/auth", Wn = "@firebase/auth-compat", qn = "@firebase/database", zn = "@firebase/data-connect", Gn = "@firebase/database-compat", Jn = "@firebase/functions", Yn = "@firebase/functions-compat", Xn = "@firebase/installations", Qn = "@firebase/installations-compat", Zn = "@firebase/messaging", er = "@firebase/messaging-compat", tr = "@firebase/performance", nr = "@firebase/performance-compat", rr = "@firebase/remote-config", sr = "@firebase/remote-config-compat", ir = "@firebase/storage", ar = "@firebase/storage-compat", or = "@firebase/firestore", cr = "@firebase/vertexai", lr = "@firebase/firestore-compat", ur = "firebase";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ue = "[DEFAULT]", hr = {
  [le]: "fire-core",
  [$n]: "fire-core-compat",
  [jn]: "fire-analytics",
  [Fn]: "fire-analytics-compat",
  [Kn]: "fire-app-check",
  [Hn]: "fire-app-check-compat",
  [Vn]: "fire-auth",
  [Wn]: "fire-auth-compat",
  [qn]: "fire-rtdb",
  [zn]: "fire-data-connect",
  [Gn]: "fire-rtdb-compat",
  [Jn]: "fire-fn",
  [Yn]: "fire-fn-compat",
  [Xn]: "fire-iid",
  [Qn]: "fire-iid-compat",
  [Zn]: "fire-fcm",
  [er]: "fire-fcm-compat",
  [tr]: "fire-perf",
  [nr]: "fire-perf-compat",
  [rr]: "fire-rc",
  [sr]: "fire-rc-compat",
  [ir]: "fire-gcs",
  [ar]: "fire-gcs-compat",
  [or]: "fire-fst",
  [lr]: "fire-fst-compat",
  [cr]: "fire-vertex",
  "fire-js": "fire-js",
  // Platform identifier for JS SDK.
  [ur]: "fire-js-all"
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $ = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map();
function Ne(t, e) {
  try {
    t.container.addComponent(e);
  } catch (n) {
    w.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`, n);
  }
}
function D(t) {
  const e = t.name;
  if (he.has(e))
    return w.debug(`There were multiple attempts to register component ${e}.`), !1;
  he.set(e, t);
  for (const n of $.values())
    Ne(n, t);
  for (const n of dr.values())
    Ne(n, t);
  return !0;
}
function pe(t, e) {
  const n = t.container.getProvider("heartbeat").getImmediate({ optional: !0 });
  return n && n.triggerHeartbeat(), t.container.getProvider(e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fr = {
  "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
  "bad-app-name": "Illegal App name: '{$appName}'",
  "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
  "app-deleted": "Firebase App named '{$appName}' already deleted",
  "server-app-deleted": "Firebase Server App has been deleted",
  "no-options": "Need to provide options, when not being deployed to hosting via source.",
  "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  "invalid-log-argument": "First argument to `onLog` must be null or a function.",
  "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
}, I = new V("app", "Firebase", fr);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class pr {
  constructor(e, n, r) {
    this._isDeleted = !1, this._options = Object.assign({}, e), this._config = Object.assign({}, n), this._name = n.name, this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled, this._container = r, this.container.addComponent(new S(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted)
      throw I.create("app-deleted", { appName: this._name });
  }
}
function Qe(t, e = {}) {
  let n = t;
  typeof e != "object" && (e = { name: e });
  const r = Object.assign({ name: ue, automaticDataCollectionEnabled: !1 }, e), s = r.name;
  if (typeof s != "string" || !s)
    throw I.create("bad-app-name", {
      appName: String(s)
    });
  if (n || (n = qe()), !n)
    throw I.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  const i = $.get(s);
  if (i) {
    if (ae(n, i.options) && ae(r, i.config))
      return i;
    throw I.create("duplicate-app", { appName: s });
  }
  const a = new In(s);
  for (const c of he.values())
    a.addComponent(c);
  const o = new pr(n, r, a);
  return $.set(s, o), o;
}
function gr(t = ue) {
  const e = $.get(t);
  if (!e && t === ue && qe())
    return Qe();
  if (!e)
    throw I.create("no-app", { appName: t });
  return e;
}
function R(t, e, n) {
  var r;
  let s = (r = hr[t]) !== null && r !== void 0 ? r : t;
  n && (s += `-${n}`);
  const i = s.match(/\s|\//), a = e.match(/\s|\//);
  if (i || a) {
    const o = [
      `Unable to register library "${s}" with version "${e}":`
    ];
    i && o.push(`library name "${s}" contains illegal characters (whitespace or "/")`), i && a && o.push("and"), a && o.push(`version name "${e}" contains illegal characters (whitespace or "/")`), w.warn(o.join(" "));
    return;
  }
  D(new S(
    `${s}-version`,
    () => ({ library: s, version: e }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mr = "firebase-heartbeat-database", br = 1, P = "firebase-heartbeat-store";
let ee = null;
function Ze() {
  return ee || (ee = W(mr, br, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          try {
            t.createObjectStore(P);
          } catch (n) {
            console.warn(n);
          }
      }
    }
  }).catch((t) => {
    throw I.create("idb-open", {
      originalErrorMessage: t.message
    });
  })), ee;
}
async function wr(t) {
  try {
    const n = (await Ze()).transaction(P), r = await n.objectStore(P).get(et(t));
    return await n.done, r;
  } catch (e) {
    if (e instanceof O)
      w.warn(e.message);
    else {
      const n = I.create("idb-get", {
        originalErrorMessage: e == null ? void 0 : e.message
      });
      w.warn(n.message);
    }
  }
}
async function Me(t, e) {
  try {
    const r = (await Ze()).transaction(P, "readwrite");
    await r.objectStore(P).put(e, et(t)), await r.done;
  } catch (n) {
    if (n instanceof O)
      w.warn(n.message);
    else {
      const r = I.create("idb-set", {
        originalErrorMessage: n == null ? void 0 : n.message
      });
      w.warn(r.message);
    }
  }
}
function et(t) {
  return `${t.name}!${t.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yr = 1024, _r = 30;
class Ir {
  constructor(e) {
    this.container = e, this._heartbeatsCache = null;
    const n = this.container.getProvider("app").getImmediate();
    this._storage = new Cr(n), this._heartbeatsCachePromise = this._storage.read().then((r) => (this._heartbeatsCache = r, r));
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    var e, n;
    try {
      const s = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), i = Le();
      if (((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, ((n = this._heartbeatsCache) === null || n === void 0 ? void 0 : n.heartbeats) == null) || this._heartbeatsCache.lastSentHeartbeatDate === i || this._heartbeatsCache.heartbeats.some((a) => a.date === i))
        return;
      if (this._heartbeatsCache.heartbeats.push({ date: i, agent: s }), this._heartbeatsCache.heartbeats.length > _r) {
        const a = vr(this._heartbeatsCache.heartbeats);
        this._heartbeatsCache.heartbeats.splice(a, 1);
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (r) {
      w.warn(r);
    }
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    var e;
    try {
      if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, ((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0)
        return "";
      const n = Le(), { heartbeatsToSend: r, unsentEntries: s } = Er(this._heartbeatsCache.heartbeats), i = We(JSON.stringify({ version: 2, heartbeats: r }));
      return this._heartbeatsCache.lastSentHeartbeatDate = n, s.length > 0 ? (this._heartbeatsCache.heartbeats = s, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), i;
    } catch (n) {
      return w.warn(n), "";
    }
  }
}
function Le() {
  return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function Er(t, e = yr) {
  const n = [];
  let r = t.slice();
  for (const s of t) {
    const i = n.find((a) => a.agent === s.agent);
    if (i) {
      if (i.dates.push(s.date), Pe(n) > e) {
        i.dates.pop();
        break;
      }
    } else if (n.push({
      agent: s.agent,
      dates: [s.date]
    }), Pe(n) > e) {
      n.pop();
      break;
    }
    r = r.slice(1);
  }
  return {
    heartbeatsToSend: n,
    unsentEntries: r
  };
}
class Cr {
  constructor(e) {
    this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    return ze() ? Ge().then(() => !0).catch(() => !1) : !1;
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const n = await wr(this.app);
      return n != null && n.heartbeats ? n : { heartbeats: [] };
    } else
      return { heartbeats: [] };
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return Me(this.app, {
        lastSentHeartbeatDate: (n = e.lastSentHeartbeatDate) !== null && n !== void 0 ? n : s.lastSentHeartbeatDate,
        heartbeats: e.heartbeats
      });
    } else
      return;
  }
  // add heartbeats
  async add(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return Me(this.app, {
        lastSentHeartbeatDate: (n = e.lastSentHeartbeatDate) !== null && n !== void 0 ? n : s.lastSentHeartbeatDate,
        heartbeats: [
          ...s.heartbeats,
          ...e.heartbeats
        ]
      });
    } else
      return;
  }
}
function Pe(t) {
  return We(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: t })
  ).length;
}
function vr(t) {
  if (t.length === 0)
    return -1;
  let e = 0, n = t[0].date;
  for (let r = 1; r < t.length; r++)
    t[r].date < n && (n = t[r].date, e = r);
  return e;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Sr(t) {
  D(new S(
    "platform-logger",
    (e) => new xn(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), D(new S(
    "heartbeat",
    (e) => new Ir(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), R(le, Oe, t), R(le, Oe, "esm2017"), R("fire-js", "");
}
Sr("");
var Tr = "firebase", Ar = "11.4.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
R(Tr, Ar, "app");
const tt = "@firebase/installations", ge = "0.6.13";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nt = 1e4, rt = `w:${ge}`, st = "FIS_v2", kr = "https://firebaseinstallations.googleapis.com/v1", Rr = 60 * 60 * 1e3, Dr = "installations", Or = "Installations";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Nr = {
  "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
  "not-registered": "Firebase Installation is not registered.",
  "installation-not-found": "Firebase Installation not found.",
  "request-failed": '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
  "app-offline": "Could not process request. Application offline.",
  "delete-pending-registration": "Can't delete installation while there is a pending registration request."
}, T = new V(Dr, Or, Nr);
function it(t) {
  return t instanceof O && t.code.includes(
    "request-failed"
    /* ErrorCode.REQUEST_FAILED */
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function at({ projectId: t }) {
  return `${kr}/projects/${t}/installations`;
}
function ot(t) {
  return {
    token: t.token,
    requestStatus: 2,
    expiresIn: Lr(t.expiresIn),
    creationTime: Date.now()
  };
}
async function ct(t, e) {
  const r = (await e.json()).error;
  return T.create("request-failed", {
    requestName: t,
    serverCode: r.code,
    serverMessage: r.message,
    serverStatus: r.status
  });
}
function lt({ apiKey: t }) {
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": t
  });
}
function Mr(t, { refreshToken: e }) {
  const n = lt(t);
  return n.append("Authorization", Pr(e)), n;
}
async function ut(t) {
  const e = await t();
  return e.status >= 500 && e.status < 600 ? t() : e;
}
function Lr(t) {
  return Number(t.replace("s", "000"));
}
function Pr(t) {
  return `${st} ${t}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Br({ appConfig: t, heartbeatServiceProvider: e }, { fid: n }) {
  const r = at(t), s = lt(t), i = e.getImmediate({
    optional: !0
  });
  if (i) {
    const l = await i.getHeartbeatsHeader();
    l && s.append("x-firebase-client", l);
  }
  const a = {
    fid: n,
    authVersion: st,
    appId: t.appId,
    sdkVersion: rt
  }, o = {
    method: "POST",
    headers: s,
    body: JSON.stringify(a)
  }, c = await ut(() => fetch(r, o));
  if (c.ok) {
    const l = await c.json();
    return {
      fid: l.fid || n,
      registrationStatus: 2,
      refreshToken: l.refreshToken,
      authToken: ot(l.authToken)
    };
  } else
    throw await ct("Create Installation", c);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ht(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function xr(t) {
  return btoa(String.fromCharCode(...t)).replace(/\+/g, "-").replace(/\//g, "_");
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ur = /^[cdef][\w-]{21}$/, de = "";
function $r() {
  try {
    const t = new Uint8Array(17);
    (self.crypto || self.msCrypto).getRandomValues(t), t[0] = 112 + t[0] % 16;
    const n = Fr(t);
    return Ur.test(n) ? n : de;
  } catch {
    return de;
  }
}
function Fr(t) {
  return xr(t).substr(0, 22);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function q(t) {
  return `${t.appName}!${t.appId}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const dt = /* @__PURE__ */ new Map();
function ft(t, e) {
  const n = q(t);
  pt(n, e), jr(n, e);
}
function pt(t, e) {
  const n = dt.get(t);
  if (n)
    for (const r of n)
      r(e);
}
function jr(t, e) {
  const n = Hr();
  n && n.postMessage({ key: t, fid: e }), Kr();
}
let v = null;
function Hr() {
  return !v && "BroadcastChannel" in self && (v = new BroadcastChannel("[Firebase] FID Change"), v.onmessage = (t) => {
    pt(t.data.key, t.data.fid);
  }), v;
}
function Kr() {
  dt.size === 0 && v && (v.close(), v = null);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Vr = "firebase-installations-database", Wr = 1, A = "firebase-installations-store";
let te = null;
function me() {
  return te || (te = W(Vr, Wr, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          t.createObjectStore(A);
      }
    }
  })), te;
}
async function F(t, e) {
  const n = q(t), s = (await me()).transaction(A, "readwrite"), i = s.objectStore(A), a = await i.get(n);
  return await i.put(e, n), await s.done, (!a || a.fid !== e.fid) && ft(t, e.fid), e;
}
async function gt(t) {
  const e = q(t), r = (await me()).transaction(A, "readwrite");
  await r.objectStore(A).delete(e), await r.done;
}
async function z(t, e) {
  const n = q(t), s = (await me()).transaction(A, "readwrite"), i = s.objectStore(A), a = await i.get(n), o = e(a);
  return o === void 0 ? await i.delete(n) : await i.put(o, n), await s.done, o && (!a || a.fid !== o.fid) && ft(t, o.fid), o;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function be(t) {
  let e;
  const n = await z(t.appConfig, (r) => {
    const s = qr(r), i = zr(t, s);
    return e = i.registrationPromise, i.installationEntry;
  });
  return n.fid === de ? { installationEntry: await e } : {
    installationEntry: n,
    registrationPromise: e
  };
}
function qr(t) {
  const e = t || {
    fid: $r(),
    registrationStatus: 0
    /* RequestStatus.NOT_STARTED */
  };
  return mt(e);
}
function zr(t, e) {
  if (e.registrationStatus === 0) {
    if (!navigator.onLine) {
      const s = Promise.reject(T.create(
        "app-offline"
        /* ErrorCode.APP_OFFLINE */
      ));
      return {
        installationEntry: e,
        registrationPromise: s
      };
    }
    const n = {
      fid: e.fid,
      registrationStatus: 1,
      registrationTime: Date.now()
    }, r = Gr(t, n);
    return { installationEntry: n, registrationPromise: r };
  } else
    return e.registrationStatus === 1 ? {
      installationEntry: e,
      registrationPromise: Jr(t)
    } : { installationEntry: e };
}
async function Gr(t, e) {
  try {
    const n = await Br(t, e);
    return F(t.appConfig, n);
  } catch (n) {
    throw it(n) && n.customData.serverCode === 409 ? await gt(t.appConfig) : await F(t.appConfig, {
      fid: e.fid,
      registrationStatus: 0
      /* RequestStatus.NOT_STARTED */
    }), n;
  }
}
async function Jr(t) {
  let e = await Be(t.appConfig);
  for (; e.registrationStatus === 1; )
    await ht(100), e = await Be(t.appConfig);
  if (e.registrationStatus === 0) {
    const { installationEntry: n, registrationPromise: r } = await be(t);
    return r || n;
  }
  return e;
}
function Be(t) {
  return z(t, (e) => {
    if (!e)
      throw T.create(
        "installation-not-found"
        /* ErrorCode.INSTALLATION_NOT_FOUND */
      );
    return mt(e);
  });
}
function mt(t) {
  return Yr(t) ? {
    fid: t.fid,
    registrationStatus: 0
    /* RequestStatus.NOT_STARTED */
  } : t;
}
function Yr(t) {
  return t.registrationStatus === 1 && t.registrationTime + nt < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Xr({ appConfig: t, heartbeatServiceProvider: e }, n) {
  const r = Qr(t, n), s = Mr(t, n), i = e.getImmediate({
    optional: !0
  });
  if (i) {
    const l = await i.getHeartbeatsHeader();
    l && s.append("x-firebase-client", l);
  }
  const a = {
    installation: {
      sdkVersion: rt,
      appId: t.appId
    }
  }, o = {
    method: "POST",
    headers: s,
    body: JSON.stringify(a)
  }, c = await ut(() => fetch(r, o));
  if (c.ok) {
    const l = await c.json();
    return ot(l);
  } else
    throw await ct("Generate Auth Token", c);
}
function Qr(t, { fid: e }) {
  return `${at(t)}/${e}/authTokens:generate`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function we(t, e = !1) {
  let n;
  const r = await z(t.appConfig, (i) => {
    if (!bt(i))
      throw T.create(
        "not-registered"
        /* ErrorCode.NOT_REGISTERED */
      );
    const a = i.authToken;
    if (!e && ts(a))
      return i;
    if (a.requestStatus === 1)
      return n = Zr(t, e), i;
    {
      if (!navigator.onLine)
        throw T.create(
          "app-offline"
          /* ErrorCode.APP_OFFLINE */
        );
      const o = rs(i);
      return n = es(t, o), o;
    }
  });
  return n ? await n : r.authToken;
}
async function Zr(t, e) {
  let n = await xe(t.appConfig);
  for (; n.authToken.requestStatus === 1; )
    await ht(100), n = await xe(t.appConfig);
  const r = n.authToken;
  return r.requestStatus === 0 ? we(t, e) : r;
}
function xe(t) {
  return z(t, (e) => {
    if (!bt(e))
      throw T.create(
        "not-registered"
        /* ErrorCode.NOT_REGISTERED */
      );
    const n = e.authToken;
    return ss(n) ? Object.assign(Object.assign({}, e), { authToken: {
      requestStatus: 0
      /* RequestStatus.NOT_STARTED */
    } }) : e;
  });
}
async function es(t, e) {
  try {
    const n = await Xr(t, e), r = Object.assign(Object.assign({}, e), { authToken: n });
    return await F(t.appConfig, r), n;
  } catch (n) {
    if (it(n) && (n.customData.serverCode === 401 || n.customData.serverCode === 404))
      await gt(t.appConfig);
    else {
      const r = Object.assign(Object.assign({}, e), { authToken: {
        requestStatus: 0
        /* RequestStatus.NOT_STARTED */
      } });
      await F(t.appConfig, r);
    }
    throw n;
  }
}
function bt(t) {
  return t !== void 0 && t.registrationStatus === 2;
}
function ts(t) {
  return t.requestStatus === 2 && !ns(t);
}
function ns(t) {
  const e = Date.now();
  return e < t.creationTime || t.creationTime + t.expiresIn < e + Rr;
}
function rs(t) {
  const e = {
    requestStatus: 1,
    requestTime: Date.now()
  };
  return Object.assign(Object.assign({}, t), { authToken: e });
}
function ss(t) {
  return t.requestStatus === 1 && t.requestTime + nt < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function is(t) {
  const e = t, { installationEntry: n, registrationPromise: r } = await be(e);
  return r ? r.catch(console.error) : we(e).catch(console.error), n.fid;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function as(t, e = !1) {
  const n = t;
  return await os(n), (await we(n, e)).token;
}
async function os(t) {
  const { registrationPromise: e } = await be(t);
  e && await e;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function cs(t) {
  if (!t || !t.options)
    throw ne("App Configuration");
  if (!t.name)
    throw ne("App Name");
  const e = [
    "projectId",
    "apiKey",
    "appId"
  ];
  for (const n of e)
    if (!t.options[n])
      throw ne(n);
  return {
    appName: t.name,
    projectId: t.options.projectId,
    apiKey: t.options.apiKey,
    appId: t.options.appId
  };
}
function ne(t) {
  return T.create("missing-app-config-values", {
    valueName: t
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const wt = "installations", ls = "installations-internal", us = (t) => {
  const e = t.getProvider("app").getImmediate(), n = cs(e), r = pe(e, "heartbeat");
  return {
    app: e,
    appConfig: n,
    heartbeatServiceProvider: r,
    _delete: () => Promise.resolve()
  };
}, hs = (t) => {
  const e = t.getProvider("app").getImmediate(), n = pe(e, wt).getImmediate();
  return {
    getId: () => is(n),
    getToken: (s) => as(n, s)
  };
};
function ds() {
  D(new S(
    wt,
    us,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  )), D(new S(
    ls,
    hs,
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
}
ds();
R(tt, ge);
R(tt, ge, "esm2017");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yt = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4", fs = "https://fcmregistrations.googleapis.com/v1", _t = "FCM_MSG", ps = "google.c.a.c_id", gs = 3, ms = 1;
var j;
(function(t) {
  t[t.DATA_MESSAGE = 1] = "DATA_MESSAGE", t[t.DISPLAY_NOTIFICATION = 3] = "DISPLAY_NOTIFICATION";
})(j || (j = {}));
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
var H;
(function(t) {
  t.PUSH_RECEIVED = "push-received", t.NOTIFICATION_CLICKED = "notification-clicked";
})(H || (H = {}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function g(t) {
  const e = new Uint8Array(t);
  return btoa(String.fromCharCode(...e)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function bs(t) {
  const e = "=".repeat((4 - t.length % 4) % 4), n = (t + e).replace(/\-/g, "+").replace(/_/g, "/"), r = atob(n), s = new Uint8Array(r.length);
  for (let i = 0; i < r.length; ++i)
    s[i] = r.charCodeAt(i);
  return s;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const re = "fcm_token_details_db", ws = 5, Ue = "fcm_token_object_Store";
async function ys(t) {
  if ("databases" in indexedDB && !(await indexedDB.databases()).map((i) => i.name).includes(re))
    return null;
  let e = null;
  return (await W(re, ws, {
    upgrade: async (r, s, i, a) => {
      var o;
      if (s < 2 || !r.objectStoreNames.contains(Ue))
        return;
      const c = a.objectStore(Ue), l = await c.index("fcmSenderId").get(t);
      if (await c.clear(), !!l) {
        if (s === 2) {
          const u = l;
          if (!u.auth || !u.p256dh || !u.endpoint)
            return;
          e = {
            token: u.fcmToken,
            createTime: (o = u.createTime) !== null && o !== void 0 ? o : Date.now(),
            subscriptionOptions: {
              auth: u.auth,
              p256dh: u.p256dh,
              endpoint: u.endpoint,
              swScope: u.swScope,
              vapidKey: typeof u.vapidKey == "string" ? u.vapidKey : g(u.vapidKey)
            }
          };
        } else if (s === 3) {
          const u = l;
          e = {
            token: u.fcmToken,
            createTime: u.createTime,
            subscriptionOptions: {
              auth: g(u.auth),
              p256dh: g(u.p256dh),
              endpoint: u.endpoint,
              swScope: u.swScope,
              vapidKey: g(u.vapidKey)
            }
          };
        } else if (s === 4) {
          const u = l;
          e = {
            token: u.fcmToken,
            createTime: u.createTime,
            subscriptionOptions: {
              auth: g(u.auth),
              p256dh: g(u.p256dh),
              endpoint: u.endpoint,
              swScope: u.swScope,
              vapidKey: g(u.vapidKey)
            }
          };
        }
      }
    }
  })).close(), await Q(re), await Q("fcm_vapid_details_db"), await Q("undefined"), _s(e) ? e : null;
}
function _s(t) {
  if (!t || !t.subscriptionOptions)
    return !1;
  const { subscriptionOptions: e } = t;
  return typeof t.createTime == "number" && t.createTime > 0 && typeof t.token == "string" && t.token.length > 0 && typeof e.auth == "string" && e.auth.length > 0 && typeof e.p256dh == "string" && e.p256dh.length > 0 && typeof e.endpoint == "string" && e.endpoint.length > 0 && typeof e.swScope == "string" && e.swScope.length > 0 && typeof e.vapidKey == "string" && e.vapidKey.length > 0;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Is = "firebase-messaging-database", Es = 1, k = "firebase-messaging-store";
let se = null;
function ye() {
  return se || (se = W(Is, Es, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          t.createObjectStore(k);
      }
    }
  })), se;
}
async function _e(t) {
  const e = Ee(t), r = await (await ye()).transaction(k).objectStore(k).get(e);
  if (r)
    return r;
  {
    const s = await ys(t.appConfig.senderId);
    if (s)
      return await Ie(t, s), s;
  }
}
async function Ie(t, e) {
  const n = Ee(t), s = (await ye()).transaction(k, "readwrite");
  return await s.objectStore(k).put(e, n), await s.done, e;
}
async function Cs(t) {
  const e = Ee(t), r = (await ye()).transaction(k, "readwrite");
  await r.objectStore(k).delete(e), await r.done;
}
function Ee({ appConfig: t }) {
  return t.appId;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const vs = {
  "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
  "only-available-in-window": "This method is available in a Window context.",
  "only-available-in-sw": "This method is available in a service worker context.",
  "permission-default": "The notification permission was not granted and dismissed instead.",
  "permission-blocked": "The notification permission was not granted and blocked instead.",
  "unsupported-browser": "This browser doesn't support the API's required to use the Firebase SDK.",
  "indexed-db-unsupported": "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
  "failed-service-worker-registration": "We are unable to register the default service worker. {$browserErrorMessage}",
  "token-subscribe-failed": "A problem occurred while subscribing the user to FCM: {$errorInfo}",
  "token-subscribe-no-token": "FCM returned no token when subscribing the user to push.",
  "token-unsubscribe-failed": "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
  "token-update-failed": "A problem occurred while updating the user from FCM: {$errorInfo}",
  "token-update-no-token": "FCM returned no token when updating the user to push.",
  "use-sw-after-get-token": "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
  "invalid-sw-registration": "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
  "invalid-bg-handler": "The input to setBackgroundMessageHandler() must be a function.",
  "invalid-vapid-key": "The public VAPID key must be a string.",
  "use-vapid-key-after-get-token": "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
}, p = new V("messaging", "Messaging", vs);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ss(t, e) {
  const n = await ve(t), r = Et(e), s = {
    method: "POST",
    headers: n,
    body: JSON.stringify(r)
  };
  let i;
  try {
    i = await (await fetch(Ce(t.appConfig), s)).json();
  } catch (a) {
    throw p.create("token-subscribe-failed", {
      errorInfo: a == null ? void 0 : a.toString()
    });
  }
  if (i.error) {
    const a = i.error.message;
    throw p.create("token-subscribe-failed", {
      errorInfo: a
    });
  }
  if (!i.token)
    throw p.create(
      "token-subscribe-no-token"
      /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
    );
  return i.token;
}
async function Ts(t, e) {
  const n = await ve(t), r = Et(e.subscriptionOptions), s = {
    method: "PATCH",
    headers: n,
    body: JSON.stringify(r)
  };
  let i;
  try {
    i = await (await fetch(`${Ce(t.appConfig)}/${e.token}`, s)).json();
  } catch (a) {
    throw p.create("token-update-failed", {
      errorInfo: a == null ? void 0 : a.toString()
    });
  }
  if (i.error) {
    const a = i.error.message;
    throw p.create("token-update-failed", {
      errorInfo: a
    });
  }
  if (!i.token)
    throw p.create(
      "token-update-no-token"
      /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
    );
  return i.token;
}
async function It(t, e) {
  const r = {
    method: "DELETE",
    headers: await ve(t)
  };
  try {
    const i = await (await fetch(`${Ce(t.appConfig)}/${e}`, r)).json();
    if (i.error) {
      const a = i.error.message;
      throw p.create("token-unsubscribe-failed", {
        errorInfo: a
      });
    }
  } catch (s) {
    throw p.create("token-unsubscribe-failed", {
      errorInfo: s == null ? void 0 : s.toString()
    });
  }
}
function Ce({ projectId: t }) {
  return `${fs}/projects/${t}/registrations`;
}
async function ve({ appConfig: t, installations: e }) {
  const n = await e.getToken();
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": t.apiKey,
    "x-goog-firebase-installations-auth": `FIS ${n}`
  });
}
function Et({ p256dh: t, auth: e, endpoint: n, vapidKey: r }) {
  const s = {
    web: {
      endpoint: n,
      auth: e,
      p256dh: t
    }
  };
  return r !== yt && (s.web.applicationPubKey = r), s;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const As = 7 * 24 * 60 * 60 * 1e3;
async function ks(t) {
  const e = await Ds(t.swRegistration, t.vapidKey), n = {
    vapidKey: t.vapidKey,
    swScope: t.swRegistration.scope,
    endpoint: e.endpoint,
    auth: g(e.getKey("auth")),
    p256dh: g(e.getKey("p256dh"))
  }, r = await _e(t.firebaseDependencies);
  if (r) {
    if (Os(r.subscriptionOptions, n))
      return Date.now() >= r.createTime + As ? Rs(t, {
        token: r.token,
        createTime: Date.now(),
        subscriptionOptions: n
      }) : r.token;
    try {
      await It(t.firebaseDependencies, r.token);
    } catch (s) {
      console.warn(s);
    }
    return Fe(t.firebaseDependencies, n);
  } else
    return Fe(t.firebaseDependencies, n);
}
async function $e(t) {
  const e = await _e(t.firebaseDependencies);
  e && (await It(t.firebaseDependencies, e.token), await Cs(t.firebaseDependencies));
  const n = await t.swRegistration.pushManager.getSubscription();
  return n ? n.unsubscribe() : !0;
}
async function Rs(t, e) {
  try {
    const n = await Ts(t.firebaseDependencies, e), r = Object.assign(Object.assign({}, e), { token: n, createTime: Date.now() });
    return await Ie(t.firebaseDependencies, r), n;
  } catch (n) {
    throw n;
  }
}
async function Fe(t, e) {
  const r = {
    token: await Ss(t, e),
    createTime: Date.now(),
    subscriptionOptions: e
  };
  return await Ie(t, r), r.token;
}
async function Ds(t, e) {
  const n = await t.pushManager.getSubscription();
  return n || t.pushManager.subscribe({
    userVisibleOnly: !0,
    // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
    // submitted to pushManager#subscribe must be of type Uint8Array.
    applicationServerKey: bs(e)
  });
}
function Os(t, e) {
  const n = e.vapidKey === t.vapidKey, r = e.endpoint === t.endpoint, s = e.auth === t.auth, i = e.p256dh === t.p256dh;
  return n && r && s && i;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ns(t) {
  const e = {
    from: t.from,
    // eslint-disable-next-line camelcase
    collapseKey: t.collapse_key,
    // eslint-disable-next-line camelcase
    messageId: t.fcmMessageId
  };
  return Ms(e, t), Ls(e, t), Ps(e, t), e;
}
function Ms(t, e) {
  if (!e.notification)
    return;
  t.notification = {};
  const n = e.notification.title;
  n && (t.notification.title = n);
  const r = e.notification.body;
  r && (t.notification.body = r);
  const s = e.notification.image;
  s && (t.notification.image = s);
  const i = e.notification.icon;
  i && (t.notification.icon = i);
}
function Ls(t, e) {
  e.data && (t.data = e.data);
}
function Ps(t, e) {
  var n, r, s, i, a;
  if (!e.fcmOptions && !(!((n = e.notification) === null || n === void 0) && n.click_action))
    return;
  t.fcmOptions = {};
  const o = (s = (r = e.fcmOptions) === null || r === void 0 ? void 0 : r.link) !== null && s !== void 0 ? s : (i = e.notification) === null || i === void 0 ? void 0 : i.click_action;
  o && (t.fcmOptions.link = o);
  const c = (a = e.fcmOptions) === null || a === void 0 ? void 0 : a.analytics_label;
  c && (t.fcmOptions.analyticsLabel = c);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Bs(t) {
  return typeof t == "object" && !!t && ps in t;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function xs(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Hs("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
async function Us(t, e) {
  const n = $s(e, await t.firebaseDependencies.installations.getId());
  Fs(t, n, e.productId);
}
function $s(t, e) {
  var n, r;
  const s = {};
  return t.from && (s.project_number = t.from), t.fcmMessageId && (s.message_id = t.fcmMessageId), s.instance_id = e, t.notification ? s.message_type = j.DISPLAY_NOTIFICATION.toString() : s.message_type = j.DATA_MESSAGE.toString(), s.sdk_platform = gs.toString(), s.package_name = self.origin.replace(/(^\w+:|^)\/\//, ""), t.collapse_key && (s.collapse_key = t.collapse_key), s.event = ms.toString(), !((n = t.fcmOptions) === null || n === void 0) && n.analytics_label && (s.analytics_label = (r = t.fcmOptions) === null || r === void 0 ? void 0 : r.analytics_label), s;
}
function Fs(t, e, n) {
  const r = {};
  r.event_time_ms = Math.floor(Date.now()).toString(), r.source_extension_json_proto3 = JSON.stringify({
    messaging_client_event: e
  }), n && (r.compliance_data = js(n)), t.logEvents.push(r);
}
function js(t) {
  return {
    privacy_context: {
      prequest: {
        origin_associated_product_id: t
      }
    }
  };
}
function Hs(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r++)
    n.push(t.charAt(r)), r < e.length && n.push(e.charAt(r));
  return n.join("");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ks(t, e) {
  var n, r;
  const { newSubscription: s } = t;
  if (!s) {
    await $e(e);
    return;
  }
  const i = await _e(e.firebaseDependencies);
  await $e(e), e.vapidKey = (r = (n = i == null ? void 0 : i.subscriptionOptions) === null || n === void 0 ? void 0 : n.vapidKey) !== null && r !== void 0 ? r : yt, await ks(e);
}
async function Vs(t, e) {
  const n = zs(t);
  if (!n)
    return;
  e.deliveryMetricsExportedToBigQueryEnabled && await Us(e, n);
  const r = await Ct();
  if (Js(r))
    return Ys(r, n);
  if (n.notification && await Xs(qs(n)), !!e && e.onBackgroundMessageHandler) {
    const s = Ns(n);
    typeof e.onBackgroundMessageHandler == "function" ? await e.onBackgroundMessageHandler(s) : e.onBackgroundMessageHandler.next(s);
  }
}
async function Ws(t) {
  var e, n;
  const r = (n = (e = t.notification) === null || e === void 0 ? void 0 : e.data) === null || n === void 0 ? void 0 : n[_t];
  if (r) {
    if (t.action)
      return;
  } else
    return;
  t.stopImmediatePropagation(), t.notification.close();
  const s = Qs(r);
  if (!s)
    return;
  const i = new URL(s, self.location.href), a = new URL(self.location.origin);
  if (i.host !== a.host)
    return;
  let o = await Gs(i);
  if (o ? o = await o.focus() : (o = await self.clients.openWindow(s), await xs(3e3)), !!o)
    return r.messageType = H.NOTIFICATION_CLICKED, r.isFirebaseMessaging = !0, o.postMessage(r);
}
function qs(t) {
  const e = Object.assign({}, t.notification);
  return e.data = {
    [_t]: t
  }, e;
}
function zs({ data: t }) {
  if (!t)
    return null;
  try {
    return t.json();
  } catch {
    return null;
  }
}
async function Gs(t) {
  const e = await Ct();
  for (const n of e) {
    const r = new URL(n.url, self.location.href);
    if (t.host === r.host)
      return n;
  }
  return null;
}
function Js(t) {
  return t.some((e) => e.visibilityState === "visible" && // Ignore chrome-extension clients as that matches the background pages of extensions, which
  // are always considered visible for some reason.
  !e.url.startsWith("chrome-extension://"));
}
function Ys(t, e) {
  e.isFirebaseMessaging = !0, e.messageType = H.PUSH_RECEIVED;
  for (const n of t)
    n.postMessage(e);
}
function Ct() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: !0
    // TS doesn't know that "type: 'window'" means it'll return WindowClient[]
  });
}
function Xs(t) {
  var e;
  const { actions: n } = t, { maxActions: r } = Notification;
  return n && r && n.length > r && console.warn(`This browser only supports ${r} actions. The remaining actions will not be displayed.`), self.registration.showNotification(
    /* title= */
    (e = t.title) !== null && e !== void 0 ? e : "",
    t
  );
}
function Qs(t) {
  var e, n, r;
  const s = (n = (e = t.fcmOptions) === null || e === void 0 ? void 0 : e.link) !== null && n !== void 0 ? n : (r = t.notification) === null || r === void 0 ? void 0 : r.click_action;
  return s || (Bs(t.data) ? self.location.origin : null);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Zs(t) {
  if (!t || !t.options)
    throw ie("App Configuration Object");
  if (!t.name)
    throw ie("App Name");
  const e = [
    "projectId",
    "apiKey",
    "appId",
    "messagingSenderId"
  ], { options: n } = t;
  for (const r of e)
    if (!n[r])
      throw ie(r);
  return {
    appName: t.name,
    projectId: n.projectId,
    apiKey: n.apiKey,
    appId: n.appId,
    senderId: n.messagingSenderId
  };
}
function ie(t) {
  return p.create("missing-app-config-values", {
    valueName: t
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ei {
  constructor(e, n, r) {
    this.deliveryMetricsExportedToBigQueryEnabled = !1, this.onBackgroundMessageHandler = null, this.onMessageHandler = null, this.logEvents = [], this.isLogServiceStarted = !1;
    const s = Zs(e);
    this.firebaseDependencies = {
      app: e,
      appConfig: s,
      installations: n,
      analyticsProvider: r
    };
  }
  _delete() {
    return Promise.resolve();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ti = (t) => {
  const e = new ei(t.getProvider("app").getImmediate(), t.getProvider("installations-internal").getImmediate(), t.getProvider("analytics-internal"));
  return self.addEventListener("push", (n) => {
    n.waitUntil(Vs(n, e));
  }), self.addEventListener("pushsubscriptionchange", (n) => {
    n.waitUntil(Ks(n, e));
  }), self.addEventListener("notificationclick", (n) => {
    n.waitUntil(Ws(n));
  }), e;
};
function ni() {
  D(new S(
    "messaging-sw",
    ti,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function ri() {
  return ze() && await Ge() && "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function si(t, e) {
  if (self.document !== void 0)
    throw p.create(
      "only-available-in-sw"
      /* ErrorCode.AVAILABLE_IN_SW */
    );
  return t.onBackgroundMessageHandler = e, () => {
    t.onBackgroundMessageHandler = null;
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ii(t = gr()) {
  return ri().then((e) => {
    if (!e)
      throw p.create(
        "unsupported-browser"
        /* ErrorCode.UNSUPPORTED_BROWSER */
      );
  }, (e) => {
    throw p.create(
      "indexed-db-unsupported"
      /* ErrorCode.INDEXED_DB_UNSUPPORTED */
    );
  }), pe(Je(t), "messaging-sw").getImmediate();
}
function ai(t, e) {
  return t = Je(t), si(t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
ni();
tn([{"revision":null,"url":"assets/axios-fc3df026.js"},{"revision":null,"url":"assets/BaseLayout-ecda517c.js"},{"revision":null,"url":"assets/BinInquiry-556725ba.css"},{"revision":null,"url":"assets/BinInquiry-fad50131.js"},{"revision":null,"url":"assets/CheckInPanel-06440823.js"},{"revision":null,"url":"assets/claims-a7e597d7.js"},{"revision":null,"url":"assets/CustomIonModal-3b018d4e.js"},{"revision":null,"url":"assets/Dashboard-382c6b88.js"},{"revision":null,"url":"assets/Dashboard-75a40c9c.js"},{"revision":null,"url":"assets/Dashboard-a93068a4.js"},{"revision":null,"url":"assets/Deliver-3137f8d3.css"},{"revision":null,"url":"assets/Deliver-faa83c63.js"},{"revision":null,"url":"assets/dialogs-5ef8fe9b.js"},{"revision":null,"url":"assets/EmployeeAdvanceBalance-87d787d4.js"},{"revision":null,"url":"assets/EmployeeAdvanceIcon-5da1f595.js"},{"revision":null,"url":"assets/EmployeeAdvanceItem-01c7faac.js"},{"revision":null,"url":"assets/EmployeeAvatar-0fff1228.js"},{"revision":null,"url":"assets/ExpenseAdvancesTable-05a9e94a.js"},{"revision":null,"url":"assets/ExpenseClaimItem-25e12d04.js"},{"revision":null,"url":"assets/ExpenseClaimSummary-2317641a.js"},{"revision":null,"url":"assets/ExpenseIcon-2fe0be86.js"},{"revision":null,"url":"assets/ExpenseItems-3098f5e1.js"},{"revision":null,"url":"assets/ExpensesTable-df2e2dc8.js"},{"revision":null,"url":"assets/ExpenseTaxesTable-b687a175.js"},{"revision":null,"url":"assets/FileUploaderView-60e84c6b.css"},{"revision":null,"url":"assets/FileUploaderView-c98fea24.js"},{"revision":null,"url":"assets/focus-visible-9c13edeb.js"},{"revision":null,"url":"assets/FontColor-d469f873.js"},{"revision":null,"url":"assets/formatters-e2b36d58.js"},{"revision":null,"url":"assets/FormField-d154d136.js"},{"revision":null,"url":"assets/FormView-3f545805.css"},{"revision":null,"url":"assets/FormView-b4565b9a.js"},{"revision":null,"url":"assets/frappe-ui-0831b670.css"},{"revision":null,"url":"assets/frappe-ui-cec019df.js"},{"revision":null,"url":"assets/Holidays-f0d961ca.js"},{"revision":null,"url":"assets/Home-67fe74e4.css"},{"revision":null,"url":"assets/Home-9e0f0c9c.js"},{"revision":null,"url":"assets/index-0e5fa8f2.js"},{"revision":null,"url":"assets/index-95e515d9.js"},{"revision":null,"url":"assets/index-e04b600e.css"},{"revision":null,"url":"assets/index9-604afd31.js"},{"revision":null,"url":"assets/input-shims-0bf981d2.js"},{"revision":null,"url":"assets/InsertImage-414d520c.js"},{"revision":null,"url":"assets/InsertLink-f0c4ea92.js"},{"revision":null,"url":"assets/InsertVideo-ecb11731.js"},{"revision":null,"url":"assets/ios.transition-3b9e0d6a.js"},{"revision":null,"url":"assets/ItemInquiry-29797d13.js"},{"revision":null,"url":"assets/ItemInquiry-63357eab.css"},{"revision":null,"url":"assets/LeaveBalance-4581e8d7.js"},{"revision":null,"url":"assets/LeaveIcon-4c02e396.js"},{"revision":null,"url":"assets/LeaveRequestItem-5f50263b.js"},{"revision":null,"url":"assets/leaves-3a895d25.js"},{"revision":null,"url":"assets/ListFiltersActionSheet-f7e82892.js"},{"revision":null,"url":"assets/ListView-620c05a0.js"},{"revision":null,"url":"assets/Loading-4fb96fca.js"},{"revision":null,"url":"assets/Loading-72c4fa86.css"},{"revision":null,"url":"assets/Login-749f9c81.js"},{"revision":null,"url":"assets/MaterialRequest-a800c655.js"},{"revision":null,"url":"assets/MaterialRequestList-03b15af7.js"},{"revision":null,"url":"assets/md.transition-8519bd62.js"},{"revision":null,"url":"assets/newdashbord-d3dab499.js"},{"revision":null,"url":"assets/NewDelivery-73a38106.js"},{"revision":null,"url":"assets/NewDelivery-bc2f9d78.css"},{"revision":null,"url":"assets/NewMaterialRequest-09a53a79.css"},{"revision":null,"url":"assets/NewMaterialRequest-f12d2d91.js"},{"revision":null,"url":"assets/NewPacking-26900258.js"},{"revision":null,"url":"assets/NewPacking-609b3df5.css"},{"revision":null,"url":"assets/NewQualityInspection-24571c76.css"},{"revision":null,"url":"assets/NewQualityInspection-d8fd708f.js"},{"revision":null,"url":"assets/NewStockCount-0bb67af3.css"},{"revision":null,"url":"assets/NewStockCount-0d238df9.js"},{"revision":null,"url":"assets/NewStockEntry-5ba8787e.js"},{"revision":null,"url":"assets/notifications-0a235be6.js"},{"revision":null,"url":"assets/Notifications-b054fc1e.js"},{"revision":null,"url":"assets/Packing-9d5b0730.js"},{"revision":null,"url":"assets/PickList-976650e2.js"},{"revision":null,"url":"assets/Picklist2-8fc90293.js"},{"revision":null,"url":"assets/Picklist2-97d9c262.css"},{"revision":null,"url":"assets/PrintLab-40453115.css"},{"revision":null,"url":"assets/PrintLab-b394c65f.js"},{"revision":null,"url":"assets/Profile-34ff45c8.js"},{"revision":null,"url":"assets/ProfileInfoModal-4eb1e809.js"},{"revision":null,"url":"assets/PurchaceSummary-2e99f5f3.js"},{"revision":null,"url":"assets/PurchaceSummary-a99525a1.css"},{"revision":null,"url":"assets/quagga.min-73bcc46f.js"},{"revision":null,"url":"assets/QualityInspection-5d920b21.js"},{"revision":null,"url":"assets/QualityInspection-73beb52b.css"},{"revision":null,"url":"assets/QuickLinks-6574cfa1.js"},{"revision":null,"url":"assets/realtime-0afd5b43.js"},{"revision":null,"url":"assets/ReceivePage-8efc3aba.js"},{"revision":null,"url":"assets/ReceivePage-bfa376a9.css"},{"revision":null,"url":"assets/Register-204935d3.css"},{"revision":null,"url":"assets/Register-51f8f472.js"},{"revision":null,"url":"assets/RequestActionSheet-ff020a17.css"},{"revision":null,"url":"assets/RequestActionSheet.vue_vue_type_style_index_0_scoped_5369b918_lang-32e4c0e0.js"},{"revision":null,"url":"assets/RequestList-787fbb4d.js"},{"revision":null,"url":"assets/RequestPanel-bae3bc49.js"},{"revision":null,"url":"assets/SalaryDetailTable-094751ff.js"},{"revision":null,"url":"assets/SalaryIcon-dc39e6dc.js"},{"revision":null,"url":"assets/SalarySlipItem-6868021e.js"},{"revision":null,"url":"assets/SemicircleChart-c1d1cfd2.js"},{"revision":null,"url":"assets/ShippingSummary-ed7e3346.js"},{"revision":null,"url":"assets/status-tap-7f670f5e.js"},{"revision":null,"url":"assets/StockCount-37bfb5c9.js"},{"revision":null,"url":"assets/StockCount-e27ec5af.css"},{"revision":null,"url":"assets/StockEntryList-a11f7f77.js"},{"revision":null,"url":"assets/StockEntryList-cd190c4a.css"},{"revision":null,"url":"assets/swipe-back-1d977606.js"},{"revision":null,"url":"assets/TabButtons-8724663b.js"},{"revision":null,"url":"assets/TabButtons-92f0e1e8.css"},{"revision":"2f97d86dd8bd2c8c822b997a3ac570ad","url":"frappe-push-notification.js"},{"revision":"17c6df86b353efa01f90501c708ad0ab","url":"index.html"},{"revision":"36f1ef030bc7913b9cc5cfd8db1b4357","url":"manifest.webmanifest"}]);
Zt();
const oi = new URL(location).searchParams.get("config");
try {
  let n = function() {
    return navigator.userAgent.toLowerCase().includes("chrome");
  };
  var li = n;
  const t = Qe(JSON.parse(oi)), e = ii(t);
  ai(e, (r) => {
    const s = r.data.title;
    let i = {
      body: r.data.body || ""
    };
    r.data.notification_icon && (i.icon = r.data.notification_icon), n() ? i.data = {
      url: r.data.click_action
    } : r.data.click_action && (i.actions = [
      {
        action: r.data.click_action,
        title: "View Details"
      }
    ]), self.registration.showNotification(s, i);
  }), n() && self.addEventListener("notificationclick", (r) => {
    r.stopImmediatePropagation(), r.notification.close(), r.notification.data && r.notification.data.url && clients.openWindow(r.notification.data.url);
  });
} catch (t) {
  console.log("Failed to initialize Firebase", t);
}
self.skipWaiting();
nn();
console.log("Service Worker Initialized");
