import Head from 'next/head'
import Calendar from '../components/calendar'
import ShoppingListGenerator from '../components/shoppingListGenerator'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { query } = useRouter()
  const { date } = query

  let d = new Date(date)
  if (isNaN(d.getFullYear()))
    d = new Date()
  
  const [calendarState, setCalendarState] = useState({
    month: d.getMonth(),
    year: d.getFullYear(),
  })
  const [activeTab, setActiveTab] = useState('calendar') // 'calendar', 'shopping-list-generator', 'shopping-list'
  const [calendarMeals, setCalendarMeals] = useState([])

  const handleNextMonthClick = () => {
    if(calendarState.month != 11)
      setCalendarState({
        month: calendarState.month + 1,
        year: calendarState.year
      })
    else {
      setCalendarState({
        month: 0,
        year: calendarState.year + 1
      })
    }
  }

  const handlePrevMonthClick = () => {
    if(calendarState.month != 0)
      setCalendarState({
        month: calendarState.month - 1,
        year: calendarState.year
      })
    else {
      setCalendarState({
        month: 11,
        year: calendarState.year - 1
      })
    }
  }

  const handleCreateListClick = async (meals) => {
    setCalendarMeals(meals)
    setActiveTab('shopping-list-generator')
  }

  return (
    <div className="container">
      <Head>
        <title>Meal Planner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <header>
        
        <h1 className="title">
          Meal Planner
        </h1>
        <div className="navigation">
          <span onClick={() => setActiveTab('calendar')}>Calendar</span>
          <span onClick={() => setActiveTab('shopping-lists')}>Shopping Lists</span>
        </div>
      </header>
      
      <main>
       
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div></div>
          { activeTab === 'calendar'
          && <Calendar 
          month={calendarState.month}
          year={calendarState.year}
          handleNextMonthClick={handleNextMonthClick}
          handlePrevMonthClick={handlePrevMonthClick}
          handleCreateListClick={handleCreateListClick}
          />}

          { activeTab === 'shopping-list-generator'
          && <ShoppingListGenerator meals={calendarMeals}/>}
          <div></div>
        </div>

      </main>

      <footer>

      </footer>

      <style jsx>{`


        main {
          width: 100%;
          padding-bottom: 5rem;
          padding-top: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .navigation {
          display: flex;
          justify-content: space-evenly;
          margin-top: 1em;
        }

        .navigation span {
          border-width: 2px;
          border-radius: 5px;
          border-style: outset;
          padding: .2em;
          margin: .1em;
        }

        .navigation span:active {
          border-style: inset;
        }

        @media(max-width: 1400px) {
          main {
            align-items: start;
          }
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}