const calc = document.querySelector('.calc')
const calcBtns = calc.querySelector('.calcBtns')
const calcDisplay = calc.querySelector('.calcDisplay')
const clear = document.getElementById('clear')

calcBtns.addEventListener('click', function (e) {
    if (e.target.matches('button')) {
        const btn = e.target
        const action = btn.dataset.action
        const btnText = btn.innerText
        const currentDisplay = calcDisplay.innerText
        const allBtns = calcBtns.querySelectorAll('.calcBtns *')

        // Number or Bracket Pressed
        if (!action) {
            if (currentDisplay === "0") {
                calcDisplay.innerText = btnText
            } else {
                calcDisplay.innerText = currentDisplay + btnText
            }
        }
        // Operator Pressed
        if (action === "add" || action === "multiply" || action === "divide") {
            if (currentDisplay.endsWith("+") || currentDisplay.endsWith("-") ||
                currentDisplay.endsWith("×") || currentDisplay.endsWith("÷")) {
                calcDisplay.innerText = currentDisplay.slice(0, -1) + btnText
            } else {
                calcDisplay.innerText = currentDisplay + btnText
            }
        }
        if (action === "subtract") {
            if (currentDisplay === "0") {
                calcDisplay.innerText = btnText
            } else if (currentDisplay.endsWith("+") || currentDisplay.endsWith("-")) {
                calcDisplay.innerText = currentDisplay.slice(0, -1) + btnText
            } else {
                calcDisplay.innerText = currentDisplay + btnText
            }
        }
        // Decimal Pressed
        if (action === "decimal") {
            if (!currentDisplay.includes(".")) {
                calcDisplay.innerText = currentDisplay + btnText
            } else {
                let lastDecimal = currentDisplay.lastIndexOf(".")
                if (lastDecimal < currentDisplay.lastIndexOf("+") || lastDecimal < currentDisplay.lastIndexOf("-") ||
                    lastDecimal < currentDisplay.lastIndexOf("×") || lastDecimal < currentDisplay.lastIndexOf("÷")) {
                    calcDisplay.innerText = currentDisplay + btnText
                }
            }
        }
        // Clear Pressed
        if (action === "clear") {
            calcDisplay.innerText = "0"
            //Reenables buttons
            allBtns.forEach((el) => {
                el.classList.remove('disabled')
            })
        }
        // Delete Pressed
        if (action === "delete") {
            if (currentDisplay.length === 1) {
                calcDisplay.innerText = "0"
            } else {
                calcDisplay.innerText = currentDisplay.slice(0, -1)
            }
        }
        // Equal Pressed
        if (action === "equal") {
            // Converting display to readable equation
            let equation = currentDisplay.replace(/×/g, "*").replace(/÷/g, "/")
            equation = insertLeft(equation)
            if (equation.startsWith("*")) {
                equation = equation.slice(1, equation.length)
            }
            // Answers upto 12 decimal places
            let answer = Function("return " + equation)().toFixed(12)
            // Deletes trailing zeros
            if (answer.includes(".")) {
                while (answer.slice(-1) === "0") {
                    answer = answer.slice(0, -1)
                }
                if (answer.endsWith(".")) {
                    answer = answer.slice(0, -1)
                }
            }
            // Disables buttons due to dividing by 0
            if (answer === "NaN") {
                allBtns.forEach(function (el) {
                    el.classList.add('disabled')
                })
                clear.classList.remove('disabled')
            }
            calcDisplay.innerText = answer
        }
    }
})

function insertLeft(str) {
    if (str.includes("(")) {
        let leftBrIndex = str.lastIndexOf("(")
        if (str.charAt(leftBrIndex - 1) !== "+" && str.charAt(leftBrIndex - 1) !== "-" &&
            str.charAt(leftBrIndex - 1) !== "*" && str.charAt(leftBrIndex - 1) !== "/") {
            return insertLeft(str.slice(0, leftBrIndex)) + "*" + str.slice(leftBrIndex)
        } else {
            return insertLeft(str.slice(0, leftBrIndex)) + str.slice(leftBrIndex)
        }
    } else { return str }
}