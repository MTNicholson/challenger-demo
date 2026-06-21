import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./auth.module.css";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  label: string;
  error?: boolean;
};

export function AuthInput({ icon, label, error = false, ...props }: AuthInputProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.inputWrap} ${error ? styles.inputError : ""}`}>
        <span className={styles.inputIcon}>{icon}</span>
        <input className={styles.input} aria-invalid={error} {...props} />
      </span>
    </label>
  );
}
