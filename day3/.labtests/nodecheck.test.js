// !! Boilerplate code starts
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

    // !! Boilerplate code ends

    // Start your tests here in individual try-catch block

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert
            const videoElem = document.getElementById('video')
            assert(videoElem !== null)
            assert(videoElem.nodeName === 'VIDEO')
            assert(videoElem.getAttribute('controls') !== null)
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
            const sourceElem = document.querySelector('#video > source')
            assert(sourceElem !== null)
            assert(sourceElem.getAttribute('src') === 'https://codedamn-website-assets.s3.us-east-1.amazonaws.com/uploads/09-2023/bunny.dX-WwYMq_tgzoYZfGjI-r.mp4')
            assert(sourceElem.getAttribute('type') === 'video/mp4')
        })
        console.log('Test #2 passed!')
        results.push(true)
    } catch (error) {
        console.log('Test #2 failed!')
        results.push(false)
    }

    // End your tests here
    fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
    await browser.close().catch((err) => {})

    // Exit the process
    process.exit(0)
}
run()
// !! Boilerplate code ends