// Package tripadvisor is an unofficial Tripadvisor API client.
//
// Trip-planning data from Tripadvisor: geo search plus attractions, restaurants and
// hotels by location (geo_id), with ratings, reviews, price and coordinates. Resolve a
// place name with /search, then list with /attractions, /restaurants, /hotels.
//
// Not affiliated with Tripadvisor. Endpoint reference: https://maviapi.com/apis/tripadvisor
package tripadvisor

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

const (
	Version = "0.1.0"
	// DemoKey is the shared demo key a client uses when it is given no key.
	DemoKey = "mvk_test_playground_5f3c1a8d"
)

// Params are an endpoint's parameters by name. Those named in the endpoint's
// path go there, the rest in the query string.
type Params map[string]any

// Error is an error status answered by the API.
type Error struct {
	Status  int
	Code    string
	Message string
}

func (e *Error) Error() string { return fmt.Sprintf("%d %s: %s", e.Status, e.Code, e.Message) }

// Client calls the Tripadvisor API. Its fields may be changed after New.
type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
}

// New returns a client. With an empty apiKey it uses the MAVIAPI_API_KEY
// environment variable, then the shared demo key.
func New(apiKey string) *Client {
	if apiKey == "" {
		apiKey = os.Getenv("MAVIAPI_API_KEY")
	}
	if apiKey == "" {
		apiKey = DemoKey
	}
	root := os.Getenv("MAVIAPI_BASE_URL")
	if root == "" {
		root = "https://api.maviapi.com"
	}
	return &Client{
		APIKey:     apiKey,
		BaseURL:    strings.TrimRight(root, "/") + "/v1/sites/tripadvisor",
		HTTPClient: &http.Client{Timeout: 120 * time.Second},
	}
}

// Attractions: Top attractions / things to do for a location (geo_id).
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - page (integer): 1-based source page (30 results each)
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Attractions(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/attractions", params, "geo")
}

// AttractionsV2: Attractions for a location (geo_id), 30 per page with working pagination, an
// optional category filter, categories and tags as id/name arrays and a description
// when available.
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - page (integer): 1-based source page, 30 attractions each (page N returns ranks
//     30*(N-1)+1 to 30*N)
//   - category (string): Optional attraction category id: 47 Sights & Landmarks, 49
//     Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41
//     Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos
//     & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in
//     data.available_categories. One of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) AttractionsV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/attractions-v2", params, "geo")
}

// Explore: Trip planner in one call: a place name (or geo_id) is resolved to its location, then
// its attractions, hotels or restaurants (kind) are listed 30 per page, optionally
// with the first page of reviews for the top N results. Ambiguous names answer 400
// with the candidates.
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - q (string, required): A place name (city, region or country), qualified with its
//     region or country when several places share the name ("Paris, France", "Paris,
//     Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous or
//     unknown name answers 400 with the candidate places
//   - kind (string): What to list for the place. One of: attractions, hotels,
//     restaurants
//   - reviews (integer): Attach the first page of reviews (15) to the top N results of
//     the page; 0 for none. A review lookup that fails leaves that result's reviews
//     null. One of: 0, 1, 2, 3, 4, 5
//   - page (integer): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to
//     30*N); up to 333 for restaurants, 1000 otherwise
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Explore(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/explore", params, "q")
}

// HotelOffers: Live date-driven hotel price offers for a location (geo_id).
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - checkInDate (string, required): Check-in date (YYYY-MM-DD)
//   - checkOutDate (string, required): Check-out date (YYYY-MM-DD)
//   - adults (integer): Number of adults
//   - rooms (integer): Number of rooms
//   - childrenAges (string): Comma-separated children ages, e.g. 4,9
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) HotelOffers(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/hotel-offers", params, "geo", "checkInDate", "checkOutDate")
}

// HotelOffersV2: Live, dated hotel offers for a location (geo_id), paged through every hotel the site
// lists: offset reaches data.total (the site's own hotel count), limit up to 100.
// Optional currency and sort.
//
// Each successful request uses 1 credit for every 100 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris,
//     60763 New York City)
//   - checkInDate (string): Check-in date (YYYY-MM-DD, today or later). Default: 30
//     days from today
//   - checkOutDate (string): Check-out date (YYYY-MM-DD, after checkInDate). Default:
//     checkInDate + 2 nights
//   - adults (integer): Number of adults (1-16)
//   - rooms (integer): Number of rooms (1-8)
//   - childrenAges (string): Comma-separated children ages 0-17, e.g. 4,9
//   - currency (string): ISO 4217 currency the offers are priced in (e.g. USD, EUR,
//     GBP, TRY)
//   - sort (string): Order of the list: POPULARITY (traveler ranked), BEST_VALUE,
//     PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: POPULARITY,
//     BEST_VALUE, PRICE_LOW_TO_HIGH, DISTANCE
//   - limit (integer): Hotels per page (1-100)
//   - offset (integer): Hotels to skip; walk it up to pagination.total to reach every
//     hotel of the location
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) HotelOffersV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/hotel-offers-v2", params, "geo")
}

// Hotels: Hotels / accommodation for a location (geo_id), 30 per page.
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - page (integer): 1-based source page (30 results each)
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Hotels(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/hotels", params, "geo")
}

// HotelsAll: ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).
//
// Each successful request uses 1 credit for every 250 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - limit (integer): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000).
//     The full set (up to 1000) is fetched and cached per geo; ?limit slices it
//   - offset (integer): Offset within the fetched set
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) HotelsAll(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/hotels-all", params, "geo")
}

// Photos: Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
// total photo count.
//
// Each successful request uses 1 credit for every 100 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - id (string, required): TripAdvisor detail id of a hotel, restaurant or
//     attraction (the id the list endpoints return, the d<id> in a place URL)
//   - limit (integer): Photos per page (1-30)
//   - offset (integer): Photo offset within the gallery's first 100 photos
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Photos(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/photos", params, "id")
}

// PhotosV2: The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
// the total photo count: offset reaches the total, limit up to the site's own per-call
// maximum (100).
//
// Each successful request uses 1 credit for every 100 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - id (string, required): TripAdvisor detail id of a hotel, restaurant or
//     attraction (the id the list endpoints return, the d<id> in a place URL)
//   - limit (integer): Photos per call, up to the site's own per-call maximum (100)
//   - offset (integer): Photo offset within the whole gallery; valid up to data.total
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) PhotosV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/photos-v2", params, "id")
}

// Place: Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
// name, rating, review count, ranking, address, coordinates, phone, price level,
// description, photo count, image, plus amenities (hotels), cuisines (restaurants),
// opening hours and category. Works for any place id, inside or outside its geo's
// lists.
//
// Parameters:
//
//   - id (string, required): TripAdvisor detail id (the `id` field from a list
//     endpoint)
//   - geo (string, required): TripAdvisor geo_id the place belongs to (the `geo_id` of
//     a list row). Used to find the place's list row for ranking and amenities; a
//     place outside that list is still answered
//   - type (string, required): Place type: hotel, restaurant or attraction. One of:
//     hotel, restaurant, attraction
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Place(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/place", params, "id", "geo", "type")
}

// PlacesInArea: Places inside a map box (north, south, east, west): attractions, restaurants or
// hotels, with coordinates, rating, ranking, price level, categories, website, phone,
// opening hours, address and a thumbnail.
//
// Each successful request uses 1 credit for every 100 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - north (number, required): Northern edge of the map box, latitude in decimal
//     degrees (-90 to 90, above south)
//   - south (number, required): Southern edge of the map box, latitude in decimal
//     degrees (-90 to 90)
//   - east (number, required): Eastern edge of the map box, longitude in decimal
//     degrees (-180 to 180, above west; split a box that crosses the 180th meridian)
//   - west (number, required): Western edge of the map box, longitude in decimal
//     degrees (-180 to 180)
//   - type (string): Kind of place to list. One of: attractions, restaurants, hotels
//   - limit (integer): Places per page (1-100)
//   - offset (integer): Places to skip; walk it up to pagination.total. Attractions
//     and restaurants: the site returns at most 750 per box (data.capped), so zoom in
//     or split the box to reach more
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) PlacesInArea(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/places-in-area", params, "north", "south", "east", "west")
}

// Restaurants: Restaurants / eateries for a location (geo_id).
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - page (integer): 1-based source page (30 results each)
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Restaurants(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/restaurants", params, "geo")
}

// RestaurantsV2: Restaurants for a location (geo_id), 30 per page with working pagination, optional
// cuisine and price range filters, and weekly opening hours when available.
//
// Each successful request uses 1 credit for every 30 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - geo (string, required): TripAdvisor geo_id from /search
//   - page (integer): 1-based page, 30 restaurants each (page N returns ranks
//     30*(N-1)+1 to 30*N, the next 30 distinct restaurants)
//   - cuisine (string): Optional cuisine filter: a cuisine name or id (e.g. Seafood or
//     10643, Turkish or 10663, Italian or 4617); comma-separate several to match any
//     of them. The cuisines a geo offers are listed in data.available_cuisines
//   - price (string): Optional price range filter: cheap (Cheap Eats, $), mid
//     (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g.
//     cheap,mid). One of: cheap, mid, fine
//   - limit (integer): Max items returned from the page
//   - offset (integer): Item offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) RestaurantsV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/restaurants-v2", params, "geo")
}

// Reviews: Traveler reviews for one place by detail id.
//
// Each successful request uses 1 credit for every 15 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - id (string, required): TripAdvisor detail id (from a list endpoint)
//   - geo (string): Ignored: accepted for compatibility with the other detail
//     endpoints; reviews are looked up by id alone
//   - type (string): Ignored: accepted for compatibility with the other detail
//     endpoints; reviews are looked up by id alone. One of: hotel, restaurant,
//     attraction
//   - page (integer): 1-based page; ~18 reviews on page 1, deeper pages best-effort
//     (10 each)
//   - limit (integer): Max reviews returned
//   - offset (integer): Review offset within the page
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Reviews(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/reviews", params, "id")
}

// Search: Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).
//
// Each successful request uses 1 credit for every 10 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - q (string, required): Place name to resolve, e.g. a city or country
//   - types (string): Ignored: accepted so older calls stay valid; results are not
//     filtered by type. Use /search-v3?types= to filter
//   - limit (integer): Max results per page
//   - offset (integer): Result offset
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) Search(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search", params, "q")
}

// SearchV2: Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
// coordinates + thumbnail), optionally biased toward a lat/lng point.
//
// Each successful request uses 1 credit for every 10 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - q (string, required): Place or venue name to resolve, e.g. a city, landmark or
//     hotel
//   - lat (number): Optional latitude to bias results toward (give together with lng)
//   - lng (number): Optional longitude to bias results toward (give together with lat)
//   - types (string): Ignored: accepted so older calls stay valid; results are not
//     filtered by type. Use /search-v3?types= to filter
//   - limit (integer): Max results per page (the endpoint returns at most 10
//     locations)
//   - offset (integer): Result offset
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) SearchV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search-v2", params, "q")
}

// SearchV3: Geo search v3: resolve a place name to every TripAdvisor location the site's search
// returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
// and filtered by kind with types; page with limit/offset.
//
// Each successful request uses 1 credit for every 20 rows it returns (at least 1
// credit).
//
// Parameters:
//
//   - q (string, required): Place or venue name to resolve, e.g. a city, landmark or
//     hotel
//   - lat (number): Optional latitude to bias results toward (give together with lng)
//   - lng (number): Optional longitude to bias results toward (give together with lat)
//   - types (string): Optional filter by kind of place, a comma list of: geo,
//     accommodation, attraction, attraction_product, eatery, airline, ship,
//     cruise_line (e.g. geo for cities and countries only, eatery,attraction for
//     both). Omit it to get every kind. The filter keeps the ranking of the unfiltered
//     list
//   - limit (integer): Max results per page. No cap of its own: any value is accepted,
//     and the list is bounded only by how many locations the site returns for the
//     query (up to about 200). Omit it to get the whole list
//   - offset (integer): Number of results to skip, to page through the list with limit
//     (the site itself has no paging, so the whole list is fetched once and paged
//     here)
//   - refresh (boolean): Bypass and repopulate the cache
func (c *Client) SearchV3(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search-v3", params, "q")
}

func (c *Client) get(ctx context.Context, path string, params Params, required ...string) (json.RawMessage, error) {
	for _, name := range required {
		if params[name] == nil {
			return nil, fmt.Errorf("missing required parameter: %s", name)
		}
	}
	query := url.Values{}
	for name, value := range params {
		if value == nil {
			continue
		}
		text := fmt.Sprint(value)
		if token := "{" + name + "}"; strings.Contains(path, token) {
			path = strings.ReplaceAll(path, token, url.PathEscape(text))
		} else {
			query.Set(name, text)
		}
	}
	target := c.BaseURL + path
	if len(query) > 0 {
		target += "?" + query.Encode()
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "tripadvisor-unofficial-sdk/0.1.0 (go)")
	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 400 {
		failure := &Error{Status: res.StatusCode, Code: "http_error", Message: string(body)}
		var detail struct{ Error, Message string }
		if json.Unmarshal(body, &detail) == nil && detail.Error != "" {
			failure.Code, failure.Message = detail.Error, detail.Message
		}
		return nil, failure
	}
	return body, nil
}
