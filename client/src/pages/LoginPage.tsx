import { LoginForm } from '../features/auth'
import styles from './pages.module.css'

export default function LoginPage() {
  return (
    <div className={styles.publicAuthShell}>
      <LoginForm />
    </div>
  )
}