<?php

// Unofficial Tripadvisor API client for PHP.
// Not affiliated with Tripadvisor. Endpoint reference: https://maviapi.com/apis/tripadvisor

declare(strict_types=1);

namespace TripadvisorSdk;

/** An error status answered by the API. */
class ApiError extends \RuntimeException
{
    public function __construct(
        public readonly int $status,
        public readonly string $errorCode,
        string $message,
    ) {
        parent::__construct("$status $errorCode: $message", $status);
    }
}

class TripadvisorClient
{
    public const DEMO_KEY = 'mvk_test_playground_5f3c1a8d';

    private string $apiKey;
    private string $baseUrl;

    /**
     * With no $apiKey it uses the MAVIAPI_API_KEY environment variable, then the
     * shared demo key.
     */
    public function __construct(?string $apiKey = null, ?string $baseUrl = null, private int $timeout = 120)
    {
        $this->apiKey = $apiKey ?: (getenv('MAVIAPI_API_KEY') ?: self::DEMO_KEY);
        $root = $baseUrl ?: (getenv('MAVIAPI_BASE_URL') ?: 'https://api.maviapi.com');
        $this->baseUrl = rtrim($root, '/') . '/v1/sites/tripadvisor';
    }

    /**
     * Top attractions / things to do for a location (geo_id).
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $page (integer): 1-based source page (30 results each)
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function attractions(string $geo, ?int $page = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/attractions', ['geo' => $geo, 'page' => $page, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Attractions for a location (geo_id), 30 per page with working pagination, an
     * optional category filter, categories and tags as id/name arrays and a description
     * when available.
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $page (integer): 1-based source page, 30 attractions each (page N returns ranks
     *     30*(N-1)+1 to 30*N)
     *   $category (string): Optional attraction category id: 47 Sights & Landmarks, 49
     *     Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41
     *     Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos
     *     & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in
     *     data.available_categories. One of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function attractionsV2(string $geo, ?int $page = null, ?string $category = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/attractions-v2', ['geo' => $geo, 'page' => $page, 'category' => $category, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

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
     *   $q (string, required): A place name (city, region or country), qualified with
     *     its region or country when several places share the name ("Paris, France",
     *     "Paris, Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous
     *     or unknown name answers 400 with the candidate places
     *   $kind (string): What to list for the place. One of: attractions, hotels,
     *     restaurants
     *   $reviews (integer): Attach the first page of reviews (15) to the top N results
     *     of the page; 0 for none. A review lookup that fails leaves that result's reviews
     *     null. One of: 0, 1, 2, 3, 4, 5
     *   $page (integer): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to
     *     30*N); up to 333 for restaurants, 1000 otherwise
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function explore(string $q, ?string $kind = null, ?int $reviews = null, ?int $page = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/explore', ['q' => $q, 'kind' => $kind, 'reviews' => $reviews, 'page' => $page, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Live date-driven hotel price offers for a location (geo_id).
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $checkInDate (string, required): Check-in date (YYYY-MM-DD)
     *   $checkOutDate (string, required): Check-out date (YYYY-MM-DD)
     *   $adults (integer): Number of adults
     *   $rooms (integer): Number of rooms
     *   $childrenAges (string): Comma-separated children ages, e.g. 4,9
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function hotelOffers(string $geo, string $checkInDate, string $checkOutDate, ?int $adults = null, ?int $rooms = null, ?string $childrenAges = null, ?bool $refresh = null): array
    {
        return $this->get('/hotel-offers', ['geo' => $geo, 'checkInDate' => $checkInDate, 'checkOutDate' => $checkOutDate, 'adults' => $adults, 'rooms' => $rooms, 'childrenAges' => $childrenAges, 'refresh' => $refresh]);
    }

    /**
     * Live, dated hotel offers for a location (geo_id), paged through every hotel the site
     * lists: offset reaches data.total (the site's own hotel count), limit up to 100.
     * Optional currency and sort.
     *
     * Each successful request uses 1 credit for every 100 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris,
     *     60763 New York City)
     *   $checkInDate (string): Check-in date (YYYY-MM-DD, today or later). Default: 30
     *     days from today
     *   $checkOutDate (string): Check-out date (YYYY-MM-DD, after checkInDate). Default:
     *     checkInDate + 2 nights
     *   $adults (integer): Number of adults (1-16)
     *   $rooms (integer): Number of rooms (1-8)
     *   $childrenAges (string): Comma-separated children ages 0-17, e.g. 4,9
     *   $currency (string): ISO 4217 currency the offers are priced in (e.g. USD, EUR,
     *     GBP, TRY)
     *   $sort (string): Order of the list: POPULARITY (traveler ranked), BEST_VALUE,
     *     PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: POPULARITY,
     *     BEST_VALUE, PRICE_LOW_TO_HIGH, DISTANCE
     *   $limit (integer): Hotels per page (1-100)
     *   $offset (integer): Hotels to skip; walk it up to pagination.total to reach every
     *     hotel of the location
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function hotelOffersV2(string $geo, ?string $checkInDate = null, ?string $checkOutDate = null, ?int $adults = null, ?int $rooms = null, ?string $childrenAges = null, ?string $currency = null, ?string $sort = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/hotel-offers-v2', ['geo' => $geo, 'checkInDate' => $checkInDate, 'checkOutDate' => $checkOutDate, 'adults' => $adults, 'rooms' => $rooms, 'childrenAges' => $childrenAges, 'currency' => $currency, 'sort' => $sort, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Hotels / accommodation for a location (geo_id), 30 per page.
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $page (integer): 1-based source page (30 results each)
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function hotels(string $geo, ?int $page = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/hotels', ['geo' => $geo, 'page' => $page, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).
     *
     * Each successful request uses 1 credit for every 250 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $limit (integer): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000).
     *     The full set (up to 1000) is fetched and cached per geo; ?limit slices it
     *   $offset (integer): Offset within the fetched set
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function hotelsAll(string $geo, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/hotels-all', ['geo' => $geo, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
     * total photo count.
     *
     * Each successful request uses 1 credit for every 100 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $id (string, required): TripAdvisor detail id of a hotel, restaurant or
     *     attraction (the id the list endpoints return, the d<id> in a place URL)
     *   $limit (integer): Photos per page (1-30)
     *   $offset (integer): Photo offset within the gallery's first 100 photos
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function photos(string $id, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/photos', ['id' => $id, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
     * the total photo count: offset reaches the total, limit up to the site's own per-call
     * maximum (100).
     *
     * Each successful request uses 1 credit for every 100 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $id (string, required): TripAdvisor detail id of a hotel, restaurant or
     *     attraction (the id the list endpoints return, the d<id> in a place URL)
     *   $limit (integer): Photos per call, up to the site's own per-call maximum (100)
     *   $offset (integer): Photo offset within the whole gallery; valid up to data.total
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function photosV2(string $id, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/photos-v2', ['id' => $id, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
     * name, rating, review count, ranking, address, coordinates, phone, price level,
     * description, photo count, image, plus amenities (hotels), cuisines (restaurants),
     * opening hours and category. Works for any place id, inside or outside its geo's
     * lists.
     *
     * Parameters:
     *   $id (string, required): TripAdvisor detail id (the `id` field from a list
     *     endpoint)
     *   $geo (string, required): TripAdvisor geo_id the place belongs to (the `geo_id`
     *     of a list row). Used to find the place's list row for ranking and amenities; a
     *     place outside that list is still answered
     *   $type (string, required): Place type: hotel, restaurant or attraction. One of:
     *     hotel, restaurant, attraction
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function place(string $id, string $geo, string $type, ?bool $refresh = null): array
    {
        return $this->get('/place', ['id' => $id, 'geo' => $geo, 'type' => $type, 'refresh' => $refresh]);
    }

    /**
     * Restaurants / eateries for a location (geo_id).
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $page (integer): 1-based source page (30 results each)
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function restaurants(string $geo, ?int $page = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/restaurants', ['geo' => $geo, 'page' => $page, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Restaurants for a location (geo_id), 30 per page with working pagination, optional
     * cuisine and price range filters, and weekly opening hours when available.
     *
     * Each successful request uses 1 credit for every 30 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $geo (string, required): TripAdvisor geo_id from /search
     *   $page (integer): 1-based page, 30 restaurants each (page N returns ranks
     *     30*(N-1)+1 to 30*N, the next 30 distinct restaurants)
     *   $cuisine (string): Optional cuisine filter: a cuisine name or id (e.g. Seafood
     *     or 10643, Turkish or 10663, Italian or 4617); comma-separate several to match
     *     any of them. The cuisines a geo offers are listed in data.available_cuisines
     *   $price (string): Optional price range filter: cheap (Cheap Eats, $), mid
     *     (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g.
     *     cheap,mid). One of: cheap, mid, fine
     *   $limit (integer): Max items returned from the page
     *   $offset (integer): Item offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function restaurantsV2(string $geo, ?int $page = null, ?string $cuisine = null, ?string $price = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/restaurants-v2', ['geo' => $geo, 'page' => $page, 'cuisine' => $cuisine, 'price' => $price, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Traveler reviews for one place by detail id.
     *
     * Each successful request uses 1 credit for every 15 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $id (string, required): TripAdvisor detail id (from a list endpoint)
     *   $geo (string): Ignored: accepted for compatibility with the other detail
     *     endpoints; reviews are looked up by id alone
     *   $type (string): Ignored: accepted for compatibility with the other detail
     *     endpoints; reviews are looked up by id alone. One of: hotel, restaurant,
     *     attraction
     *   $page (integer): 1-based page; ~18 reviews on page 1, deeper pages best-effort
     *     (10 each)
     *   $limit (integer): Max reviews returned
     *   $offset (integer): Review offset within the page
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function reviews(string $id, ?string $geo = null, ?string $type = null, ?int $page = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/reviews', ['id' => $id, 'geo' => $geo, 'type' => $type, 'page' => $page, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).
     *
     * Each successful request uses 1 credit for every 10 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $q (string, required): Place name to resolve, e.g. a city or country
     *   $types (string): Ignored: accepted so older calls stay valid; results are not
     *     filtered by type. Use /search-v3?types= to filter
     *   $limit (integer): Max results per page
     *   $offset (integer): Result offset
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function search(string $q, ?string $types = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/search', ['q' => $q, 'types' => $types, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
     * coordinates + thumbnail), optionally biased toward a lat/lng point.
     *
     * Each successful request uses 1 credit for every 10 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $q (string, required): Place or venue name to resolve, e.g. a city, landmark or
     *     hotel
     *   $lat (number): Optional latitude to bias results toward (give together with lng)
     *   $lng (number): Optional longitude to bias results toward (give together with
     *     lat)
     *   $types (string): Ignored: accepted so older calls stay valid; results are not
     *     filtered by type. Use /search-v3?types= to filter
     *   $limit (integer): Max results per page (the endpoint returns at most 10
     *     locations)
     *   $offset (integer): Result offset
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function searchV2(string $q, ?float $lat = null, ?float $lng = null, ?string $types = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/search-v2', ['q' => $q, 'lat' => $lat, 'lng' => $lng, 'types' => $types, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * Geo search v3: resolve a place name to every TripAdvisor location the site's search
     * returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
     * and filtered by kind with types; page with limit/offset.
     *
     * Each successful request uses 1 credit for every 20 rows it returns (at least 1
     * credit).
     *
     * Parameters:
     *   $q (string, required): Place or venue name to resolve, e.g. a city, landmark or
     *     hotel
     *   $lat (number): Optional latitude to bias results toward (give together with lng)
     *   $lng (number): Optional longitude to bias results toward (give together with
     *     lat)
     *   $types (string): Optional filter by kind of place, a comma list of: geo,
     *     accommodation, attraction, attraction_product, eatery, airline, ship,
     *     cruise_line (e.g. geo for cities and countries only, eatery,attraction for
     *     both). Omit it to get every kind. The filter keeps the ranking of the unfiltered
     *     list
     *   $limit (integer): Max results per page. No cap of its own: any value is
     *     accepted, and the list is bounded only by how many locations the site returns
     *     for the query (up to about 200). Omit it to get the whole list
     *   $offset (integer): Number of results to skip, to page through the list with
     *     limit (the site itself has no paging, so the whole list is fetched once and
     *     paged here)
     *   $refresh (boolean): Bypass and repopulate the cache
     *
     * @return array<string, mixed>
     */
    public function searchV3(string $q, ?float $lat = null, ?float $lng = null, ?string $types = null, ?int $limit = null, ?int $offset = null, ?bool $refresh = null): array
    {
        return $this->get('/search-v3', ['q' => $q, 'lat' => $lat, 'lng' => $lng, 'types' => $types, 'limit' => $limit, 'offset' => $offset, 'refresh' => $refresh]);
    }

    /**
     * @param array<string, scalar|null> $params
     * @return array<string, mixed>
     */
    private function get(string $path, array $params): array
    {
        $query = [];
        foreach ($params as $name => $value) {
            if ($value === null) {
                continue;
            }
            $text = is_bool($value) ? ($value ? 'true' : 'false') : (string) $value;
            $token = '{' . $name . '}';
            if (str_contains($path, $token)) {
                $path = str_replace($token, rawurlencode($text), $path);
            } else {
                $query[$name] = $text;
            }
        }
        $curl = curl_init($this->baseUrl . $path . ($query ? '?' . http_build_query($query) : ''));
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_USERAGENT => 'tripadvisor-unofficial-sdk/0.1.0 (php)',
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $this->apiKey, 'Accept: application/json'],
        ]);
        $body = curl_exec($curl);
        if ($body === false) {
            throw new ApiError(0, 'network_error', curl_error($curl));
        }
        $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $data = json_decode($body, true);
        if ($status >= 400) {
            $detail = is_array($data) ? $data : [];
            throw new ApiError(
                $status,
                (string) ($detail['error'] ?? 'http_error'),
                (string) ($detail['message'] ?? substr($body, 0, 200)),
            );
        }
        return is_array($data) ? $data : [];
    }
}
