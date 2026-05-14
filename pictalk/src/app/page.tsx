import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.backgroundMesh} />
      
      <div className={`glass ${styles.card}`}>
        <h1 className={styles.title}>Pictalk</h1>
        <p className={styles.subtitle}>Communication made easy with AAC</p>
        
        <div className={styles.buttonGroup}>
          <Link href="/communicate" className={`${styles.button} ${styles.primaryButton}`}>
            Try as Guest
          </Link>
          <Link href="/login" className={`${styles.button} ${styles.secondaryButton}`}>
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
