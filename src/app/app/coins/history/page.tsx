import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CoinOperationList } from "@/components/user/coin-operation-list";
import { coinOperations, type CoinOperationGroup } from "@/data/coin-operations";
import { routes } from "@/lib/routes";
import styles from "@/components/user/coins-screen.module.css";

const groups: CoinOperationGroup[] = ["Сегодня", "Вчера", "Ранее"];

export default function CoinsHistoryPage() {
  return (
    <main className={styles.historyPage}>
      <header className={styles.historyHeader}>
        <Link
          href={routes.user.coins}
          className={styles.backButton}
          aria-label="Вернуться к балансу"
        >
          <ArrowLeft aria-hidden size={19} />
        </Link>
        <div>
          <span>Баллы</span>
          <h1>История операций</h1>
        </div>
      </header>

      <div className={styles.historyGroups}>
        {groups.map((group) => {
          const operations = coinOperations.filter((operation) => operation.group === group);

          return (
            <section key={group} className={styles.historyGroup}>
              <h2>{group}</h2>
              <div className={styles.operationPanel}>
                <CoinOperationList operations={operations} />
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
