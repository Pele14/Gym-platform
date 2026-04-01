import { RegisterForm } from "../features/auth"
import styles from "./pages.module.css"

export default function RegisterPage() {
  return (
    <div className={styles.publicAuthShell}>
      <RegisterForm />
    </div>
  )
}