import { useMemo, useState } from "react";
import { useUsers } from "../hooks/useUser";
import styles from "../user.module.css";

export default function UsersTable() {
  const { users, isLoading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.role,
        user.is_active ? "active" : "inactive",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, users]);

  const adminCount = useMemo(
    () => users.filter((user) => user.role === "admin").length,
    [users]
  );

  const activeCount = useMemo(
    () => users.filter((user) => user.is_active).length,
    [users]
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Users</h2>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Users</h2>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Users</h2>
        <p className={styles.empty}>No users found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>User Directory</h2>
          <p className={styles.subtitle}>Browse accounts, roles, and profile status.</p>
        </div>

        <div className={styles.searchGroup}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search users"
          />
        </div>
      </header>

      <div className={styles.metricsRow}>
        <span className={styles.metricChip}>Total: {users.length}</span>
        <span className={styles.metricChip}>Admins: {adminCount}</span>
        <span className={styles.metricChip}>Active: {activeCount}</span>
      </div>

      <section className={styles.listSection}>
        {filteredUsers.length === 0 ? (
          <p className={styles.empty}>No users match your search.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Age</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          user.role === "admin" ? styles.admin : styles.user
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          user.is_active ? styles.active : styles.inactive
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{user.profile?.height_cm ?? "-"}</td>
                    <td>{user.profile?.weight_kg ?? "-"}</td>
                    <td>{user.profile?.age ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}