import { useEffect, useMemo, useState } from "react";
import { useNearbyGyms } from "../hooks/useNearbyGyms";
import type { Gym } from "../types/gym_types";
import styles from "../gyms.module.css";
import GymsMap from "./GymsMap";

function getOpenLabel(value: Gym["open_now"]) {
  if (value === true) return "Open now";
  if (value === false) return "Closed now";
  return "Hours unavailable";
}

function formatCoordinate(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(6) : "";
}

function isValidLatitude(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export default function NearbyGymsView() {
  const {
    gyms,
    coordinates,
    isLoading,
    isLocating,
    error,
    fetchNearbyGyms,
    requestCurrentLocation,
  } = useNearbyGyms();
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLatInput(formatCoordinate(coordinates?.lat));
    setLngInput(formatCoordinate(coordinates?.lng));
  }, [coordinates]);

  useEffect(() => {
    setSelectedGymId((current) => {
      if (!gyms.length) return null;
      if (current && gyms.some((gym) => gym.id == current)) return current;
      return gyms[0].id;
    });
  }, [gyms]);

  const selectedGym = useMemo(
    () => gyms.find((gym) => gym.id === selectedGymId) ?? gyms[0] ?? null,
    [gyms, selectedGymId]
  );

  const handleManualSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const lat = Number(latInput.trim());
    const lng = Number(lngInput.trim());

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setFormError("Enter valid numeric coordinates.");
      return;
    }

    if (!isValidLatitude(lat)) {
      setFormError("Latitude must be between -90 and 90.");
      return;
    }

    if (!isValidLongitude(lng)) {
      setFormError("Longitude must be between -180 and 180.");
      return;
    }

    setFormError(null);
    await fetchNearbyGyms({ lat, lng });
  };

  return (
    <div className={styles.pageShell}>
      <form className={styles.searchCard} onSubmit={handleManualSearch}>
        <div className={styles.fieldRow}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Latitude</span>
            <input
              className={styles.input}
              value={latInput}
              onChange={(event) => {
                setLatInput(event.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="44.786600"
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Longitude</span>
            <input
              className={styles.input}
              value={lngInput}
              onChange={(event) => {
                setLngInput(event.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="20.448900"
            />
          </label>
        </div>

        <div className={styles.searchActions}>
          <p className={styles.searchHint}>Use browser geolocation or search a specific area manually.</p>
          <div className={styles.searchButtons}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => void requestCurrentLocation()}
              disabled={isLocating}
            >
              {isLocating ? "Locating..." : "Use my location"}
            </button>
            <button className={styles.primaryButton} type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search this area"}
            </button>
          </div>
        </div>
      </form>

      {(error || formError) && <div className={styles.errorBanner}>{error || formError}</div>}

      <div className={styles.contentGrid}>
        <section className={styles.mapCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Interactive map</p>
              <h2 className={styles.cardTitle}>Local area</h2>
            </div>
            {coordinates && (
              <p className={styles.coordinatesText}>
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className={styles.mapSurface}>
            {coordinates ? (
              <GymsMap
                coordinates={coordinates}
                gyms={gyms}
                selectedGymId={selectedGymId}
                onSelectGym={setSelectedGymId}
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                <p>Enable location or enter coordinates to load the map.</p>
              </div>
            )}
          </div>
        </section>

        <section className={styles.resultsCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Results</p>
              <h2 className={styles.cardTitle}>{gyms.length} gyms found</h2>
            </div>
          </div>

          {selectedGym && (
            <article className={styles.featuredGymCard}>
              <div className={styles.featuredTopRow}>
                <div>
                  <h3 className={styles.featuredTitle}>{selectedGym.name}</h3>
                  <p className={styles.featuredAddress}>{selectedGym.address || "Address unavailable"}</p>
                </div>
                <span className={styles.statusBadge}>{getOpenLabel(selectedGym.open_now)}</span>
              </div>

              <div className={styles.metricRow}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Rating</span>
                  <strong className={styles.metricValue}>
                    {selectedGym.rating != null ? selectedGym.rating.toFixed(1) : "N/A"}
                  </strong>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Coordinates</span>
                  <strong className={styles.metricValue}>
                    {selectedGym.lat.toFixed(4)}, {selectedGym.lng.toFixed(4)}
                  </strong>
                </div>
              </div>

              <div className={styles.hoursList}>
                {selectedGym.weekday_text.length > 0 ? (
                  selectedGym.weekday_text.map((line) => (
                    <div key={line} className={styles.hoursItem}>{line}</div>
                  ))
                ) : (
                  <div className={styles.hoursItem}>Working hours not available.</div>
                )}
              </div>
            </article>
          )}

          <div className={styles.gymList}>
            {gyms.map((gym) => (
              <button
                key={gym.id || `${gym.name}-${gym.lat}-${gym.lng}`}
                type="button"
                className={`${styles.gymCard} ${selectedGym?.id === gym.id ? styles.gymCardActive : ""}`}
                onClick={() => setSelectedGymId(gym.id)}
              >
                <div className={styles.gymCardTopRow}>
                  <h3 className={styles.gymName}>{gym.name || "Gym"}</h3>
                  <span className={styles.ratingPill}>
                    {gym.rating != null ? gym.rating.toFixed(1) : "—"}
                  </span>
                </div>
                <p className={styles.gymAddress}>{gym.address || "Address unavailable"}</p>
                <p className={styles.gymMeta}>{getOpenLabel(gym.open_now)}</p>
              </button>
            ))}

            {!isLoading && gyms.length === 0 && (
              <div className={styles.emptyState}>No gyms available for the selected coordinates.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}