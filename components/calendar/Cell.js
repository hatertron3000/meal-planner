import styles from './Cell.module.css'
import Link from 'next/link'

export default function Cell({date, month, year, meals}) {
    return <td>
        { date 
            ? <div className={styles.cell}>
            <p>{date}</p>
            <Link href={`/add-meal/${year}-${month + 1}-${date}`}>+ Add Meal</Link>
        </div>
            : <div className={styles.cell}></div>}

    </td>
}