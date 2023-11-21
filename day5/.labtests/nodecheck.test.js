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
            assert(document.getElementById('form'));
            assert(document.querySelector('form fieldset'));
        });
        console.log('Test #1 passed!');
        results.push(true);
    } catch (error) {
        console.log('Test #1 failed! Is your form and fieldset element setup correctly?');
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            assert(document.querySelector('fieldset legend'));
            assert(document.querySelector('fieldset legend').innerText.toLowerCase() === 'user information');
        });
        console.log('Test #2 passed!');
        results.push(true);
    } catch (error) {
        console.log('Test #2 failed! Have you added the legend element with text "User Information" inside the fieldset?');
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            assert(document.getElementById('username'));
            assert(document.querySelector("label[for='username']"));
            assert(document.querySelector("label[for='username']").innerText.toLowerCase() === 'username');
        });
        console.log('Test #3 passed!');
        results.push(true);
    } catch (error) {
        console.log('Test #3 failed! Have you created an input element with id "username" and a corresponding label with text "Username"?');
        results.push(false);
    }

    try {
        await page.evaluate(async () => {
            const assert = window.chai.assert;
            assert(document.getElementById('email'));
            assert(document.querySelector("label[for='email']"));
            assert(document.querySelector("label[for='email']").innerText.toLowerCase() === 'email');
        });
        console.log('Test #4 passed!');
        results.push(true);
    } catch (error) {
        console.log('Test #4 failed! Have you created an input element with id "email" and a corresponding label with text "Email"?');
        results.push(false);
    }

    fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results));
    await browser.close().catch((err) => {});

    process.exit(0);
}
run();