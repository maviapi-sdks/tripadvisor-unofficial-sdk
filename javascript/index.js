// Unofficial Tripadvisor API client for JavaScript and TypeScript.
// Not affiliated with Tripadvisor. Endpoint reference: https://maviapi.com/apis/tripadvisor

export const DEMO_KEY = "mvk_test_playground_5f3c1a8d";

/** An error status answered by the API. */
export class ApiError extends Error {
  constructor(status, code, message) {
    super(`${status} ${code}: ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class TripadvisorClient {
  /**
   * With no apiKey it uses the MAVIAPI_API_KEY environment variable, then the
   * shared demo key.
   */
  constructor({ apiKey, baseUrl, timeout = 120_000, fetch: fetcher } = {}) {
    const env = globalThis.process?.env ?? {};
    this.apiKey = apiKey || env.MAVIAPI_API_KEY || DEMO_KEY;
    let root = baseUrl || env.MAVIAPI_BASE_URL || "https://api.maviapi.com";
    while (root.endsWith("/")) root = root.slice(0, -1);
    this.baseUrl = root + "/v1/sites/tripadvisor";
    this.timeout = timeout;
    this.fetch = fetcher ?? ((...args) => globalThis.fetch(...args));
  }

  /**
   * Top attractions / things to do for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  attractions(params) {
    return this.request("/attractions", params, ["geo"]);
  }

  /**
   * Attractions for a location (geo_id), 30 per page with working pagination, an
   * optional category filter, categories and tags as id/name arrays and a description
   * when available.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  attractionsV2(params) {
    return this.request("/attractions-v2", params, ["geo"]);
  }

  /**
   * Trip planner in one call: a place name (or geo_id) is resolved to its location, then
   * its attractions, hotels or restaurants (kind) are listed 30 per page, optionally
   * with the first page of reviews for the top N results. Ambiguous names answer 400
   * with the candidates.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  explore(params) {
    return this.request("/explore", params, ["q"]);
  }

  /**
   * Live date-driven hotel price offers for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  hotelOffers(params) {
    return this.request("/hotel-offers", params, ["geo", "checkInDate", "checkOutDate"]);
  }

  /**
   * Live, dated hotel offers for a location (geo_id), paged through every hotel the site
   * lists: offset reaches data.total (the site's own hotel count), limit up to 100.
   * Optional currency and sort.
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   */
  hotelOffersV2(params) {
    return this.request("/hotel-offers-v2", params, ["geo"]);
  }

  /**
   * Hotels / accommodation for a location (geo_id), 30 per page.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  hotels(params) {
    return this.request("/hotels", params, ["geo"]);
  }

  /**
   * ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).
   *
   * Each successful request uses 1 credit for every 250 rows it returns (at least 1
   * credit).
   */
  hotelsAll(params) {
    return this.request("/hotels-all", params, ["geo"]);
  }

  /**
   * Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
   * total photo count.
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   */
  photos(params) {
    return this.request("/photos", params, ["id"]);
  }

  /**
   * The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
   * the total photo count: offset reaches the total, limit up to the site's own per-call
   * maximum (100).
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   */
  photosV2(params) {
    return this.request("/photos-v2", params, ["id"]);
  }

  /**
   * Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
   * name, rating, review count, ranking, address, coordinates, phone, price level,
   * description, photo count, image, plus amenities (hotels), cuisines (restaurants),
   * opening hours and category. Works for any place id, inside or outside its geo's
   * lists.
   */
  place(params) {
    return this.request("/place", params, ["id", "geo", "type"]);
  }

  /**
   * Places inside a map box (north, south, east, west): attractions, restaurants or
   * hotels, with coordinates, rating, ranking, price level, categories, website, phone,
   * opening hours, address and a thumbnail.
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   */
  placesInArea(params) {
    return this.request("/places-in-area", params, ["north", "south", "east", "west"]);
  }

  /**
   * Restaurants / eateries for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  restaurants(params) {
    return this.request("/restaurants", params, ["geo"]);
  }

  /**
   * Restaurants for a location (geo_id), 30 per page with working pagination, optional
   * cuisine and price range filters, and weekly opening hours when available.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   */
  restaurantsV2(params) {
    return this.request("/restaurants-v2", params, ["geo"]);
  }

  /**
   * Traveler reviews for one place by detail id.
   *
   * Each successful request uses 1 credit for every 15 rows it returns (at least 1
   * credit).
   */
  reviews(params) {
    return this.request("/reviews", params, ["id"]);
  }

  /**
   * Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).
   *
   * Each successful request uses 1 credit for every 10 rows it returns (at least 1
   * credit).
   */
  search(params) {
    return this.request("/search", params, ["q"]);
  }

  /**
   * Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
   * coordinates + thumbnail), optionally biased toward a lat/lng point.
   *
   * Each successful request uses 1 credit for every 10 rows it returns (at least 1
   * credit).
   */
  searchV2(params) {
    return this.request("/search-v2", params, ["q"]);
  }

  /**
   * Geo search v3: resolve a place name to every TripAdvisor location the site's search
   * returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
   * and filtered by kind with types; page with limit/offset.
   *
   * Each successful request uses 1 credit for every 20 rows it returns (at least 1
   * credit).
   */
  searchV3(params) {
    return this.request("/search-v3", params, ["q"]);
  }

  /** GET one endpoint path. Parameters named in the path go there, the rest in the query. */
  async request(path, params = {}, required = []) {
    for (const name of required) {
      if (params[name] == null) throw new TypeError(`Missing required parameter: ${name}`);
    }
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(params)) {
      if (value == null) continue;
      const token = `{${name}}`;
      if (path.includes(token)) path = path.replace(token, encodeURIComponent(String(value)));
      else query.set(name, String(value));
    }
    const search = query.toString();
    const response = await this.fetch(this.baseUrl + path + (search ? `?${search}` : ""), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "User-Agent": "tripadvisor-unofficial-sdk/0.1.0 (javascript)",
      },
      signal: AbortSignal.timeout(this.timeout),
    });
    const text = await response.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {}
    if (!response.ok) {
      throw new ApiError(response.status, body?.error ?? "http_error", body?.message ?? text.slice(0, 200));
    }
    return body;
  }
}
