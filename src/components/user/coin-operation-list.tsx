import type { CoinOperation } from "@/data/coin-operations";
import styles from "./coins-screen.module.css";

type CoinOperationListProps = {
  operations: CoinOperation[];
};

export function CoinOperationList({ operations }: CoinOperationListProps) {
  return (
    <div className={styles.operationList}>
      {operations.map((operation) => {
        const isIncome = operation.amount > 0;

        return (
          <div key={operation.id} className={styles.operationRow}>
            <span
              className={`${styles.operationIcon} ${isIncome ? styles.operationIncomeIcon : styles.operationExpenseIcon}`}
              aria-hidden
            >
              {operation.emoji}
            </span>
            <div className={styles.operationCopy}>
              <strong>{operation.title}</strong>
              <span>{operation.date}</span>
            </div>
            <b className={isIncome ? styles.income : styles.expense}>
              {isIncome ? "+" : "−"}
              {Math.abs(operation.amount)} 🪙
            </b>
          </div>
        );
      })}
    </div>
  );
}
