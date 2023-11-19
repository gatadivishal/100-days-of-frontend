const fs = require('fs')
const puppeteer = require('puppeteer')

async function run() {
    const results = []

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

    await page.goto('http://localhost:1337')

    await Promise.all([
        page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        }),
        page.addScriptTag({
            url: 'https://cdnjs.cloudflare.com/ajax/libs/chai/4.2.0/chai.min.js',
        }),
    ])

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(
                document.getElementsByName('viewport')[0].content === 'width=device-width, initial-scale=1.0'
            )
        })
        console.log('Test #1 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #1 failed!')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(
                document.getElementsByName('description')[0].content.length >= 5
            )
        })
        console.log('Test #2 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #2 failed!')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(
                document.querySelector('meta[http-equiv="Content-Type"]') !== null && document.querySelector('meta[http-equiv="Content-Type"]').content === 'text/html; charset=utf-8'
            )
        })
        console.log('Test #3 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #3 failed!')
        results.push(false)
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            assert(
                document.querySelector('meta[property="og:title"]') !== null && document.querySelector('meta[property="og:title"]').content.toLowerCase() === 'meta tags lab'
            )
        })
        console.log('Test #4 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #4 failed!')
        results.push(false)
    }

    fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
    await browser.close().catch((err) => {})

    process.exit(0)
}
run()