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
    const page = await browser.newPage()

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

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(document.getElementById('outer-div') !== null && document.getElementById('inner-para') !== null)
        })
        console.log('Test #1 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #1 failed! Try creating a div with the required ID and a paragraph inside it.')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(document.getElementById('highlight') !== null)
        })
        console.log('Test #2 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #2 failed! Try creating a span element with the required ID.')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            const div = document.getElementById('outer-div')
            assert(getComputedStyle(div).color === 'rgb(0, 0, 255)')
            assert(getComputedStyle(div).backgroundColor === 'rgb(211, 211, 211)')
        })
        console.log('Test #3 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #3 failed! Try using inline CSS to style the div element color.')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            const span = document.getElementById('highlight')
            assert(getComputedStyle(span).backgroundColor === 'rgb(255, 255, 0)')
        })
        console.log('Test #4 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #4 failed! Try using inline CSS to style the span element background color.')
        results.push(false)
    }

    // End your tests here
    fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
    await browser.close().catch((err) => {})

    // Exit the process
    process.exit(0)
}
run()
