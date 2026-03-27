import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.config import Config
from app.repositories.auth_repository import AuthRepository


class GymService:
    _NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby"
    _NEARBY_SEARCH_FIELD_MASK = ",".join([
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.rating",
        "places.currentOpeningHours.openNow",
    ])

    @staticmethod
    def _map_place_to_gym(place: dict, fallback_lat: float, fallback_lng: float):
        display_name = place.get("displayName") or {}
        location = place.get("location") or {}
        opening = place.get("currentOpeningHours") or {}

        lat = location.get("latitude")
        lng = location.get("longitude")

        return {
            "id": str(place.get("id") or ""),
            "name": display_name.get("text") or "Unnamed gym",
            "address": place.get("formattedAddress") or "Address unavailable",
            "lat": float(lat) if isinstance(lat, (int, float)) else float(fallback_lat),
            "lng": float(lng) if isinstance(lng, (int, float)) else float(fallback_lng),
            "rating": float(place.get("rating")) if isinstance(place.get("rating"), (int, float)) else None,
            "open_now": (
                bool(opening.get("openNow"))
                if isinstance(opening.get("openNow"), bool)
                else None
            ),
            "weekday_text": [],
        }

    @staticmethod
    def _fetch_nearby_gyms_from_provider(lat: float, lng: float):
        api_key = Config.GOOGLE_MAPS_API_KEY
        if not api_key:
            return None, "Gym provider unavailable."

        payload = {
            "includedTypes": ["gym"],
            "maxResultCount": 20,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": float(lat),
                        "longitude": float(lng),
                    },
                    "radius": 5000.0,
                }
            },
        }

        request = Request(
            GymService._NEARBY_SEARCH_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": api_key,
                "X-Goog-FieldMask": GymService._NEARBY_SEARCH_FIELD_MASK,
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=10) as response:
                parsed_response = json.loads(response.read().decode("utf-8"))
        except HTTPError:
            return None, "Gym provider rejected request."
        except (URLError, TimeoutError, json.JSONDecodeError):
            return None, "Gym provider unavailable."

        places = parsed_response.get("places")
        if places is None:
            return None, "Gym provider invalid response."

        gyms = [
            GymService._map_place_to_gym(place, fallback_lat=lat, fallback_lng=lng)
            for place in places
        ]

        return gyms, None

    @staticmethod
    def get_nearby_gyms(current_user_id: int, lat: float, lng: float):
        user = AuthRepository.get_by_id(current_user_id)

        if not user:
            return None, "User not found."

        gyms, error = GymService._fetch_nearby_gyms_from_provider(lat=lat, lng=lng)
        if error:
            return None, error

        return gyms, None