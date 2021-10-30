import styles from './Calendar.module.css'
import Cell from './Cell'
import months from '../../lib/months'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const Row = ({ dates, month, year, meals = [] }) => {
    return <tr>
        {dates.map((date, i) => {
           const mealsForThisDate = meals.filter(meal => {
               const d = new Date(meal.date)
               return d.getUTCDate() === date
               && d.getUTCMonth() === month
               && d.getUTCFullYear() === year
           })
        //    console.log('mealsForThisDate', mealsForThisDate)
           return <Cell month={month} year={year} date={date} key={i} meals={mealsForThisDate}/>
        })}
    </tr>
}

const fetcher = (url) => fetch(url).then(res => res.json()).then(json => {console.log(json)
    return json})

const CalendarComponent = ({ month, year, rows, meals }) => (
    <div className={styles.calendarContainer}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div></div>
            <h3>{`${months[month]}, ${year}`}</h3>
            <div></div>
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

export default function Calendar({ month, year }) {
    const url = `/api/meals?min_date=${encodeURIComponent(new Date(year, month, 1, 0))}&max_date=${encodeURIComponent(new Date(year, month + 1, 1, 0))}`
    const {data, error} = useSWR(url, fetcher)
    console.log(data, error)

    if(error) console.error(error)
    
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

    if(error) 
        return <div>Error loading, try again.</div>
    if(!data)
        return <CalendarComponent rows={rows} month={month} year={year} meals={[]} />

    return <CalendarComponent rows={rows} month={month} year={year} meals={data} />
}