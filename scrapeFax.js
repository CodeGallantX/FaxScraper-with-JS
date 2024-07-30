const puppeteer = require('puppeteer');
const fs = require('fs');
const urls = require('./urls');

// Regular expression to find fax numbers in various formats
const faxPatterns = /(fax|f\.?|fx|fax number|fax:|f:|fx:|📠)[\s:]*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/gi;

// List of keywords for potential contact pages
const contactKeywords = [
    'contact', 'contact-us', 'contactus', 'support', 'customer-support', 
    'help', 'help-center', 'contact-support', 'get-in-touch', 
    'connect', 'contact-info'
];

async function scrapeFaxNumbers() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let allFaxData = [];
    let openingErrors = [];

    for (let url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Check the main page for fax numbers
            let content = await page.content();
            let faxNumbers = [...content.matchAll(faxPatterns)];
            let foundFaxNumbers = faxNumbers.map(f => f[0]);

            // Check for contact pages if no fax number found on main page
            if (foundFaxNumbers.length === 0) {
                let contactLinks = await page.evaluate((keywords) => {
                    return Array.from(document.querySelectorAll('a'))
                        .map(a => a.href)
                        .filter(href => href && keywords.some(keyword => href.toLowerCase().includes(keyword)));
                }, contactKeywords);

                for (let contactLink of contactLinks) {
                    await page.goto(contactLink, { waitUntil: 'networkidle2' });
                    content = await page.content();
                    faxNumbers = [...content.matchAll(faxPatterns)];
                    foundFaxNumbers = faxNumbers.map(f => f[0]);
                    if (foundFaxNumbers.length > 0) {
                        allFaxData.push({ url: contactLink, faxNumbers: foundFaxNumbers });
                        break; // Stop looking further if fax number is found
                    }
                }
            } else {
                allFaxData.push({ url, faxNumbers: foundFaxNumbers });
            }
        } catch (error) {
            console.error(`Error processing ${url}: `, error);
            openingErrors.push({ url, error: error.message });
        }
    }

    await browser.close();
    if (allFaxData.length > 0) {
        saveToFile(allFaxData, 'fax_numbers.txt');
    }
    if (openingErrors.length > 0) {
        saveErrorsToFile(openingErrors, 'opening_errors.txt');
    }
}

function saveToFile(data, filename) {
    const fileStream = fs.createWriteStream(filename);
    data.forEach(entry => {
        entry.faxNumbers.forEach(fax => {
            fileStream.write(`URL: ${entry.url}, Fax: ${fax}\n`);
        });
    });
    fileStream.end();
}

function saveErrorsToFile(errors, filename) {
    const fileStream = fs.createWriteStream(filename);
    errors.forEach(entry => {
        fileStream.write(`URL: ${entry.url}, Error: ${entry.error}\n`);
    });
    fileStream.end();
}

scrapeFaxNumbers();
