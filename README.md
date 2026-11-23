# Tripadvisor Unofficial SDK

Unofficial **Tripadvisor API** client for Python, JavaScript/TypeScript, Go, PHP, Ruby, Java and C#. Trip-planning data from Tripadvisor: geo search plus attractions, restaurants and hotels by location (geo_id), with ratings, reviews, price and coordinates. Resolve a place name with /search, then list with /attractions, /restaurants, /hotels.

- **16 endpoints**, each returning JSON, with one method per endpoint in every language.
- **Works with no setup.** With no key, a client uses a shared demo key (30 requests a minute and 300 a day per network).
- **Your own key lifts the limit.** [Create a free key](https://maviapi.com/sign-up?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor): a 7-day trial with 5,000 credits, no card.
- **Kept working.** The API is hosted by [maviapi](https://maviapi.com/apis/tripadvisor?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor), which monitors it and repairs it when the website changes.

> This project is not affiliated with, endorsed by or sponsored by Tripadvisor (tripadvisor.com). All trademarks belong to their owners.

## Quick start

### Python

```bash
pip install "git+https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk#subdirectory=python"
```

```python
from tripadvisor_sdk import TripadvisorClient

client = TripadvisorClient()  # or TripadvisorClient("mvk_live_...")
result = client.explore(q="Paris, France", kind="restaurants")
print(result)
```

### JavaScript / TypeScript

```bash
npm install github:maviapi-sdks/tripadvisor-unofficial-sdk
```

```javascript
import { TripadvisorClient } from "tripadvisor-unofficial-sdk";

const client = new TripadvisorClient(); // or new TripadvisorClient({ apiKey: "mvk_live_..." })
const result = await client.explore({ q: "Paris, France", kind: "restaurants" });
console.log(result);
```

### Go

```bash
go get github.com/maviapi-sdks/tripadvisor-unofficial-sdk
```

```go
package main

import (
	"context"
	"fmt"
	"log"

	tripadvisor "github.com/maviapi-sdks/tripadvisor-unofficial-sdk"
)

func main() {
	client := tripadvisor.New("") // or tripadvisor.New("mvk_live_...")
	result, err := client.Explore(context.Background(), tripadvisor.Params{"q": "Paris, France", "kind": "restaurants"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(result))
}
```

### PHP

```bash
composer config repositories.tripadvisor-unofficial-sdk vcs https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk
composer require maviapi-sdks/tripadvisor-unofficial-sdk:dev-main
```

```php
<?php

require 'vendor/autoload.php';

use TripadvisorSdk\TripadvisorClient;

$client = new TripadvisorClient(); // or new TripadvisorClient('mvk_live_...')
$result = $client->explore(q: 'Paris, France', kind: 'restaurants');
print_r($result);
```

### Ruby

```ruby
# Gemfile
gem "tripadvisor_sdk", git: "https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk", branch: "main"
```

```ruby
require "tripadvisor_sdk"

client = TripadvisorSdk::Client.new # or TripadvisorSdk::Client.new(api_key: "mvk_live_...")
result = client.explore(q: "Paris, France", kind: "restaurants")
puts result
```

### Java

```xml
<!-- pom.xml: the JitPack repository, then the dependency -->
<repository>
  <id>jitpack.io</id>
  <url>https://jitpack.io</url>
</repository>

<dependency>
  <groupId>com.github.maviapi-sdks</groupId>
  <artifactId>tripadvisor-unofficial-sdk</artifactId>
  <version>main-SNAPSHOT</version>
</dependency>
```

The client is one file with no dependencies, so you can also copy [`TripadvisorClient.java`](java/src/main/java/com/maviapi/tripadvisor/TripadvisorClient.java) into your project.

```java
import com.maviapi.tripadvisor.TripadvisorClient;
import java.util.Map;

public class Example {
    public static void main(String[] args) {
        TripadvisorClient client = new TripadvisorClient(); // or new TripadvisorClient("mvk_live_...")
        String json = client.explore(Map.of("q", "Paris, France", "kind", "restaurants"));
        System.out.println(json);
    }
}
```

### C#

```bash
git clone https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk
dotnet add reference tripadvisor-unofficial-sdk/csharp/TripadvisorSdk.csproj
```

The client is one file with no dependencies, so you can also copy [`TripadvisorClient.cs`](csharp/TripadvisorClient.cs) into your project.

```csharp
using TripadvisorSdk;

var client = new TripadvisorClient(); // or new TripadvisorClient("mvk_live_...")
var result = await client.ExploreAsync(new Dictionary<string, object?> { ["q"] = "Paris, France", ["kind"] = "restaurants" });
Console.WriteLine(result);
```

## Endpoints

| Endpoint | What it returns | Credits per call |
|---|---|---|
| [`GET /attractions`](#get-attractions) | Top attractions / things to do for a location (geo_id). | 1 |
| [`GET /attractions-v2`](#get-attractions-v2) | Attractions for a location (geo_id), 30 per page with working pagination, an optional category filter, categories and tags as id/name arrays and a description when available. | 1 |
| [`GET /explore`](#get-explore) | Trip planner in one call: a place name (or geo_id) is resolved to its location, then its attractions, hotels or restaurants (kind) are listed 30 per page, optionally with the first page of reviews for the top N results. | 1 |
| [`GET /hotel-offers`](#get-hotel-offers) | Live date-driven hotel price offers for a location (geo_id). | 1 |
| [`GET /hotel-offers-v2`](#get-hotel-offers-v2) | Live, dated hotel offers for a location (geo_id), paged through every hotel the site lists: offset reaches data.total (the site's own hotel count), limit up to 100. | 1 |
| [`GET /hotels`](#get-hotels) | Hotels / accommodation for a location (geo_id), 30 per page. | 1 |
| [`GET /hotels-all`](#get-hotels-all) | ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000). | 1 |
| [`GET /photos`](#get-photos) | Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the total photo count. | 1 |
| [`GET /photos-v2`](#get-photos-v2) | The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with the total photo count: offset reaches the total, limit up to the site's own per-call maximum (100). | 1 |
| [`GET /place`](#get-place) | Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id: name, rating, review count, ranking, address, coordinates, phone, price level, description, photo count, image, plus amenities (hotels), cuisines (restaurants), opening hours and category. | 1 |
| [`GET /restaurants`](#get-restaurants) | Restaurants / eateries for a location (geo_id). | 1 |
| [`GET /restaurants-v2`](#get-restaurants-v2) | Restaurants for a location (geo_id), 30 per page with working pagination, optional cuisine and price range filters, and weekly opening hours when available. | 1 |
| [`GET /reviews`](#get-reviews) | Traveler reviews for one place by detail id. | 1 |
| [`GET /search`](#get-search) | Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates). | 1 |
| [`GET /search-v2`](#get-search-v2) | Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point. | 1 |
| [`GET /search-v3`](#get-search-v3) | Geo search v3: resolve a place name to every TripAdvisor location the site's search returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point and filtered by kind with types; page with limit/offset. | 1 |

Try each one in the browser on the [Tripadvisor API page](https://maviapi.com/apis/tripadvisor?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor).

## Authentication

A client takes the key you give it. With none, it reads the `MAVIAPI_API_KEY` environment variable, and then uses the shared demo key (30 requests a minute and 300 a day per network). To get your own, [sign up](https://maviapi.com/sign-up?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor) and create a key on the [keys page](https://maviapi.com/dashboard/keys). A successful request uses the credits its endpoint lists; a failed request is free. Plans are on the [pricing page](https://maviapi.com/pricing?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor).

## Errors

A request the API answers with an error status raises an `ApiError` (in Go, returns an `*Error`) with the HTTP status, a machine-readable code and a message. In Java it carries the status and the response body.

| Status | Code | Meaning |
|---|---|---|
| 400 | `bad_request` | A parameter is missing or cannot be used. |
| 401 | `missing_api_key` | No API key was sent, or the key is invalid or revoked (`missing_api_key`, `invalid_api_key`). |
| 402 | `credit_limit_reached` | The plan's credits for this period are used up. |
| 403 | `account_banned` | The account that owns the key is suspended. |
| 429 | `rate_limited` | Too many requests for this key. Wait the number of seconds in `Retry-After`. |
| 502 | `scrape_failed` | The source site could not be read this time. Retrying later usually works. |

## Endpoint reference

Base URL: `https://api.maviapi.com/v1/sites/tripadvisor`. API version 2026-11-18. The same contract is in [`openapi.json`](openapi.json).

### `GET /attractions`

Top attractions / things to do for a location (geo_id).

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `attractions` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Attractions` (Go) · `AttractionsAsync` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `187147`.
- `page` (integer, optional): 1-based source page (30 results each). Example: `1`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "187147",
      "name": "Paris",
      "country": "France",
      "region": "Ile-de-France",
      "city": "Paris",
      "coordinates": {
        "latitude": 48.857037,
        "longitude": 2.349401
      }
    },
    "attractions": [
      {
        "rank": 1,
        "id": "188151",
        "name": "Eiffel Tower",
        "url": "https://www.tripadvisor.com/Attraction_Review-g187147-d188151-Reviews-Eiffel_Tower-Paris_Ile_de_France.html",
        "rating": 4.6,
        "review_count": 143938,
        "category": "Points of Interest & Landmarks",
        "price": "Admission tickets from $67",
        "description": "Completed in 1889, this colossal landmark is now a famous symbol of French civic pride.",
        "coordinates": {
          "latitude": 48.858353,
          "longitude": 2.294464
        },
        "geo_id": "187147"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:attractions-graphql",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /attractions-v2`

Attractions for a location (geo_id), 30 per page with working pagination, an optional category filter, categories and tags as id/name arrays and a description when available.

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `attractions_v2` (Python, Ruby) · `attractionsV2` (JavaScript/TypeScript, PHP, Java) · `AttractionsV2` (Go) · `AttractionsV2Async` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `293974`.
- `page` (integer, optional): 1-based source page, 30 attractions each (page N returns ranks 30*(N-1)+1 to 30*N). Example: `2`.
- `category` (string, optional): Optional attraction category id: 47 Sights & Landmarks, 49 Museums, 57 Nature & Parks, 56 Fun & Games, 20 Nightlife, 40 Spas & Wellness, 41 Classes & Workshops, 48 Zoos & Aquariums, 52 Water & Amusement Parks, 53 Casinos & Gambling, 55 Boat Tours & Water Sports. The ids the geo offers are listed in data.available_categories. One of: `47`, `49`, `57`, `56`, `20`, `40`, `41`, `48`, `52`, `53`, `55`. Example: `49`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "293974"
    },
    "page": 2,
    "page_size": 30,
    "category": {
      "id": "49",
      "name": "Museums"
    },
    "total": 6776,
    "has_next_page": true,
    "available_categories": [
      {
        "id": "47",
        "name": "Sights & Landmarks",
        "count": 830
      }
    ],
    "attractions": [
      {
        "rank": 33,
        "id": "294550",
        "name": "Rustem Pasha Mosque",
        "url": "https://www.tripadvisor.com/Attraction_Review-g293974-d294550-Reviews-Rustem_Pasha_Mosque-Istanbul.html",
        "rating": 4.6,
        "review_count": 2294,
        "category": "Architectural Buildings • Religious Sites",
        "price": null,
        "description": "One of the smaller mosques in the city, it was built by Rustem Pasa in 1561 and is noted for the very fine tiles covering the interior and exterior walls.",
        "coordinates": {
          "latitude": 41.017574,
          "longitude": 28.968828
        },
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/fd/be/fc/caption.jpg?w=1200&h=-1&s=1",
        "categories": [
          {
            "id": "47",
            "name": "Sights & Landmarks"
          }
        ],
        "tags": [
          {
            "id": "11038",
            "name": "Architectural Buildings"
          }
        ],
        "neighborhood": "Grand Bazaar",
        "geo_id": "293974"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:attractions-graphql",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /explore`

Trip planner in one call: a place name (or geo_id) is resolved to its location, then its attractions, hotels or restaurants (kind) are listed 30 per page, optionally with the first page of reviews for the top N results. Ambiguous names answer 400 with the candidates.

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `explore` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Explore` (Go) · `ExploreAsync` (C#)

Parameters:

- `q` (string, required): A place name (city, region or country), qualified with its region or country when several places share the name ("Paris, France", "Paris, Texas"), or a numeric geo_id. Case and accents are ignored. An ambiguous or unknown name answers 400 with the candidate places. Example: `Paris, France`.
- `kind` (string, optional): What to list for the place. One of: `attractions`, `hotels`, `restaurants`. Example: `attractions`.
- `reviews` (integer, optional): Attach the first page of reviews (15) to the top N results of the page; 0 for none. A review lookup that fails leaves that result's reviews null. One of: `0`, `1`, `2`, `3`, `4`, `5`. Example: `1`.
- `page` (integer, optional): 1-based page of 30 results (page N holds ranks 30*(N-1)+1 to 30*N); up to 333 for restaurants, 1000 otherwise. Example: `1`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "resolved": {
      "input": "Paris, France",
      "geo_id": "187147",
      "name": "Paris",
      "type": "CITY",
      "parent": "Ile-de-France, France"
    },
    "kind": "attractions",
    "page": 1,
    "page_size": 30,
    "total": 10000,
    "has_next_page": true,
    "items": [
      {
        "type": "attraction",
        "geo_id": "187147",
        "rank": 1,
        "id": "188151",
        "name": "Eiffel Tower",
        "url": "https://www.tripadvisor.com/Attraction_Review-g187147-d188151-Reviews-Eiffel_Tower-Paris_Ile_de_France.html",
        "rating": 4.6,
        "review_count": 144159,
        "coordinates": {
          "latitude": 48.858353,
          "longitude": 2.294464
        },
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/b7/5f/1a/eiffel-tower.jpg",
        "reviews": [
          {
            "id": "1085909342",
            "rating": 5,
            "title": "Unforgettable views",
            "text": "Booked the summit tickets in advance and skipped the queue.",
            "published_date": "2026-11-02",
            "stay_date": "2026-10-31",
            "trip_type": "FAMILY",
            "username": "Marie L",
            "helpful_votes": 0,
            "owner_response": null
          }
        ]
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:combo",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /hotel-offers`

Live date-driven hotel price offers for a location (geo_id).

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `hotel_offers` (Python, Ruby) · `hotelOffers` (JavaScript/TypeScript, PHP, Java) · `HotelOffers` (Go) · `HotelOffersAsync` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `187147`.
- `checkInDate` (string, required): Check-in date (YYYY-MM-DD). Example: `2026-07-20`.
- `checkOutDate` (string, required): Check-out date (YYYY-MM-DD). Example: `2026-07-22`.
- `adults` (integer, optional): Number of adults. Example: `2`.
- `rooms` (integer, optional): Number of rooms. Example: `1`.
- `childrenAges` (string, optional): Comma-separated children ages, e.g. 4,9.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "geo_id": "187147",
    "check_in_date": "2026-07-20",
    "check_out_date": "2026-07-22",
    "hotels": [
      {
        "id": "10328342",
        "name": "Hotel Monge",
        "url": "https://www.tripadvisor.com/Hotel_Review-g187147-d10328342-Reviews-...",
        "rating": 4.9,
        "review_count": 1675,
        "lowest_offer": "$256",
        "auction_winner_offer": "$337",
        "award": "BOTB 2026",
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/.../hotel-monge.jpg",
        "tag": "Latin Quarter atmosphere",
        "geo_id": "187147"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:graphql",
  "pagination": {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "count": 3,
    "has_more": false
  }
}
```

</details>

### `GET /hotel-offers-v2`

Live, dated hotel offers for a location (geo_id), paged through every hotel the site lists: offset reaches data.total (the site's own hotel count), limit up to 100. Optional currency and sort.

Each successful request uses 1 credit for every 100 rows it returns (at least 1 credit).

Methods: `hotel_offers_v2` (Python, Ruby) · `hotelOffersV2` (JavaScript/TypeScript, PHP, Java) · `HotelOffersV2` (Go) · `HotelOffersV2Async` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search (e.g. 187147 Paris, 60763 New York City). Example: `187147`.
- `checkInDate` (string, optional): Check-in date (YYYY-MM-DD, today or later). Default: 30 days from today.
- `checkOutDate` (string, optional): Check-out date (YYYY-MM-DD, after checkInDate). Default: checkInDate + 2 nights.
- `adults` (integer, optional): Number of adults (1-16). Example: `2`.
- `rooms` (integer, optional): Number of rooms (1-8). Example: `1`.
- `childrenAges` (string, optional): Comma-separated children ages 0-17, e.g. 4,9.
- `currency` (string, optional): ISO 4217 currency the offers are priced in (e.g. USD, EUR, GBP, TRY). Example: `EUR`.
- `sort` (string, optional): Order of the list: POPULARITY (traveler ranked), BEST_VALUE, PRICE_LOW_TO_HIGH or DISTANCE (to the city center). One of: `POPULARITY`, `BEST_VALUE`, `PRICE_LOW_TO_HIGH`, `DISTANCE`. Example: `POPULARITY`.
- `limit` (integer, optional): Hotels per page (1-100). Example: `30`.
- `offset` (integer, optional): Hotels to skip; walk it up to pagination.total to reach every hotel of the location. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "geo_id": "187147",
    "check_in_date": "2027-01-15",
    "check_out_date": "2027-01-17",
    "adults": 2,
    "rooms": 1,
    "currency": "EUR",
    "sort": "POPULARITY",
    "offers_complete": true,
    "total": 3076,
    "hotels": [
      {
        "rank": 31,
        "id": "28276875",
        "name": "Miss Fuller Hotel",
        "url": "https://www.tripadvisor.com/Hotel_Review-g187147-d28276875-Reviews-Miss_Fuller_Hotel-Paris_Ile_de_France.html",
        "rating": 4.8,
        "review_count": 412,
        "lowest_offer": "€172",
        "auction_winner_offer": "€181",
        "award": "TRAVELLERS_CHOICE 2026",
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/1b/3c/4d/caption.jpg?w=1200&h=-1&s=1",
        "tag": "9th Arr. - Opera",
        "geo_id": "187147"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:graphql",
  "pagination": {
    "total": 3076,
    "limit": 30,
    "offset": 30,
    "count": 30,
    "has_more": true
  }
}
```

</details>

### `GET /hotels`

Hotels / accommodation for a location (geo_id), 30 per page.

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `hotels` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Hotels` (Go) · `HotelsAsync` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `187147`.
- `page` (integer, optional): 1-based source page (30 results each). Example: `1`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "187147",
      "city": "Paris",
      "country": "France"
    },
    "hotels": [
      {
        "rank": 1,
        "id": "229968",
        "name": "Hôtel Astra Opéra - Astotel",
        "url": "https://www.tripadvisor.com/Hotel_Review-g187147-d229968-Reviews-Hotel_Astra_Opera_Astotel-Paris_Ile_de_France.html",
        "rating": 5,
        "review_count": 913,
        "price_range": "$229 - $648",
        "price_min": 229,
        "price_max": 648,
        "ranking_position": 589,
        "ranking_string": "#589 of 1,885 hotels in Paris",
        "accommodation_type": "Hotel",
        "phone": "+33 1 42 65 15 15",
        "address": {
          "street": "29 Rue De Caumartin",
          "locality": "Paris",
          "region": "",
          "country": "France",
          "postal_code": "75009"
        },
        "coordinates": {
          "latitude": 48.87178,
          "longitude": 2.328087
        },
        "neighborhood": "9th Arr. - Opera",
        "amenities": [
          null
        ],
        "award": "BOTB 2026",
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/73/c8/9e/privilege-room-eiffel.jpg",
        "geo_id": "187147"
      }
    ],
    "total": 3008
  },
  "cached": false,
  "source": "tripadvisor:hotels-graphql",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /hotels-all`

ALL hotels under a location (geo_id) in one call, up to ?limit (100/250/1000).

Each successful request uses 1 credit for every 250 rows it returns (at least 1 credit).

Methods: `hotels_all` (Python, Ruby) · `hotelsAll` (JavaScript/TypeScript, PHP, Java) · `HotelsAll` (Go) · `HotelsAllAsync` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `187147`.
- `limit` (integer, optional): How many hotels to return, e.g. 100 / 250 / 1000 (max 1000). The full set (up to 1000) is fetched and cached per geo; ?limit slices it. Example: `250`.
- `offset` (integer, optional): Offset within the fetched set. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "187147",
      "city": "Paris",
      "country": "France"
    },
    "total": 3008,
    "hotels": [
      {
        "rank": 1,
        "id": "229968",
        "name": "Hôtel Astra Opéra - Astotel",
        "rating": 5,
        "review_count": 913,
        "price_range": "$229 - $648",
        "ranking_position": 12,
        "coordinates": {
          "latitude": 48.87178,
          "longitude": 2.328087
        },
        "geo_id": "187147"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:hotels-graphql",
  "pagination": {
    "total": 1000,
    "limit": 250,
    "offset": 0,
    "count": 250,
    "has_more": true
  }
}
```

</details>

### `GET /photos`

Photo gallery of one place (hotel/restaurant/attraction) by detail id, with the total photo count.

Each successful request uses 1 credit for every 100 rows it returns (at least 1 credit).

Methods: `photos` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Photos` (Go) · `PhotosAsync` (C#)

Parameters:

- `id` (string, required): TripAdvisor detail id of a hotel, restaurant or attraction (the id the list endpoints return, the d<id> in a place URL). Example: `294555`.
- `limit` (integer, optional): Photos per page (1-30). Example: `10`.
- `offset` (integer, optional): Photo offset within the gallery's first 100 photos. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "id": "294555",
    "total": 17754,
    "photos": [
      {
        "id": "205139165",
        "url": "https://media-cdn.tripadvisor.com/media/photo-o/0c/3a/2c/dd/istanbul-36h-basilica.jpg",
        "max_width": 1280,
        "max_height": 800,
        "caption": "Would you like to delve into the depths of history? The Basilica Cistern was built in the 6th century...",
        "attribution": {
          "author": "silvy135",
          "author_url": "https://www.tripadvisor.com/Profile/silvy135",
          "source": "TRAVELER"
        },
        "uploaded_at": "2016-07-25T15:38:08.879Z"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:photos-graphql",
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "count": 10,
    "has_more": true
  }
}
```

</details>

### `GET /photos-v2`

The full photo gallery of one place (hotel/restaurant/attraction) by detail id, with the total photo count: offset reaches the total, limit up to the site's own per-call maximum (100).

Each successful request uses 1 credit for every 100 rows it returns (at least 1 credit).

Methods: `photos_v2` (Python, Ruby) · `photosV2` (JavaScript/TypeScript, PHP, Java) · `PhotosV2` (Go) · `PhotosV2Async` (C#)

Parameters:

- `id` (string, required): TripAdvisor detail id of a hotel, restaurant or attraction (the id the list endpoints return, the d<id> in a place URL). Example: `250927`.
- `limit` (integer, optional): Photos per call, up to the site's own per-call maximum (100). Example: `100`.
- `offset` (integer, optional): Photo offset within the whole gallery; valid up to data.total. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "id": "250927",
    "total": 673,
    "photos": [
      {
        "id": "37677329",
        "url": "https://media-cdn.tripadvisor.com/media/photo-o/02/3e/90/41/hotel-exterior.jpg",
        "max_width": 2000,
        "max_height": 1333,
        "caption": "Hotel exterior",
        "attribution": {
          "author": "Management",
          "author_url": "https://www.tripadvisor.com/Profile/management",
          "source": "MANAGEMENT"
        },
        "uploaded_at": "2012-03-20T09:14:51.000Z"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:photos-graphql",
  "pagination": {
    "total": 673,
    "limit": 100,
    "offset": 0,
    "count": 100,
    "has_more": true
  }
}
```

</details>

### `GET /place`

Full detail for one TripAdvisor place (hotel/restaurant/attraction) by detail id: name, rating, review count, ranking, address, coordinates, phone, price level, description, photo count, image, plus amenities (hotels), cuisines (restaurants), opening hours and category. Works for any place id, inside or outside its geo's lists.

Methods: `place` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Place` (Go) · `PlaceAsync` (C#)

Parameters:

- `id` (string, required): TripAdvisor detail id (the `id` field from a list endpoint). Example: `250927`.
- `geo` (string, required): TripAdvisor geo_id the place belongs to (the `geo_id` of a list row). Used to find the place's list row for ranking and amenities; a place outside that list is still answered. Example: `187147`.
- `type` (string, required): Place type: hotel, restaurant or attraction. One of: `hotel`, `restaurant`, `attraction`. Example: `hotel`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "id": "250927",
    "type": "hotel",
    "name": "Hotel Europe Saint Severin",
    "rating": 4.5,
    "review_count": 3259,
    "ranking_position": 41,
    "ranking_denominator": 1834,
    "ranking_category": "hotels in Paris",
    "price_range": "$$",
    "description": "Book Hotel Europe Saint Severin, Paris on Tripadvisor...",
    "photo_count": 690,
    "phone": "+33 1 43 54 44 53",
    "address": {
      "street": "38-40 Rue Saint Severin",
      "locality": "Paris",
      "region": "Ile-de-France",
      "country": "FR",
      "postal_code": "75005"
    },
    "coordinates": {
      "latitude": 48.852753,
      "longitude": 2.344314
    },
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/.../exterior.jpg",
    "url": "https://www.tripadvisor.com/Hotel_Review-g187147-d250927-Reviews-...",
    "cuisines": [
      null
    ],
    "amenities": [
      null
    ],
    "opening_hours": [
      null
    ],
    "category": "LodgingBusiness",
    "source": "list"
  },
  "cached": false,
  "source": "tripadvisor:detail"
}
```

</details>

### `GET /restaurants`

Restaurants / eateries for a location (geo_id).

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `restaurants` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Restaurants` (Go) · `RestaurantsAsync` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `187147`.
- `page` (integer, optional): 1-based source page (30 results each). Example: `1`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "187147",
      "city": "Paris",
      "country": "France"
    },
    "restaurants": [
      {
        "rank": 1,
        "id": "3159643",
        "name": "Bistro L'Olivier",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g187147-d3159643-Reviews-Bistro_L_Olivier-Paris_Ile_de_France.html",
        "rating": 4.8,
        "review_count": 2335,
        "price_range": "$$ - $$$",
        "cuisine": [
          null
        ],
        "phone": "+33 1 46 06 46 14",
        "address": {
          "street": "88 Rue Ordener, 75018 Paris France",
          "locality": "Paris",
          "region": "",
          "country": "France",
          "postal_code": "75018"
        },
        "coordinates": {
          "latitude": 48.892815,
          "longitude": 2.342972
        },
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/90/ce/19/venez-deguster-des-dejeuners.jpg",
        "accepts_reservations": true,
        "geo_id": "293974"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:restaurants-graphql",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /restaurants-v2`

Restaurants for a location (geo_id), 30 per page with working pagination, optional cuisine and price range filters, and weekly opening hours when available.

Each successful request uses 1 credit for every 30 rows it returns (at least 1 credit).

Methods: `restaurants_v2` (Python, Ruby) · `restaurantsV2` (JavaScript/TypeScript, PHP, Java) · `RestaurantsV2` (Go) · `RestaurantsV2Async` (C#)

Parameters:

- `geo` (string, required): TripAdvisor geo_id from /search. Example: `293974`.
- `page` (integer, optional): 1-based page, 30 restaurants each (page N returns ranks 30*(N-1)+1 to 30*N, the next 30 distinct restaurants). Example: `2`.
- `cuisine` (string, optional): Optional cuisine filter: a cuisine name or id (e.g. Seafood or 10643, Turkish or 10663, Italian or 4617); comma-separate several to match any of them. The cuisines a geo offers are listed in data.available_cuisines. Example: `Seafood`.
- `price` (string, optional): Optional price range filter: cheap (Cheap Eats, $), mid (Mid-range, $ - $$) or fine (Fine Dining, $$); comma-separate several (e.g. cheap,mid). One of: `cheap`, `mid`, `fine`. Example: `fine`.
- `limit` (integer, optional): Max items returned from the page. Example: `50`.
- `offset` (integer, optional): Item offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "location": {
      "geo_id": "293974",
      "name": "Istanbul",
      "country": "Türkiye",
      "region": null,
      "city": "Istanbul",
      "coordinates": null,
      "breadcrumbs": [
        null
      ]
    },
    "page": 2,
    "page_size": 30,
    "filters": {
      "cuisine": [
        {
          "id": "10643",
          "name": "Seafood"
        }
      ],
      "price": [
        {
          "id": "10954",
          "name": "Fine Dining"
        }
      ]
    },
    "total": 10000,
    "has_next_page": true,
    "available_cuisines": [
      {
        "id": "10663",
        "name": "Turkish",
        "count": 7694
      }
    ],
    "available_price_ranges": [
      {
        "id": "10955",
        "name": "Mid-range",
        "count": 3512
      }
    ],
    "restaurants": [
      {
        "rank": 31,
        "id": "7276643",
        "name": "Marbella Terrace Restaurant",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g293974-d7276643-Reviews-Marbella_Terrace_Restaurant-Istanbul.html",
        "rating": 4.9,
        "review_count": 1483,
        "price_range": "$$",
        "cuisine": [
          null
        ],
        "phone": "+90 212 638 09 69",
        "address": {
          "street": "Kucuk Ayasofya Mah. Cayiroglu Sok. No: 32/B Kucuk Ayasofya Mah., Istanbul 34122 Türkiye",
          "locality": "Istanbul",
          "region": null,
          "country": "Türkiye",
          "postal_code": "34122"
        },
        "coordinates": {
          "latitude": 41.00267,
          "longitude": 28.974733
        },
        "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/fc/89/99/caption.jpg?w=1200&h=-1&s=1",
        "accepts_reservations": true,
        "opening_hours": {
          "mon": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "tue": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "wed": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "thu": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "fri": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "sat": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ],
          "sun": [
            {
              "open": "10:00",
              "close": "02:00"
            }
          ]
        },
        "geo_id": "293974"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:restaurants-graphql",
  "pagination": {
    "total": 30,
    "limit": 50,
    "offset": 0,
    "count": 30,
    "has_more": false
  }
}
```

</details>

### `GET /reviews`

Traveler reviews for one place by detail id.

Each successful request uses 1 credit for every 15 rows it returns (at least 1 credit).

Methods: `reviews` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Reviews` (Go) · `ReviewsAsync` (C#)

Parameters:

- `id` (string, required): TripAdvisor detail id (from a list endpoint). Example: `250927`.
- `geo` (string, optional): Ignored: accepted for compatibility with the other detail endpoints; reviews are looked up by id alone.
- `type` (string, optional): Ignored: accepted for compatibility with the other detail endpoints; reviews are looked up by id alone. One of: `hotel`, `restaurant`, `attraction`. Example: `hotel`.
- `page` (integer, optional): 1-based page; ~18 reviews on page 1, deeper pages best-effort (10 each). Example: `1`.
- `limit` (integer, optional): Max reviews returned. Example: `50`.
- `offset` (integer, optional): Review offset within the page. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "reviews": [
      {
        "id": "1063111111",
        "rating": 5,
        "title": "Location, location, location",
        "text": "We stayed here for three nights after arriving in Paris...",
        "published_date": "2026-06-10",
        "stay_date": "2026-06-30",
        "trip_type": "COUPLES",
        "username": "nolajackie",
        "helpful_votes": 0,
        "owner_response": "Dear Guest, Thank you very much for taking the time..."
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:reviews-graphql",
  "pagination": {
    "total": 18,
    "limit": 50,
    "offset": 0,
    "count": 18,
    "has_more": false
  }
}
```

</details>

### `GET /search`

Geo search: resolve a place name to TripAdvisor locations (geo_id + coordinates).

Each successful request uses 1 credit for every 10 rows it returns (at least 1 credit).

Methods: `search` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Search` (Go) · `SearchAsync` (C#)

Parameters:

- `q` (string, required): Place name to resolve, e.g. a city or country. Example: `paris`.
- `types` (string, optional): Ignored: accepted so older calls stay valid; results are not filtered by type. Use /search-v3?types= to filter.
- `limit` (integer, optional): Max results per page. Example: `50`.
- `offset` (integer, optional): Result offset. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "paris",
    "results": [
      {
        "geo_id": "187147",
        "name": "Paris, Ile-de-France, France",
        "type": "GEO",
        "coordinates": {
          "latitude": 48.857037,
          "longitude": 2.349401
        },
        "url": "/Tourism-g187147-Paris_Ile_de_France-Vacations.html",
        "parent": "Ile-de-France, France"
      }
    ]
  },
  "cached": false,
  "source": "tripadvisor:typeahead-graphql",
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "count": 10,
    "has_more": false
  }
}
```

</details>

### `GET /search-v2`

Geo search v2: resolve a place name to up to 10 TripAdvisor locations (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point.

Each successful request uses 1 credit for every 10 rows it returns (at least 1 credit).

Methods: `search_v2` (Python, Ruby) · `searchV2` (JavaScript/TypeScript, PHP, Java) · `SearchV2` (Go) · `SearchV2Async` (C#)

Parameters:

- `q` (string, required): Place or venue name to resolve, e.g. a city, landmark or hotel. Example: `Galata Tower`.
- `lat` (number, optional): Optional latitude to bias results toward (give together with lng). Example: `41.0256`.
- `lng` (number, optional): Optional longitude to bias results toward (give together with lat). Example: `28.9741`.
- `types` (string, optional): Ignored: accepted so older calls stay valid; results are not filtered by type. Use /search-v3?types= to filter.
- `limit` (integer, optional): Max results per page (the endpoint returns at most 10 locations). Example: `50`.
- `offset` (integer, optional): Result offset. Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "Galata Tower",
    "results": [
      {
        "geo_id": "295194",
        "name": "Galata Tower",
        "type": "ATTRACTION",
        "coordinates": {
          "latitude": 41.025581,
          "longitude": 28.974119
        },
        "url": "https://www.tripadvisor.com/Attraction_Review-g293974-d295194-Reviews-Galata_Tower-Istanbul.html",
        "parent": "Istanbul, Türkiye",
        "thumbnail": {
          "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/25/a7/16/galata-kulesi.jpg?w=400&h=-1&s=1",
          "url_template": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/25/a7/16/galata-kulesi.jpg?w={width}&h={height}&s=1",
          "max_width": 782,
          "max_height": 1310
        }
      }
    ],
    "center": {
      "latitude": 41.0256,
      "longitude": 28.9741
    }
  },
  "cached": false,
  "source": "tripadvisor:typeahead-graphql",
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "count": 10,
    "has_more": false
  }
}
```

</details>

### `GET /search-v3`

Geo search v3: resolve a place name to every TripAdvisor location the site's search returns (geo_id + coordinates + thumbnail), optionally biased toward a lat/lng point and filtered by kind with types; page with limit/offset.

Each successful request uses 1 credit for every 20 rows it returns (at least 1 credit).

Methods: `search_v3` (Python, Ruby) · `searchV3` (JavaScript/TypeScript, PHP, Java) · `SearchV3` (Go) · `SearchV3Async` (C#)

Parameters:

- `q` (string, required): Place or venue name to resolve, e.g. a city, landmark or hotel. Example: `Istanbul`.
- `lat` (number, optional): Optional latitude to bias results toward (give together with lng). Example: `41.0256`.
- `lng` (number, optional): Optional longitude to bias results toward (give together with lat). Example: `28.9741`.
- `types` (string, optional): Optional filter by kind of place, a comma list of: geo, accommodation, attraction, attraction_product, eatery, airline, ship, cruise_line (e.g. geo for cities and countries only, eatery,attraction for both). Omit it to get every kind. The filter keeps the ranking of the unfiltered list. Example: `geo`.
- `limit` (integer, optional): Max results per page. No cap of its own: any value is accepted, and the list is bounded only by how many locations the site returns for the query (up to about 200). Omit it to get the whole list. Example: `100`.
- `offset` (integer, optional): Number of results to skip, to page through the list with limit (the site itself has no paging, so the whole list is fetched once and paged here). Example: `0`.
- `refresh` (boolean, optional): Bypass and repopulate the cache. Example: `false`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "Istanbul",
    "results": [
      {
        "geo_id": "295194",
        "name": "Galata Tower",
        "type": "ATTRACTION",
        "coordinates": {
          "latitude": 41.025581,
          "longitude": 28.974119
        },
        "url": "https://www.tripadvisor.com/Attraction_Review-g293974-d295194-Reviews-Galata_Tower-Istanbul.html",
        "parent": "Istanbul, Türkiye",
        "thumbnail": {
          "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/25/a7/16/galata-kulesi.jpg?w=400&h=-1&s=1",
          "url_template": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/25/a7/16/galata-kulesi.jpg?w={width}&h={height}&s=1",
          "max_width": 782,
          "max_height": 1310
        }
      }
    ],
    "center": {
      "latitude": 41.0256,
      "longitude": 28.9741
    }
  },
  "cached": false,
  "source": "tripadvisor:typeahead-graphql",
  "pagination": {
    "total": 82,
    "limit": 200,
    "offset": 0,
    "count": 82,
    "has_more": false
  }
}
```

</details>

## More

- [Tripadvisor API page](https://maviapi.com/apis/tripadvisor?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor): live examples and the changelog.
- [OpenAPI document](https://api.maviapi.com/v1/apis/tripadvisor/openapi.json) and [Postman collection](https://api.maviapi.com/v1/apis/tripadvisor/postman.json).
- [maviapi MCP server](https://maviapi.com/docs#mcp): the same API as tools for Claude, Cursor and other AI agents.
- [All maviapi APIs](https://maviapi.com/apis?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor). Need a website that is not there? [Ask for it](https://maviapi.com/?utm_source=github&utm_medium=readme&utm_campaign=sdk-tripadvisor) and get an API for it.

Other unofficial SDKs: [Trendyol](https://github.com/maviapi-sdks/trendyol-unofficial-sdk) · [Kiwi.com](https://github.com/maviapi-sdks/kiwi-unofficial-sdk) · [Trainline](https://github.com/maviapi-sdks/trainline-unofficial-sdk) · [MarineTraffic](https://github.com/maviapi-sdks/marinetraffic-unofficial-sdk) · [GetYourGuide](https://github.com/maviapi-sdks/getyourguide-unofficial-sdk) · [Yemeksepeti](https://github.com/maviapi-sdks/yemeksepeti-unofficial-sdk)

## License

MIT. See [LICENSE](LICENSE).
