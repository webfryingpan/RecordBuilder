import { fetchData, saveRecord } from './service'
import type { Options } from './types'

const saveBtn = document.querySelector('.save-data') as HTMLButtonElement
const fetchBtn = document.querySelector('.fetch-data') as HTMLButtonElement
const statusCodeLabel = document.querySelector('.status-code span') as HTMLSpanElement

let timeout: Timer

const inspectorField = document.querySelector(`.property[name='inspector']`) as HTMLSelectElement
const productField = document.querySelector(`.property[name='board']`) as HTMLSelectElement
const problemTypeField = document.querySelector(
	`.property[name='problemType']`
) as HTMLSelectElement
const problemField = document.querySelector(`.property[name='problem']`) as HTMLSelectElement

const fillFields = (data: Options) => {
	clearFields()

	addOptions(inspectorField, data.inspectors)
	addOptions(problemField, data.problems)
	addOptions(problemTypeField, data.problemTypes)
	addOptions(productField, data.boards)
}

const clearFields = () => {
	const blank = '<option value="">None</option>'

	inspectorField.innerHTML = blank
	problemField.innerHTML = blank
	problemTypeField.innerHTML = blank
	productField.innerHTML = blank
}

const loadLocal = () => {
	const data = localStorage.getItem('data')
	if (data) fillFields(JSON.parse(data))
}

const addOptions = (field: HTMLSelectElement, values: string[]) => {
	values.forEach(value => {
		const newOption = document.createElement('option')
		newOption.innerHTML = value
		newOption.value = value
		field.appendChild(newOption)
	})
}

const updateStatusLabel = (status: number) => {
	statusCodeLabel.innerHTML = status.toString()
	statusCodeLabel.style.color = status == 201 || status == 200 ? 'green' : 'red'

	if (timeout) clearTimeout(timeout)

	timeout = setTimeout(() => {
		statusCodeLabel.innerHTML = ''
	}, 5000)
}

const handleSaveButton = async () => {
	await saveRecord({
		inspectorName: inspectorField.value,
		problemDescription: problemField.value,
		problemType: problemTypeField.value,
		boardId: productField.value,
	}).then(status => updateStatusLabel(status))
}

const handleFetchButton = async () => {
	const { data, status } = await fetchData()

	fillFields(data)
	updateStatusLabel(status)
}

export const setupEventListeners = () => {
	saveBtn?.addEventListener('click', handleSaveButton)
	fetchBtn?.addEventListener('click', handleFetchButton)
	document.addEventListener('DOMContentLoaded', loadLocal)
}
