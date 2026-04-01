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
    const field = e.target.dataset.field ?? e.target.name;

    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Account</h2>

      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="register_fake_username"
          autoComplete="username"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="register_fake_password"
          autoComplete="new-password"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="register_username">
            Username
          </label>
          <input
            className={styles.input}
            id="register_username"
            name="register_username"
            data-field="username"
            type="text"
            autoComplete="new-password"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="register_first_name">
            First Name
          </label>
          <input
            className={styles.input}
            id="register_first_name"
            name="register_first_name"
            data-field="first_name"
            type="text"
            autoComplete="new-password"
            value={formData.first_name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="register_last_name">
            Last Name
          </label>
          <input
            className={styles.input}
            id="register_last_name"
            name="register_last_name"
            data-field="last_name"
            type="text"
            autoComplete="new-password"
            value={formData.last_name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="register_email">
            Email
          </label>
          <input
            className={styles.input}
            id="register_email"
            name="register_email"
            data-field="email"
            type="email"
            autoComplete="new-password"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="register_password">
            Password
          </label>
          <input
            className={styles.input}
            id="register_password"
            name="register_password"
            data-field="password"
            type="password"
            autoComplete="new-password"
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