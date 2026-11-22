"""Unofficial Tripadvisor API client for Python.

Trip-planning data from Tripadvisor: geo search plus attractions, restaurants and hotels by location (geo_id), with ratings, reviews, price and coordinates. Resolve a place name with /search, then list with /attractions, /restaurants, /hotels.

Not affiliated with Tripadvisor. Endpoint reference: https://maviapi.com/apis/tripadvisor
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, Optional

__version__ = "0.1.0"
__all__ = ["TripadvisorClient", "ApiError", "DEMO_KEY"]

DEMO_KEY = "mvk_test_playground_5f3c1a8d"


class ApiError(Exception):
    """An error status answered by the API."""

    def __init__(self, status: int, code: str, message: str) -> None:
        super().__init__(f"{status} {code}: {message}")
        self.status = status
        self.code = code
        self.message = message


class TripadvisorClient:
    """Tripadvisor API client.

    With no api_key it uses the MAVIAPI_API_KEY environment variable, then the
    shared demo key.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: Optional[str] = None,
        timeout: float = 120.0,
    ) -> None:
        self.api_key = api_key or os.environ.get("MAVIAPI_API_KEY") or DEMO_KEY
        root = base_url or os.environ.get("MAVIAPI_BASE_URL") or "https://api.maviapi.com"
        self.base_url = root.rstrip("/") + "/v1/sites/tripadvisor"
        self.timeout = timeout

    def attractions(self, *, geo: str, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Top attractions / things to do for a location (geo_id).

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          page (integer): 1-based source page (30 results each)
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/attractions", {"geo": geo, "page": page, "limit": limit, "offset": offset, "refresh": refresh})

    def attractions_v2(self, *, geo: str, page: Optional[int] = None, category: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Attractions for a location (geo_id), 30 per page with working pagination, an
        optional category filter, categories and tags as id/name arrays and a description
        when available.

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          page (integer): 1-based source page, 30 attractions each (page N returns ranks
            30*(N-1)+1 to 30*N)
          category (string): Optional attraction category id: 47 Sights & Landmarks, 49
            Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41
            Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos
            & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in
            data.available_categories. One of: 47, 49, 57, 56, 20, 40, 41, 48, 52, 53, 55
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/attractions-v2", {"geo": geo, "page": page, "category": category, "limit": limit, "offset": offset, "refresh": refresh})

    def explore(self, *, q: str, kind: Optional[str] = None, reviews: Optional[int] = None, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Trip planner in one call: a place name (or geo_id) is resolved to its location, then
        its attractions, hotels or restaurants (kind) are listed 30 per page, optionally
        with the first page of reviews for the top N results. Ambiguous names answer 400
        with the candidates.

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          q (string, required): A place name (city, region or country), qualified with its
            region or country when several places share the name ("Paris, France", "Paris,
            Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous or
            unknown name answers 400 with the candidate places
          kind (string): What to list for the place. One of: attractions, hotels,
            restaurants
          reviews (integer): Attach the first page of reviews (15) to the top N results of
            the page; 0 for none. A review lookup that fails leaves that result's reviews
            null. One of: 0, 1, 2, 3, 4, 5
          page (integer): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to
            30*N); up to 333 for restaurants, 1000 otherwise
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/explore", {"q": q, "kind": kind, "reviews": reviews, "page": page, "limit": limit, "offset": offset, "refresh": refresh})

    def hotel_offers(self, *, geo: str, checkInDate: str, checkOutDate: str, adults: Optional[int] = None, rooms: Optional[int] = None, childrenAges: Optional[str] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Live date-driven hotel price offers for a location (geo_id).

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          checkInDate (string, required): Check-in date (YYYY-MM-DD)
          checkOutDate (string, required): Check-out date (YYYY-MM-DD)
          adults (integer): Number of adults
          rooms (integer): Number of rooms
          childrenAges (string): Comma-separated children ages, e.g. 4,9
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/hotel-offers", {"geo": geo, "checkInDate": checkInDate, "checkOutDate": checkOutDate, "adults": adults, "rooms": rooms, "childrenAges": childrenAges, "refresh": refresh})

    def hotel_offers_v2(self, *, geo: str, checkInDate: Optional[str] = None, checkOutDate: Optional[str] = None, adults: Optional[int] = None, rooms: Optional[int] = None, childrenAges: Optional[str] = None, currency: Optional[str] = None, sort: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Live, dated hotel offers for a location (geo_id), paged through every hotel the site
        lists: offset reaches data.total (the site's own hotel count), limit up to 100.
        Optional currency and sort.

        Each successful request uses 1 credit for every 100 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris,
            60763 New York City)
          checkInDate (string): Check-in date (YYYY-MM-DD, today or later). Default: 30
            days from today
          checkOutDate (string): Check-out date (YYYY-MM-DD, after checkInDate). Default:
            checkInDate + 2 nights
          adults (integer): Number of adults (1-16)
          rooms (integer): Number of rooms (1-8)
          childrenAges (string): Comma-separated children ages 0-17, e.g. 4,9
          currency (string): ISO 4217 currency the offers are priced in (e.g. USD, EUR,
            GBP, TRY)
          sort (string): Order of the list: POPULARITY (traveler ranked), BEST_VALUE,
            PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: POPULARITY,
            BEST_VALUE, PRICE_LOW_TO_HIGH, DISTANCE
          limit (integer): Hotels per page (1-100)
          offset (integer): Hotels to skip; walk it up to pagination.total to reach every
            hotel of the location
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/hotel-offers-v2", {"geo": geo, "checkInDate": checkInDate, "checkOutDate": checkOutDate, "adults": adults, "rooms": rooms, "childrenAges": childrenAges, "currency": currency, "sort": sort, "limit": limit, "offset": offset, "refresh": refresh})

    def hotels(self, *, geo: str, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Hotels / accommodation for a location (geo_id), 30 per page.

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          page (integer): 1-based source page (30 results each)
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/hotels", {"geo": geo, "page": page, "limit": limit, "offset": offset, "refresh": refresh})

    def hotels_all(self, *, geo: str, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).

        Each successful request uses 1 credit for every 250 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          limit (integer): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000).
            The full set (up to 1000) is fetched and cached per geo; ?limit slices it
          offset (integer): Offset within the fetched set
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/hotels-all", {"geo": geo, "limit": limit, "offset": offset, "refresh": refresh})

    def photos(self, *, id: str, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the
        total photo count.

        Each successful request uses 1 credit for every 100 rows it returns (at least 1
        credit).

        Parameters:
          id (string, required): TripAdvisor detail id of a hotel, restaurant or
            attraction (the id the list endpoints return, the d<id> in a place URL)
          limit (integer): Photos per page (1-30)
          offset (integer): Photo offset within the gallery's first 100 photos
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/photos", {"id": id, "limit": limit, "offset": offset, "refresh": refresh})

    def photos_v2(self, *, id: str, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with
        the total photo count: offset reaches the total, limit up to the site's own per-call
        maximum (100).

        Each successful request uses 1 credit for every 100 rows it returns (at least 1
        credit).

        Parameters:
          id (string, required): TripAdvisor detail id of a hotel, restaurant or
            attraction (the id the list endpoints return, the d<id> in a place URL)
          limit (integer): Photos per call, up to the site's own per-call maximum (100)
          offset (integer): Photo offset within the whole gallery; valid up to data.total
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/photos-v2", {"id": id, "limit": limit, "offset": offset, "refresh": refresh})

    def place(self, *, id: str, geo: str, type: str, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id:
        name, rating, review count, ranking, address, coordinates, phone, price level,
        description, photo count, image, plus amenities (hotels), cuisines (restaurants),
        opening hours and category. Works for any place id, inside or outside its geo's
        lists.

        Parameters:
          id (string, required): TripAdvisor detail id (the `id` field from a list
            endpoint)
          geo (string, required): TripAdvisor geo_id the place belongs to (the `geo_id` of
            a list row). Used to find the place's list row for ranking and amenities; a
            place outside that list is still answered
          type (string, required): Place type: hotel, restaurant or attraction. One of:
            hotel, restaurant, attraction
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/place", {"id": id, "geo": geo, "type": type, "refresh": refresh})

    def restaurants(self, *, geo: str, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Restaurants / eateries for a location (geo_id).

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          page (integer): 1-based source page (30 results each)
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/restaurants", {"geo": geo, "page": page, "limit": limit, "offset": offset, "refresh": refresh})

    def restaurants_v2(self, *, geo: str, page: Optional[int] = None, cuisine: Optional[str] = None, price: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Restaurants for a location (geo_id), 30 per page with working pagination, optional
        cuisine and price range filters, and weekly opening hours when available.

        Each successful request uses 1 credit for every 30 rows it returns (at least 1
        credit).

        Parameters:
          geo (string, required): TripAdvisor geo_id from /search
          page (integer): 1-based page, 30 restaurants each (page N returns ranks
            30*(N-1)+1 to 30*N, the next 30 distinct restaurants)
          cuisine (string): Optional cuisine filter: a cuisine name or id (e.g. Seafood or
            10643, Turkish or 10663, Italian or 4617); comma-separate several to match any
            of them. The cuisines a geo offers are listed in data.available_cuisines
          price (string): Optional price range filter: cheap (Cheap Eats, $), mid
            (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g.
            cheap,mid). One of: cheap, mid, fine
          limit (integer): Max items returned from the page
          offset (integer): Item offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/restaurants-v2", {"geo": geo, "page": page, "cuisine": cuisine, "price": price, "limit": limit, "offset": offset, "refresh": refresh})

    def reviews(self, *, id: str, geo: Optional[str] = None, type: Optional[str] = None, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Traveler reviews for one place by detail id.

        Each successful request uses 1 credit for every 15 rows it returns (at least 1
        credit).

        Parameters:
          id (string, required): TripAdvisor detail id (from a list endpoint)
          geo (string): Ignored: accepted for compatibility with the other detail
            endpoints; reviews are looked up by id alone
          type (string): Ignored: accepted for compatibility with the other detail
            endpoints; reviews are looked up by id alone. One of: hotel, restaurant,
            attraction
          page (integer): 1-based page; ~18 reviews on page 1, deeper pages best-effort
            (10 each)
          limit (integer): Max reviews returned
          offset (integer): Review offset within the page
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/reviews", {"id": id, "geo": geo, "type": type, "page": page, "limit": limit, "offset": offset, "refresh": refresh})

    def search(self, *, q: str, types: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).

        Each successful request uses 1 credit for every 10 rows it returns (at least 1
        credit).

        Parameters:
          q (string, required): Place name to resolve, e.g. a city or country
          types (string): Ignored: accepted so older calls stay valid; results are not
            filtered by type. Use /search-v3?types= to filter
          limit (integer): Max results per page
          offset (integer): Result offset
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/search", {"q": q, "types": types, "limit": limit, "offset": offset, "refresh": refresh})

    def search_v2(self, *, q: str, lat: Optional[float] = None, lng: Optional[float] = None, types: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id +
        coordinates + thumbnail), optionally biased toward a lat/lng point.

        Each successful request uses 1 credit for every 10 rows it returns (at least 1
        credit).

        Parameters:
          q (string, required): Place or venue name to resolve, e.g. a city, landmark or
            hotel
          lat (number): Optional latitude to bias results toward (give together with lng)
          lng (number): Optional longitude to bias results toward (give together with lat)
          types (string): Ignored: accepted so older calls stay valid; results are not
            filtered by type. Use /search-v3?types= to filter
          limit (integer): Max results per page (the endpoint returns at most 10
            locations)
          offset (integer): Result offset
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/search-v2", {"q": q, "lat": lat, "lng": lng, "types": types, "limit": limit, "offset": offset, "refresh": refresh})

    def search_v3(self, *, q: str, lat: Optional[float] = None, lng: Optional[float] = None, types: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, refresh: Optional[bool] = None) -> Dict[str, Any]:
        """
        Geo search v3: resolve a place name to every TripAdvisor location the site's search
        returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point
        and filtered by kind with types; page with limit/offset.

        Each successful request uses 1 credit for every 20 rows it returns (at least 1
        credit).

        Parameters:
          q (string, required): Place or venue name to resolve, e.g. a city, landmark or
            hotel
          lat (number): Optional latitude to bias results toward (give together with lng)
          lng (number): Optional longitude to bias results toward (give together with lat)
          types (string): Optional filter by kind of place, a comma list of: geo,
            accommodation, attraction, attraction_product, eatery, airline, ship,
            cruise_line (e.g. geo for cities and countries only, eatery,attraction for
            both). Omit it to get every kind. The filter keeps the ranking of the unfiltered
            list
          limit (integer): Max results per page. No cap of its own: any value is accepted,
            and the list is bounded only by how many locations the site returns for the
            query (up to about 200). Omit it to get the whole list
          offset (integer): Number of results to skip, to page through the list with limit
            (the site itself has no paging, so the whole list is fetched once and paged
            here)
          refresh (boolean): Bypass and repopulate the cache
        """
        return self._get("/search-v3", {"q": q, "lat": lat, "lng": lng, "types": types, "limit": limit, "offset": offset, "refresh": refresh})

    def _get(self, path: str, params: Dict[str, Any]) -> Dict[str, Any]:
        query = {}
        for name, value in params.items():
            if value is None:
                continue
            text = str(value).lower() if isinstance(value, bool) else str(value)
            token = "{" + name + "}"
            if token in path:
                path = path.replace(token, urllib.parse.quote(text, safe=""))
            else:
                query[name] = text
        url = self.base_url + path + ("?" + urllib.parse.urlencode(query) if query else "")
        request = urllib.request.Request(
            url,
            headers={
                "Authorization": "Bearer " + self.api_key,
                "Accept": "application/json",
                "User-Agent": "tripadvisor-unofficial-sdk/0.1.0 (python)",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as error:
            body = error.read().decode("utf-8", "replace")
            try:
                detail = json.loads(body)
            except ValueError:
                detail = None
            if not isinstance(detail, dict):
                detail = {}
            raise ApiError(
                error.code,
                str(detail.get("error", "http_error")),
                str(detail.get("message", body[:200])),
            ) from None
