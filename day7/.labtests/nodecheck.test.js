const fs = require('fs')
const puppeteer = require('puppeteer')

async function run() {
	// results is a boolean[] that maps challenge results shown to user
	const results = []

	// launch the headless browser for testing
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/google-chrome',
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--no-first-run',
			'--no-zygote',
			'--single-process',
			'--disable-gpu',
		],
	})
	page = await browser.newPage()

	// go to user source code page
	await page.goto('http://localhost:1337')

	// add jQuery and chai for unit testing support if you want
	await Promise.all([
		page.addScriptTag({
			url: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
		}),
		page.addScriptTag({
			url: 'https://cdnjs.cloudflare.com/ajax/libs/chai/4.2.0/chai.min.js',
		}),
	])

	// Start your tests here in individual try-catch block

	// Test 1
	try {
		await page.evaluate(async () => {
			const assert = window.chai.assert
			assert(document.querySelectorAll('#wrapper input[type=radio]').length === 3)
			assert(document.querySelectorAll('#wrapper label').length === 3)
		})
		results.push(true)
	} catch (error) {
		results.push(false)
	}

	// Test 2
	try {
		await page.evaluate(async () => {
			const assert = window.chai.assert
			const radioButtons = document.querySelectorAll('#wrapper input[type=radio]')
			assert(radioButtons[0].name === radioButtons[1].name)
            assert(radioButtons[0].name === radioButtons[2].name)
            assert(radioButtons[1].name === radioButtons[2].name)
		})
		results.push(true)
	} catch (error) {
		results.push(false)
	}

	// Test 3
	try {
		await page.evaluate(async () => {
			const assert = window.chai.assert
			assert(document.getElementById('option3').disabled === true)
		})
		results.push(true)
	} catch (error) {
		results.push(false)
	}

	// Test 4
	try {
		await page.evaluate(async () => {
			const assert = window.chai.assert
			assert(document.getElementById('option2').checked === true)
		})
		results.push(true)
	} catch (error) {
		results.push(false)
	}

	// Test 5
	try {
		await page.evaluate(async () => {
			const assert = window.chai.assert
			assert(document.getElementById('wrapper').tagName === 'DIV')
		})
		results.push(true)
	} catch (error) {
		results.push(false)
	}

	// Write the results to UNIT_TEST_OUTPUT_FILE variable
	fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
	await browser.close().catch((err) => {})

	// Exit the process
	process.exit(0)
}
run()