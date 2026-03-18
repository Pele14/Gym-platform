import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RegisterPayload } from "../types/auth_types";
import styles from "../auth.module.css";

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Account</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            className={styles.input}
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="first_name">
            First Name
          </label>
          <input
            className={styles.input}
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="last_name">
            Last Name
          </label>
          <input
            className={styles.input}
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>

      <div className={styles.link}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}