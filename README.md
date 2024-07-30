# Fax Number Scraper

This repository contains a Node.js script that uses Puppeteer to scrape fax numbers from a list of URLs. The script searches for fax numbers on both the main page and potential contact pages, saving any found numbers to a file and logging errors encountered during the process.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.
_Follow these steps to install Node.js on your machine:_

#### Windows

1. **Download the Installer:**
   - Go to the [Node.js download page](https://nodejs.org/).
   - Click on the "Windows Installer" button to download the latest stable version of Node.js.

2. **Run the Installer:**
   - Open the downloaded `.msi` file.
   - Follow the prompts in the Node.js Setup Wizard. Accept the license agreement and choose the installation options as needed.

3. **Verify the Installation:**
   - Open a command prompt and run the following commands to verify that Node.js and npm (Node Package Manager) are installed:
     ```bash
     node -v
     npm -v
     ```
   - You should see version numbers for both Node.js and npm.


### Installation

1. **Fork or Clone the Repository**

   Fork this repository to your GitHub account or clone it to your local machine:

   ```bash
   git clone https://github.com/your-username/fax-number-scraper.git
   cd fax-number-scraper
   ```

2. **Install Dependencies**

   Install the required dependencies by running:

   ```bash
   npm install puppeteer fs
   ```

3. **Configure URLs**

   Update the `urls` array in `scrapeFaxNumbers.js` with the list of URLs you want to scrape.

4. **Run the Script**

   Execute the script by running:

   ```bash
   node scrapeFaxNumbers.js
   ```

## Functionality

The script performs the following tasks:

1. Launches a Puppeteer browser instance.
2. Iterates through a list of URLs to check for fax numbers.
3. Uses a regular expression to find fax numbers on the main page of each URL.
4. If no fax number is found on the main page, it searches potential contact pages for fax numbers.
5. Saves the found fax numbers to `fax_numbers.txt`.
6. Logs any URLs that encountered errors during processing to `opening_errors.txt`.

## Notes

- Adjust the `faxPatterns` regular expression if you need to match different fax number formats.
- Add more keywords to the `contactKeywords` array to broaden the search for contact pages.

## Checking Results

- The found fax numbers will be saved in `fax_numbers.txt`.
- Any URLs that encountered errors will be logged in `opening_errors.txt`.

This script provides a straightforward way to scrape fax numbers from websites, ensuring you log useful data and any errors encountered during the process.

****
> Happy Coding 👍