import { Link } from "react-router-dom";
import { useAuth } from "../features/auth";
import gymImage from "../assets/gym.jpg";
import styles from "./pages.module.css";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.publicPageShell}>
      <div className={styles.publicHeroCard}>
        <div className={styles.publicHeroContent}>
          <span className={styles.publicHeroBadge}>Gym Platform</span>
          <h1 className={styles.publicHeroTitle}>Train smarter. Track everything.</h1>
          <p className={styles.publicHeroLead}>
            Manage workouts, nutrition, and progress in one place with a fast,
            clean interface built for consistency.
          </p>

          <div className={styles.publicFeatureGrid}>
            <div className={styles.publicFeatureItem}>Workout plans & sessions</div>
            <div className={styles.publicFeatureItem}>Nutrition logs & goals</div>
            <div className={styles.publicFeatureItem}>Progress charts & calendar</div>
            <div className={styles.publicFeatureItem}>Nearby gyms discovery</div>
          </div>

          <div className={styles.publicActionsRow}>
            {user ? (
              <Link to="/dashboard" className={styles.publicPrimaryLink}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={styles.publicPrimaryLink}>
                  Sign In
                </Link>

                <Link to="/register" className={styles.publicSecondaryLink}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.publicHeroMediaWrap}>
          <img
            src={gymImage}
            alt="Modern gym interior"
            className={styles.publicHeroImage}
          />
        </div>
      </div>
    </div>
  );
}