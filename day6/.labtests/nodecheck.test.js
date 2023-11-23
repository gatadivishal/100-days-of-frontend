const fs = require('fs');
const puppeteer = require('puppeteer');

async function run() {
    const results = [];
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
    });
    page = await browser.newPage();
    await page.goto('http://localhost:1337');
    await Promise.all([
        page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        }),
        page.addScriptTag({
            url: 'https://cdnjs.cloudflare.com/ajax/libs/chai/4.2.0/chai.min.js',
        }),
    ]);

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            const elem = document.getElementById('mytext');
            assert(elem.type === 'text');
            assert(elem.placeholder === 'Type some text');
        });
        results.push(true);
    } catch (error) {
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            const elem = document.getElementById('myemail');
            assert(elem.type === 'email');
            assert(elem.placeholder === 'Type your email');
        });
        results.push(true);
    } catch (error) {
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            const elem = document.getElementById('mypassword');
            assert(elem.type === 'password');
            assert(elem.placeholder === 'Type your password');
        });
        results.push(true);
    } catch (error) {
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            const elem = document.getElementById('mysubmit');
            assert(elem.type === 'submit');
            assert(elem.value === 'Submit');
        });
        results.push(true);
    } catch (error) {
        results.push(false);
    }

    fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results));
    await browser.close().catch((err) => {});
    process.exit(0);
}
run();