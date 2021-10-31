import styles from './Cell.module.css'
import Link from 'next/link'

export default function Cell({date, month, year, meals, onSelectMeals, onDeselectMeals}) {
    const now = new Date()
    const isToday = now.getDate() === date && now.getMonth() === month && now.getFullYear() === year
        && now.getMonth() === month
        && now.getFullYear() === year

    const classList = isToday
        ? `${styles.cell} ${styles.today}`
        : styles.cell
    
    return <td className={styles.td}>
        { 
            date 
                ? <div className={classList}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onInput={(e) => {
                                if (e.target.checked)
                                    onSelectMeals(meals)
                                else
                                    onDeselectMeals(meals)
                            }
                        }/>
                        <p>{date}
                            {
                                isToday
                                && <span> (Today)</span>
                            }
                        </p>
                    </div>
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
                <Link  href={`/add-meal/${encodeURIComponent(new Date(year, month, date))}`}>Add/Edit Meals</Link>
                </div>
        </div>
            : <div className={styles.cell}></div>}

    </td>
}