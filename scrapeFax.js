const puppeteer = require('puppeteer');
const fs = require('fs');

// List of URLs to check
const urls = [
    'https://www.clarkedistributing.com',
    'https://www.eptingdist.com',
    'https://www.climaticcorp.com',
    'https://www.coastalhvacsupply.com',
    'https://www.solarsupplyusa.com',
    'https://www.galarson.com',
    'https://www.dennissupply.com',
    'https://www.edssupply.com',
    'https://www.mboroappliancerepair.com',
    'https://www.ecmdi.com',
    'https://www.weathertech.net',
    'https://www.chcs-ut.com',
    'https://www.mtncom.net',
    'https://midatlantic.carrierenterprise.com',
    'https://www.lyonconklin.com',
    'https://www.updinc.com',
    'https://www.charlottesvillenoland.com',
    'https://www.wittichen-supply.com',
    'https://www.solarsupply.us',
    'https://www.airstarsupply.com',
    'https://www.allapplianceparts.net',
    'https://www.arcosupply.com',
    'https://www.carrierenterprise.com',
    'https://www.centralacsupplyfl.com',
    'https://eemotors.hypersites.com',
    'https://www.gulfatlanticequipment.com',
    'https://www.hvacsupplyinc.com',
    'https://www.lennoxpros.com',
    'https://www.nflhvac.com',
    'https://www.oldachusa.com',
    'https://www.protectowers.com',
    'https://www.silversheetsupplies.com',
    'https://www.tampabaytrane.com',
    'https://www.tranesupply.com',
    'https://www.acwarehousehawaii.com',
    'https://www.coscohawaii.com',
    'https://www.leblancandassociates.com',
    'https://company.ingersollrand.com',
    'https://www.ac-parts.net',
    'https://www.bradyservices.com',
    'https://www.ctcsupply.com',
    'https://www.ihriesupply.com',
    'https://www.insightusa.com',
    'https://www.climaticcomfortproducts.com',
    'https://www.creggercompany.com',
    'https://www.kru-kel.com',
    'https://www.mccallsinc.com',
    'https://www.coastalsupplycotn.com',
    'https://www.acessupply.com',
    'https://www.insco.com',
    'https://www.ecoer.com',
    'https://www.seshvac.com',
    'https://www.virginiaair.com',
    'https://www.york.com',
    'https://www.fletchersupply.com',
    'https://www.arnold-brown.com',
    'https://www.conklinmetal.com',
    'https://www.hughessupplydothan.com',
    'https://www.fjevans.net',
    'https://www.airtechal.com',
    'https://www.lanico-inc.com',
    'https://www.behler-young.com',
    'https://www.benoist.com'
];

// Regular expression to find fax numbers in various formats
const faxPatterns = /(fax|f\.?|fx|fax number|fax:|f:|fx:|📠)[\s:]*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/gi;

// List of keywords for potential contact pages
const contactKeywords = [
    'contact', 'contact-us', 'contactus', 'support', 'customer-support', 
    'help', 'help-center', 'contact-support', 'get-in-touch', 
    'connect', 'contact-info'
];

async function scrapeFaxNumbers() {
    const browser = await puppeteer.launch();
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
