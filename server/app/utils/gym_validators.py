def validate_nearby_coordinates(lat, lng):
    if lat is None or lng is None:
        return False, "Latitude and longitude are required."

    try:
        parsed_lat = float(lat)
        parsed_lng = float(lng)
    except (TypeError, ValueError):
        return False, "Latitude and longitude must be valid numbers."

    if parsed_lat < -90 or parsed_lat > 90:
        return False, "Latitude must be between -90 and 90."

    if parsed_lng < -180 or parsed_lng > 180:
        return False, "Longitude must be between -180 and 180."

    return True, None