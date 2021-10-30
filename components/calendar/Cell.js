import styles from './Cell.module.css'
import Link from 'next/link'

export default function Cell({date, month, year, meals}) {
    const now = new Date()
    const isToday = now.getDate() === date
        && now.getMonth() === month
        && now.getFullYear() === year

    const classList = isToday
        ? `${styles.cell} ${styles.today}`
        : styles.cell
    
    return <td className={styles.td}>
        { 
            date 
                ? <div className={classList}>
                <p>{date}
                    {
                        isToday
                        && <span> (Today)</span>
                    }
                </p>
                { meals.length 
                  ? <div>
                      <span className={styles.tabLabel}>Meals</span>
                      <ul className={styles.mealList}>
                          {meals.map((meal, i) => <li key={i}>
                              <a href={meal.recipe.url} target="_blank">{meal.recipe.label}</a>
                          </li>)}
                      </ul>
                      </div>
                  : null }
                  <div className={styles.addEdit}>
                <Link  href={`/add-meal/${year}-${month + 1}-${date}`}>Add/Edit Meals</Link>
                </div>
        </div>
            : <div className={styles.cell}></div>}

    </td>
}