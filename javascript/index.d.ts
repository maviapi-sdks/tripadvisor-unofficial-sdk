export declare const DEMO_KEY: string;

export interface ClientOptions {
  /** Your maviapi API key. Default: the MAVIAPI_API_KEY environment variable, then the shared demo key. */
  apiKey?: string;
  baseUrl?: string;
  /** Milliseconds. Default 120000. */
  timeout?: number;
  fetch?: typeof fetch;
}

/** An error status answered by the API. */
export declare class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string);
}

export interface AttractionsParams {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * 1-based source page (30 results each)
   */
  "page"?: number;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface AttractionsV2Params {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * 1-based source page, 30 attractions each (page N returns ranks 30*(N-1)+1 to 30*N)
   */
  "page"?: number;
  /**
   * Optional attraction category id: 47 Sights & Landmarks, 49 Museums, 57 Nature &
   * Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41 Classes & Workshops, 48
   * Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos & Gambling, 55 Boat Tours &
   * Water Sports. The ids the geo offers are listed in data.available_categories. One
   * of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
   */
  "category"?: string;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface ExploreParams {
  /**
   * A place name (city, region or country), qualified with its region or country when
   * several places share the name ("Paris, France", "Paris, Texas"), or a numeric
   * geo_id. Case and accents are ignored. An ambiguous or unknown name answers 400 with
   * the candidate places
   */
  "q": string;
  /**
   * What to list for the place. One of: attractions, hotels, restaurants
   */
  "kind"?: string;
  /**
   * Attach the first page of reviews (15) to the top N results of the page; 0 for none.
   * A review lookup that fails leaves that result's reviews null. One of: 0, 1, 2, 3, 4,
   * 5
   */
  "reviews"?: number;
  /**
   * 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to 30*N); up to 333 for
   * restaurants, 1000 otherwise
   */
  "page"?: number;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface HotelOffersParams {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * Check-in date (YYYY-MM-DD)
   */
  "checkInDate": string;
  /**
   * Check-out date (YYYY-MM-DD)
   */
  "checkOutDate": string;
  /**
   * Number of adults
   */
  "adults"?: number;
  /**
   * Number of rooms
   */
  "rooms"?: number;
  /**
   * Comma-separated children ages, e.g. 4,9
   */
  "childrenAges"?: string;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface HotelOffersV2Params {
  /**
   * TripAdvisor geo_id from /search (e.g. 187147 Paris, 60763 New York City)
   */
  "geo": string;
  /**
   * Check-in date (YYYY-MM-DD, today or later). Default: 30 days from today
   */
  "checkInDate"?: string;
  /**
   * Check-out date (YYYY-MM-DD, after checkInDate). Default: checkInDate + 2 nights
   */
  "checkOutDate"?: string;
  /**
   * Number of adults (1-16)
   */
  "adults"?: number;
  /**
   * Number of rooms (1-8)
   */
  "rooms"?: number;
  /**
   * Comma-separated children ages 0-17, e.g. 4,9
   */
  "childrenAges"?: string;
  /**
   * ISO 4217 currency the offers are priced in (e.g. USD, EUR, GBP, TRY)
   */
  "currency"?: string;
  /**
   * Order of the list: POPULARITY (traveler ranked), BEST_VALUE, PRICE_LOW_TO_HIGH or
   * DISTANCE (to the city center). One of: POPULARITY, BEST_VALUE, PRICE_LOW_TO_HIGH,
   * DISTANCE
   */
  "sort"?: string;
  /**
   * Hotels per page (1-100)
   */
  "limit"?: number;
  /**
   * Hotels to skip; walk it up to pagination.total to reach every hotel of the location
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface HotelsParams {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * 1-based source page (30 results each)
   */
  "page"?: number;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface HotelsAllParams {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * How many hotels to return, e.g. 100 / 250 / 1000 (max 1000). The full set (up to
   * 1000) is fetched and cached per geo; ?limit slices it
   */
  "limit"?: number;
  /**
   * Offset within the fetched set
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface PhotosParams {
  /**
   * TripAdvisor detail id of a hotel, restaurant or attraction (the id the list
   * endpoints return, the d<id> in a place URL)
   */
  "id": string;
  /**
   * Photos per page (1-30)
   */
  "limit"?: number;
  /**
   * Photo offset within the gallery's first 100 photos
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface PhotosV2Params {
  /**
   * TripAdvisor detail id of a hotel, restaurant or attraction (the id the list
   * endpoints return, the d<id> in a place URL)
   */
  "id": string;
  /**
   * Photos per call, up to the site's own per-call maximum (100)
   */
  "limit"?: number;
  /**
   * Photo offset within the whole gallery; valid up to data.total
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface PlaceParams {
  /**
   * TripAdvisor detail id (the `id` field from a list endpoint)
   */
  "id": string;
  /**
   * TripAdvisor geo_id the place belongs to (the `geo_id` of a list row). Used to find
   * the place's list row for ranking and amenities; a place outside that list is still
   * answered
   */
  "geo": string;
  /**
   * Place type: hotel, restaurant or attraction. One of: hotel, restaurant, attraction
   */
  "type": string;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface RestaurantsParams {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * 1-based source page (30 results each)
   */
  "page"?: number;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface RestaurantsV2Params {
  /**
   * TripAdvisor geo_id from /search
   */
  "geo": string;
  /**
   * 1-based page, 30 restaurants each (page N returns ranks 30*(N-1)+1 to 30*N, the next
   * 30 distinct restaurants)
   */
  "page"?: number;
  /**
   * Optional cuisine filter: a cuisine name or id (e.g. Seafood or 10643, Turkish or
   * 10663, Italian or 4617); comma-separate several to match any of them. The cuisines a
   * geo offers are listed in data.available_cuisines
   */
  "cuisine"?: string;
  /**
   * Optional price range filter: cheap (Cheap Eats, $), mid (Mid-range, $ - $$) or fine
   * (Fine Dining, $$); comma-separate several (e.g. cheap,mid). One of: cheap, mid, fine
   */
  "price"?: string;
  /**
   * Max items returned from the page
   */
  "limit"?: number;
  /**
   * Item offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface ReviewsParams {
  /**
   * TripAdvisor detail id (from a list endpoint)
   */
  "id": string;
  /**
   * Ignored: accepted for compatibility with the other detail endpoints; reviews are
   * looked up by id alone
   */
  "geo"?: string;
  /**
   * Ignored: accepted for compatibility with the other detail endpoints; reviews are
   * looked up by id alone. One of: hotel, restaurant, attraction
   */
  "type"?: string;
  /**
   * 1-based page; ~18 reviews on page 1, deeper pages best-effort (10 each)
   */
  "page"?: number;
  /**
   * Max reviews returned
   */
  "limit"?: number;
  /**
   * Review offset within the page
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface SearchParams {
  /**
   * Place name to resolve, e.g. a city or country
   */
  "q": string;
  /**
   * Ignored: accepted so older calls stay valid; results are not filtered by type. Use
   * /search-v3?types= to filter
   */
  "types"?: string;
  /**
   * Max results per page
   */
  "limit"?: number;
  /**
   * Result offset
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface SearchV2Params {
  /**
   * Place or venue name to resolve, e.g. a city, landmark or hotel
   */
  "q": string;
  /**
   * Optional latitude to bias results toward (give together with lng)
   */
  "lat"?: number;
  /**
   * Optional longitude to bias results toward (give together with lat)
   */
  "lng"?: number;
  /**
   * Ignored: accepted so older calls stay valid; results are not filtered by type. Use
   * /search-v3?types= to filter
   */
  "types"?: string;
  /**
   * Max results per page (the endpoint returns at most 10 locations)
   */
  "limit"?: number;
  /**
   * Result offset
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export interface SearchV3Params {
  /**
   * Place or venue name to resolve, e.g. a city, landmark or hotel
   */
  "q": string;
  /**
   * Optional latitude to bias results toward (give together with lng)
   */
  "lat"?: number;
  /**
   * Optional longitude to bias results toward (give together with lat)
   */
  "lng"?: number;
  /**
   * Optional filter by kind of place, a comma list of: geo, accommodation, attraction,
   * attraction_product, eatery, airline, ship, cruise_line (e.g. geo for cities and
   * countries only, eatery,attraction for both). Omit it to get every kind. The filter
   * keeps the ranking of the unfiltered list
   */
  "types"?: string;
  /**
   * Max results per page. No cap of its own: any value is accepted, and the list is
   * bounded only by how many locations the site returns for the query (up to about 200).
   * Omit it to get the whole list
   */
  "limit"?: number;
  /**
   * Number of results to skip, to page through the list with limit (the site itself has
   * no paging, so the whole list is fetched once and paged here)
   */
  "offset"?: number;
  /**
   * Bypass and repopulate the cache
   */
  "refresh"?: boolean;
}

export declare class TripadvisorClient {
  constructor(options?: ClientOptions);
  request(path: string, params?: Record<string, unknown>, required?: string[]): Promise<Record<string, any>>;
  /**
   * Top attractions / things to do for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   page (integer): 1-based source page (30 results each)
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  attractions(params: AttractionsParams): Promise<Record<string, any>>;
  /**
   * Attractions for a location (geo_id), 30 per page with working pagination, an
   * optional category filter, categories and tags as id/name arrays and a description
   * when available.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   page (integer): 1-based source page, 30 attractions each (page N returns ranks
   *     30*(N-1)+1 to 30*N)
   *   category (string): Optional attraction category id: 47 Sights & Landmarks, 49
   *     Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41
   *     Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos
   *     & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in
   *     data.available_categories. One of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  attractionsV2(params: AttractionsV2Params): Promise<Record<string, any>>;
  /**
   * Trip planner in one call: a place name (or geo_id) is resolved to its location, then
   * its attractions, hotels or restaurants (kind) are listed 30 per page, optionally
   * with the first page of reviews for the top N results. Ambiguous names answer 400
   * with the candidates.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   q (string, required): A place name (city, region or country), qualified with its
   *     region or country when several places share the name ("Paris, France", "Paris,
   *     Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous or
   *     unknown name answers 400 with the candidate places
   *   kind (string): What to list for the place. One of: attractions, hotels,
   *     restaurants
   *   reviews (integer): Attach the first page of reviews (15) to the top N results of
   *     the page; 0 for none. A review lookup that fails leaves that result's reviews
   *     null. One of: 0, 1, 2, 3, 4, 5
   *   page (integer): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to
   *     30*N); up to 333 for restaurants, 1000 otherwise
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  explore(params: ExploreParams): Promise<Record<string, any>>;
  /**
   * Live date-driven hotel price offers for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   checkInDate (string, required): Check-in date (YYYY-MM-DD)
   *   checkOutDate (string, required): Check-out date (YYYY-MM-DD)
   *   adults (integer): Number of adults
   *   rooms (integer): Number of rooms
   *   childrenAges (string): Comma-separated children ages, e.g. 4,9
   *   refresh (boolean): Bypass and repopulate the cache
   */
  hotelOffers(params: HotelOffersParams): Promise<Record<string, any>>;
  /**
   * Live, dated hotel offers for a location (geo_id), paged through every hotel the site
   * lists: offset reaches data.total (the site's own hotel count), limit up to 100.
   * Optional currency and sort.
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris,
   *     60763 New York City)
   *   checkInDate (string): Check-in date (YYYY-MM-DD, today or later). Default: 30
   *     days from today
   *   checkOutDate (string): Check-out date (YYYY-MM-DD, after checkInDate). Default:
   *     checkInDate + 2 nights
   *   adults (integer): Number of adults (1-16)
   *   rooms (integer): Number of rooms (1-8)
   *   childrenAges (string): Comma-separated children ages 0-17, e.g. 4,9
   *   currency (string): ISO 4217 currency the offers are priced in (e.g. USD, EUR,
   *     GBP, TRY)
   *   sort (string): Order of the list: POPULARITY (traveler ranked), BEST_VALUE,
   *     PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: POPULARITY,
   *     BEST_VALUE, PRICE_LOW_TO_HIGH, DISTANCE
   *   limit (integer): Hotels per page (1-100)
   *   offset (integer): Hotels to skip; walk it up to pagination.total to reach every
   *     hotel of the location
   *   refresh (boolean): Bypass and repopulate the cache
   */
  hotelOffersV2(params: HotelOffersV2Params): Promise<Record<string, any>>;
  /**
   * Hotels / accommodation for a location (geo_id), 30 per page.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   page (integer): 1-based source page (30 results each)
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  hotels(params: HotelsParams): Promise<Record<string, any>>;
  /**
   * ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).
   *
   * Each successful request uses 1 credit for every 250 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   limit (integer): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000).
   *     The full set (up to 1000) is fetched and cached per geo; ?limit slices it
   *   offset (integer): Offset within the fetched set
   *   refresh (boolean): Bypass and repopulate the cache
   */
  hotelsAll(params: HotelsAllParams): Promise<Record<string, any>>;
  /**
   * Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
   * total photo count.
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   id (string, required): TripAdvisor detail id of a hotel, restaurant or
   *     attraction (the id the list endpoints return, the d<id> in a place URL)
   *   limit (integer): Photos per page (1-30)
   *   offset (integer): Photo offset within the gallery's first 100 photos
   *   refresh (boolean): Bypass and repopulate the cache
   */
  photos(params: PhotosParams): Promise<Record<string, any>>;
  /**
   * The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
   * the total photo count: offset reaches the total, limit up to the site's own per-call
   * maximum (100).
   *
   * Each successful request uses 1 credit for every 100 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   id (string, required): TripAdvisor detail id of a hotel, restaurant or
   *     attraction (the id the list endpoints return, the d<id> in a place URL)
   *   limit (integer): Photos per call, up to the site's own per-call maximum (100)
   *   offset (integer): Photo offset within the whole gallery; valid up to data.total
   *   refresh (boolean): Bypass and repopulate the cache
   */
  photosV2(params: PhotosV2Params): Promise<Record<string, any>>;
  /**
   * Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
   * name, rating, review count, ranking, address, coordinates, phone, price level,
   * description, photo count, image, plus amenities (hotels), cuisines (restaurants),
   * opening hours and category. Works for any place id, inside or outside its geo's
   * lists.
   *
   * Parameters:
   *   id (string, required): TripAdvisor detail id (the `id` field from a list
   *     endpoint)
   *   geo (string, required): TripAdvisor geo_id the place belongs to (the `geo_id` of
   *     a list row). Used to find the place's list row for ranking and amenities; a
   *     place outside that list is still answered
   *   type (string, required): Place type: hotel, restaurant or attraction. One of:
   *     hotel, restaurant, attraction
   *   refresh (boolean): Bypass and repopulate the cache
   */
  place(params: PlaceParams): Promise<Record<string, any>>;
  /**
   * Restaurants / eateries for a location (geo_id).
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   page (integer): 1-based source page (30 results each)
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  restaurants(params: RestaurantsParams): Promise<Record<string, any>>;
  /**
   * Restaurants for a location (geo_id), 30 per page with working pagination, optional
   * cuisine and price range filters, and weekly opening hours when available.
   *
   * Each successful request uses 1 credit for every 30 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   geo (string, required): TripAdvisor geo_id from /search
   *   page (integer): 1-based page, 30 restaurants each (page N returns ranks
   *     30*(N-1)+1 to 30*N, the next 30 distinct restaurants)
   *   cuisine (string): Optional cuisine filter: a cuisine name or id (e.g. Seafood or
   *     10643, Turkish or 10663, Italian or 4617); comma-separate several to match any
   *     of them. The cuisines a geo offers are listed in data.available_cuisines
   *   price (string): Optional price range filter: cheap (Cheap Eats, $), mid
   *     (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g.
   *     cheap,mid). One of: cheap, mid, fine
   *   limit (integer): Max items returned from the page
   *   offset (integer): Item offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  restaurantsV2(params: RestaurantsV2Params): Promise<Record<string, any>>;
  /**
   * Traveler reviews for one place by detail id.
   *
   * Each successful request uses 1 credit for every 15 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   id (string, required): TripAdvisor detail id (from a list endpoint)
   *   geo (string): Ignored: accepted for compatibility with the other detail
   *     endpoints; reviews are looked up by id alone
   *   type (string): Ignored: accepted for compatibility with the other detail
   *     endpoints; reviews are looked up by id alone. One of: hotel, restaurant,
   *     attraction
   *   page (integer): 1-based page; ~18 reviews on page 1, deeper pages best-effort
   *     (10 each)
   *   limit (integer): Max reviews returned
   *   offset (integer): Review offset within the page
   *   refresh (boolean): Bypass and repopulate the cache
   */
  reviews(params: ReviewsParams): Promise<Record<string, any>>;
  /**
   * Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).
   *
   * Each successful request uses 1 credit for every 10 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   q (string, required): Place name to resolve, e.g. a city or country
   *   types (string): Ignored: accepted so older calls stay valid; results are not
   *     filtered by type. Use /search-v3?types= to filter
   *   limit (integer): Max results per page
   *   offset (integer): Result offset
   *   refresh (boolean): Bypass and repopulate the cache
   */
  search(params: SearchParams): Promise<Record<string, any>>;
  /**
   * Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
   * coordinates + thumbnail), optionally biased toward a lat/lng point.
   *
   * Each successful request uses 1 credit for every 10 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   q (string, required): Place or venue name to resolve, e.g. a city, landmark or
   *     hotel
   *   lat (number): Optional latitude to bias results toward (give together with lng)
   *   lng (number): Optional longitude to bias results toward (give together with lat)
   *   types (string): Ignored: accepted so older calls stay valid; results are not
   *     filtered by type. Use /search-v3?types= to filter
   *   limit (integer): Max results per page (the endpoint returns at most 10
   *     locations)
   *   offset (integer): Result offset
   *   refresh (boolean): Bypass and repopulate the cache
   */
  searchV2(params: SearchV2Params): Promise<Record<string, any>>;
  /**
   * Geo search v3: resolve a place name to every TripAdvisor location the site's search
   * returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
   * and filtered by kind with types; page with limit/offset.
   *
   * Each successful request uses 1 credit for every 20 rows it returns (at least 1
   * credit).
   *
   * Parameters:
   *   q (string, required): Place or venue name to resolve, e.g. a city, landmark or
   *     hotel
   *   lat (number): Optional latitude to bias results toward (give together with lng)
   *   lng (number): Optional longitude to bias results toward (give together with lat)
   *   types (string): Optional filter by kind of place, a comma list of: geo,
   *     accommodation, attraction, attraction_product, eatery, airline, ship,
   *     cruise_line (e.g. geo for cities and countries only, eatery,attraction for
   *     both). Omit it to get every kind. The filter keeps the ranking of the unfiltered
   *     list
   *   limit (integer): Max results per page. No cap of its own: any value is accepted,
   *     and the list is bounded only by how many locations the site returns for the
   *     query (up to about 200). Omit it to get the whole list
   *   offset (integer): Number of results to skip, to page through the list with limit
   *     (the site itself has no paging, so the whole list is fetched once and paged
   *     here)
   *   refresh (boolean): Bypass and repopulate the cache
   */
  searchV3(params: SearchV3Params): Promise<Record<string, any>>;
}
