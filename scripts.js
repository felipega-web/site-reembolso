// form elements
const form = document.querySelector('form');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');
const amount = document.querySelector('#amount');

const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header p span');

amount.oninput = () => {
    let value = amount.value.replace(/[^0-9.]/g, '');

    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return value
}

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
})

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li')
        expenseItem.classList.add('expense')

        const expenseImage = document.createElement('img')
        expenseImage.src = `./img/${newExpense.category_id}.svg`
        expenseImage.alt = `Imagem de ${newExpense.category_name}`

        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')

        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.appendChild(expenseName)
        expenseInfo.appendChild(expenseCategory)

        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`

        const removeIcon = document.createElement('img')
        removeIcon.classList.add('remove-icon')
        removeIcon.src = './img/remove.svg'
        removeIcon.alt = 'Remover despesa'


        expenseItem.appendChild(expenseImage)
        expenseItem.appendChild(expenseInfo)
        expenseItem.appendChild(expenseAmount)
        expenseItem.appendChild(removeIcon)

        expenseList.appendChild(expenseItem)

        formClear()

        updateTotals()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

function updateTotals() {
    try {
        const item = expenseList.children

        expensesQuantity.textContent = `${item.length} despesa${item.length > 1 ? 's' : ''}`

        let total = 0

        for (let i = 0; i < item.length; i++) {
            const itemAmount = item[i].querySelector('.expense-amount')

            total += parseFloat(itemAmount.textContent.replace('.', '').replace('/[^,]/g', '').replace('R$', '').replace(',', '.'))

            if (isNaN(total)) {
                return alert("Ocorreu um erro ao atualizar os totais.")
            }
        }

        document.querySelector('aside header h2').innerHTML = `<small>R$</small>${formatCurrencyBRL(total).toUpperCase().replace('R$', '')}`

    } catch (error) {
        alert("Não foi possível atualizar os totais.")
        console.log(error)
    }
}

expenseList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-icon')) {
        expenseList.removeChild(event.target.parentElement)
        updateTotals()
    }
})

function formClear() {
    expense.value = ''
    category.value = ''
    amount.value = ''

    expense.focus()
}