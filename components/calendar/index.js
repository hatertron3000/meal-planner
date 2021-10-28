import styles from './Calendar.module.css'
import Cell from './Cell'
import months from '../../lib/months'

const Row = ({ dates, month, year }) => {
    return <tr>
        {dates.map((date, i) => (
           <Cell month={month} year={year} date={date} key={i} />
        ))}
    </tr>
}

export default function Calendar({ meals = [], month, year }) {

    const now = new Date()

    if (!month) {
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
    const trailingEmptyCellsCount = d.getDay % 6

    const rows = []

    while (dates.length) {
        rows.push(dates.splice(0, 7))
    }

    console.log(months[month], month)

    return (
        <div className={styles.calendarContainer}>
            <h3>{`${months[month]}, ${year}`}</h3>
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
                   { rows.map((row, i) => <Row dates={row} month={month} year={year} key={i} />)}
                </tbody>
            </table>
        </div>
    )
}