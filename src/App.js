import React from "react"
import Die from "./componenet/Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import AppCss from "../src/App.css"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [startTime , setStartTime] = React.useState(new Date())
    const [endTime,setEndTime] = React.useState()
    const [duration,setDuration] = React.useState([])
    const [bestTime,setBestTime] = React.useState()

    React.useEffect(() => {
        
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            const shorTestTime = Math.min(...JSON.parse(localStorage.getItem("duration")))
            setBestTime("Here is Best Time ("+minsSec(shorTestTime).min + " : " + minsSec(shorTestTime).sec+")")

            setTenzies(true)
            getMins(startTime)
        }
    }, [dice])
    function getMins(startTime){
        const elapsed = new Date() - startTime;
        duration.push(elapsed)
        localStorage.setItem("duration",JSON.stringify(duration))
        setEndTime("Duration ("+minsSec(elapsed).min + " : " + minsSec(elapsed).sec+")")
    }
    function minsSec(elapsed){
        return {
            min:Math.floor((elapsed / 1000 / 60) << 0),
            sec:Math.floor((elapsed / 1000) % 60)
        }
    }
    function generateNewDice() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDice())
        }
        return newDice;
    }
    function rollDice() {
        if (!tenzies) {
            setDice(oldDice =>
                oldDice.map(die => {
                    return die.isHeld ?
                        die :
                        generateNewDice()
                })
            )
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setEndTime()
            setStartTime(new Date())
            setBestTime()
        }
    }

    const newDice = dice.map((num, i) => {
        return (
            <Die
                key={num.id}
                id={num.id}
                value={num.value}
                isHeld={num.isHeld}
                hendleClick={holdDice}
            />
        )
    })
    function holdDice(id) {
        setDice(prev => prev.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }))

    }
    return (
        <main>
            {tenzies && <Confetti />}
            <h1> {bestTime}</h1>
            <h1 className="title">Tenzies {endTime}</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {newDice}

            </div>
            {/* <button
                className="roll-dice"
                onClick={rollDice}>
                {
                    tenzies ?
                        "Start New Game"
                        :
                        "Roll"
                }
            </button> */}

            <div className={tenzies ? "roll-dice" : "fourth-face dice"} onClick={rollDice}>
                {
                    (tenzies) ?
                        ("Start New Game")
                        :
                        <div>
                            <div className="column">
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div><div className="column">
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div><div className="column">
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                }
            </div>
        </main>
    )
}