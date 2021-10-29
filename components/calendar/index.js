import styles from './Calendar.module.css'
import Cell from './Cell'
import months from '../../lib/months'

const Row = ({ dates, month, year, meals }) => {
    return <tr>
        {dates.map((date, i) => {
           const mealsForThisDate = meals.filter(meal => {
               const d = new Date(meal.date)
               return d.getUTCDate() === date
               && d.getUTCMonth() === month
               && d.getUTCFullYear() === year
           })
           return <Cell month={month} year={year} date={date} key={i} meals={mealsForThisDate}/>
        })}
    </tr>
}

export default function Calendar({ meals = [], month, year, handleNextMonthClick, handlePrevMonthClick, setMeals }) {
    const now = new Date()

    if (!month && month !== 0) {
        // Set both month and year
        year = now.getFullYear()
        month = now.getMonth()
    }

    if (!year) {
        // Set only year
        year = now.getFullYear()
    }

    const d = new Date(year, month)

    const dates = []

    // Add empty values to the beginning of the calendar
    for (let i = 0; i < d.getDay(); i++) {
        dates.push(undefined)
    }

    // Add values for each real date in the month
    while (d.getMonth() == month) {
        dates.push(d.getDate())
        d.setDate(d.getDate() + 1)
    }

    // Add empty values to the end of the calendar
    if (d.getDay != 0) {
        for (let i = d.getDay() - 1; i === 0 || i % 6 > 0; i++) {
            dates.push(undefined)
        }
    }

    const rows = []

    while (dates.length) {
        rows.push(dates.splice(0, 7))
    }

    return (
        <div className={styles.calendarContainer}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button onClick={handlePrevMonthClick}>&lt;&lt;</button>
                <h3>{`${months[month]}, ${year}`}</h3>
                <button onClick={handleNextMonthClick}>&gt;&gt;</button>
                </div>
            <table>
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                   { rows.map((row, i) => <Row dates={row} meals={meals} month={month} year={year} key={i} />)}
                </tbody>
            </table>
        </div>
    )
}