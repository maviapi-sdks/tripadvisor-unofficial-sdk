# frozen_string_literal: true

# Unofficial Tripadvisor API client for Ruby.
# Not affiliated with Tripadvisor. Endpoint reference: https://maviapi.com/apis/tripadvisor

require "json"
require "net/http"
require "uri"

module TripadvisorSdk
  VERSION = "0.1.0"
  DEMO_KEY = "mvk_test_playground_5f3c1a8d"

  # An error status answered by the API.
  class ApiError < StandardError
    attr_reader :status, :code

    def initialize(status, code, message)
      super("#{status} #{code}: #{message}")
      @status = status
      @code = code
    end
  end

  class Client
    # With no api_key it uses the MAVIAPI_API_KEY environment variable, then the
    # shared demo key.
    def initialize(api_key: nil, base_url: nil, timeout: 120)
      given = ->(*values) { values.find { |value| value && !value.empty? } }
      @api_key = given.call(api_key, ENV["MAVIAPI_API_KEY"], DEMO_KEY)
      root = given.call(base_url, ENV["MAVIAPI_BASE_URL"], "https://api.maviapi.com")
      @base_url = root.sub(%r{/+\z}, "") + "/v1/sites/tripadvisor"
      @timeout = timeout
    end

    # Top attractions / things to do for a location (geo_id).
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   page (integer): 1-based source page (30 results each)
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def attractions(**params)
      get("/attractions", params, %w[geo])
    end

    # Attractions for a location (geo_id), 30 per page with working pagination, an
    # optional category filter, categories and tags as id/name arrays and a description
    # when available.
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   page (integer): 1-based source page, 30 attractions each (page N returns ranks
    #     30*(N-1)+1 to 30*N)
    #   category (string): Optional attraction category id: 47 Sights & Landmarks, 49
    #     Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41
    #     Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos
    #     & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in
    #     data.available_categories. One of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def attractions_v2(**params)
      get("/attractions-v2", params, %w[geo])
    end

    # Trip planner in one call: a place name (or geo_id) is resolved to its location, then
    # its attractions, hotels or restaurants (kind) are listed 30 per page, optionally
    # with the first page of reviews for the top N results. Ambiguous names answer 400
    # with the candidates.
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   q (string, required): A place name (city, region or country), qualified with its
    #     region or country when several places share the name ("Paris, France", "Paris,
    #     Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous or
    #     unknown name answers 400 with the candidate places
    #   kind (string): What to list for the place. One of: attractions, hotels,
    #     restaurants
    #   reviews (integer): Attach the first page of reviews (15) to the top N results of
    #     the page; 0 for none. A review lookup that fails leaves that result's reviews
    #     null. One of: 0, 1, 2, 3, 4, 5
    #   page (integer): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to
    #     30*N); up to 333 for restaurants, 1000 otherwise
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def explore(**params)
      get("/explore", params, %w[q])
    end

    # Live date-driven hotel price offers for a location (geo_id).
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   checkInDate (string, required): Check-in date (YYYY-MM-DD)
    #   checkOutDate (string, required): Check-out date (YYYY-MM-DD)
    #   adults (integer): Number of adults
    #   rooms (integer): Number of rooms
    #   childrenAges (string): Comma-separated children ages, e.g. 4,9
    #   refresh (boolean): Bypass and repopulate the cache
    def hotel_offers(**params)
      get("/hotel-offers", params, %w[geo checkInDate checkOutDate])
    end

    # Live, dated hotel offers for a location (geo_id), paged through every hotel the site
    # lists: offset reaches data.total (the site's own hotel count), limit up to 100.
    # Optional currency and sort.
    #
    # Each successful request uses 1 credit for every 100 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris,
    #     60763 New York City)
    #   checkInDate (string): Check-in date (YYYY-MM-DD, today or later). Default: 30
    #     days from today
    #   checkOutDate (string): Check-out date (YYYY-MM-DD, after checkInDate). Default:
    #     checkInDate + 2 nights
    #   adults (integer): Number of adults (1-16)
    #   rooms (integer): Number of rooms (1-8)
    #   childrenAges (string): Comma-separated children ages 0-17, e.g. 4,9
    #   currency (string): ISO 4217 currency the offers are priced in (e.g. USD, EUR,
    #     GBP, TRY)
    #   sort (string): Order of the list: POPULARITY (traveler ranked), BEST_VALUE,
    #     PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: POPULARITY,
    #     BEST_VALUE, PRICE_LOW_TO_HIGH, DISTANCE
    #   limit (integer): Hotels per page (1-100)
    #   offset (integer): Hotels to skip; walk it up to pagination.total to reach every
    #     hotel of the location
    #   refresh (boolean): Bypass and repopulate the cache
    def hotel_offers_v2(**params)
      get("/hotel-offers-v2", params, %w[geo])
    end

    # Hotels / accommodation for a location (geo_id), 30 per page.
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   page (integer): 1-based source page (30 results each)
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def hotels(**params)
      get("/hotels", params, %w[geo])
    end

    # ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).
    #
    # Each successful request uses 1 credit for every 250 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   limit (integer): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000).
    #     The full set (up to 1000) is fetched and cached per geo; ?limit slices it
    #   offset (integer): Offset within the fetched set
    #   refresh (boolean): Bypass and repopulate the cache
    def hotels_all(**params)
      get("/hotels-all", params, %w[geo])
    end

    # Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
    # total photo count.
    #
    # Each successful request uses 1 credit for every 100 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   id (string, required): TripAdvisor detail id of a hotel, restaurant or
    #     attraction (the id the list endpoints return, the d<id> in a place URL)
    #   limit (integer): Photos per page (1-30)
    #   offset (integer): Photo offset within the gallery's first 100 photos
    #   refresh (boolean): Bypass and repopulate the cache
    def photos(**params)
      get("/photos", params, %w[id])
    end

    # The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
    # the total photo count: offset reaches the total, limit up to the site's own per-call
    # maximum (100).
    #
    # Each successful request uses 1 credit for every 100 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   id (string, required): TripAdvisor detail id of a hotel, restaurant or
    #     attraction (the id the list endpoints return, the d<id> in a place URL)
    #   limit (integer): Photos per call, up to the site's own per-call maximum (100)
    #   offset (integer): Photo offset within the whole gallery; valid up to data.total
    #   refresh (boolean): Bypass and repopulate the cache
    def photos_v2(**params)
      get("/photos-v2", params, %w[id])
    end

    # Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
    # name, rating, review count, ranking, address, coordinates, phone, price level,
    # description, photo count, image, plus amenities (hotels), cuisines (restaurants),
    # opening hours and category. Works for any place id, inside or outside its geo's
    # lists.
    #
    # Parameters:
    #   id (string, required): TripAdvisor detail id (the `id` field from a list
    #     endpoint)
    #   geo (string, required): TripAdvisor geo_id the place belongs to (the `geo_id` of
    #     a list row). Used to find the place's list row for ranking and amenities; a
    #     place outside that list is still answered
    #   type (string, required): Place type: hotel, restaurant or attraction. One of:
    #     hotel, restaurant, attraction
    #   refresh (boolean): Bypass and repopulate the cache
    def place(**params)
      get("/place", params, %w[id geo type])
    end

    # Restaurants / eateries for a location (geo_id).
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   page (integer): 1-based source page (30 results each)
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def restaurants(**params)
      get("/restaurants", params, %w[geo])
    end

    # Restaurants for a location (geo_id), 30 per page with working pagination, optional
    # cuisine and price range filters, and weekly opening hours when available.
    #
    # Each successful request uses 1 credit for every 30 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   geo (string, required): TripAdvisor geo_id from /search
    #   page (integer): 1-based page, 30 restaurants each (page N returns ranks
    #     30*(N-1)+1 to 30*N, the next 30 distinct restaurants)
    #   cuisine (string): Optional cuisine filter: a cuisine name or id (e.g. Seafood or
    #     10643, Turkish or 10663, Italian or 4617); comma-separate several to match any
    #     of them. The cuisines a geo offers are listed in data.available_cuisines
    #   price (string): Optional price range filter: cheap (Cheap Eats, $), mid
    #     (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g.
    #     cheap,mid). One of: cheap, mid, fine
    #   limit (integer): Max items returned from the page
    #   offset (integer): Item offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def restaurants_v2(**params)
      get("/restaurants-v2", params, %w[geo])
    end

    # Traveler reviews for one place by detail id.
    #
    # Each successful request uses 1 credit for every 15 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   id (string, required): TripAdvisor detail id (from a list endpoint)
    #   geo (string): Ignored: accepted for compatibility with the other detail
    #     endpoints; reviews are looked up by id alone
    #   type (string): Ignored: accepted for compatibility with the other detail
    #     endpoints; reviews are looked up by id alone. One of: hotel, restaurant,
    #     attraction
    #   page (integer): 1-based page; ~18 reviews on page 1, deeper pages best-effort
    #     (10 each)
    #   limit (integer): Max reviews returned
    #   offset (integer): Review offset within the page
    #   refresh (boolean): Bypass and repopulate the cache
    def reviews(**params)
      get("/reviews", params, %w[id])
    end

    # Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).
    #
    # Each successful request uses 1 credit for every 10 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   q (string, required): Place name to resolve, e.g. a city or country
    #   types (string): Ignored: accepted so older calls stay valid; results are not
    #     filtered by type. Use /search-v3?types= to filter
    #   limit (integer): Max results per page
    #   offset (integer): Result offset
    #   refresh (boolean): Bypass and repopulate the cache
    def search(**params)
      get("/search", params, %w[q])
    end

    # Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
    # coordinates + thumbnail), optionally biased toward a lat/lng point.
    #
    # Each successful request uses 1 credit for every 10 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   q (string, required): Place or venue name to resolve, e.g. a city, landmark or
    #     hotel
    #   lat (number): Optional latitude to bias results toward (give together with lng)
    #   lng (number): Optional longitude to bias results toward (give together with lat)
    #   types (string): Ignored: accepted so older calls stay valid; results are not
    #     filtered by type. Use /search-v3?types= to filter
    #   limit (integer): Max results per page (the endpoint returns at most 10
    #     locations)
    #   offset (integer): Result offset
    #   refresh (boolean): Bypass and repopulate the cache
    def search_v2(**params)
      get("/search-v2", params, %w[q])
    end

    # Geo search v3: resolve a place name to every TripAdvisor location the site's search
    # returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
    # and filtered by kind with types; page with limit/offset.
    #
    # Each successful request uses 1 credit for every 20 rows it returns (at least 1
    # credit).
    #
    # Parameters:
    #   q (string, required): Place or venue name to resolve, e.g. a city, landmark or
    #     hotel
    #   lat (number): Optional latitude to bias results toward (give together with lng)
    #   lng (number): Optional longitude to bias results toward (give together with lat)
    #   types (string): Optional filter by kind of place, a comma list of: geo,
    #     accommodation, attraction, attraction_product, eatery, airline, ship,
    #     cruise_line (e.g. geo for cities and countries only, eatery,attraction for
    #     both). Omit it to get every kind. The filter keeps the ranking of the unfiltered
    #     list
    #   limit (integer): Max results per page. No cap of its own: any value is accepted,
    #     and the list is bounded only by how many locations the site returns for the
    #     query (up to about 200). Omit it to get the whole list
    #   offset (integer): Number of results to skip, to page through the list with limit
    #     (the site itself has no paging, so the whole list is fetched once and paged
    #     here)
    #   refresh (boolean): Bypass and repopulate the cache
    def search_v3(**params)
      get("/search-v3", params, %w[q])
    end

    private

    def get(path, params, required)
      params = params.transform_keys(&:to_s)
      missing = required.find { |name| params[name].nil? }
      raise ArgumentError, "missing required parameter: #{missing}" if missing

      query = {}
      params.each do |name, value|
        next if value.nil?

        token = "{#{name}}"
        if path.include?(token)
          path = path.sub(token, URI.encode_www_form_component(value.to_s).gsub("+", "%20"))
        else
          query[name] = value.to_s
        end
      end
      uri = URI(@base_url + path)
      uri.query = URI.encode_www_form(query) unless query.empty?
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{@api_key}"
      request["Accept"] = "application/json"
      request["User-Agent"] = "tripadvisor-unofficial-sdk/0.1.0 (ruby)"
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https", read_timeout: @timeout) do |http|
        http.request(request)
      end
      data = begin
        JSON.parse(response.body.to_s)
      rescue JSON::ParserError
        nil
      end
      return data if response.is_a?(Net::HTTPSuccess)

      detail = data.is_a?(Hash) ? data : {}
      raise ApiError.new(response.code.to_i, detail["error"] || "http_error", detail["message"] || response.body.to_s[0, 200])
    end
  end
end
