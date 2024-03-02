const puppeteer = require('puppeteer');

async function scrapeFinancialNews() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
        // Function to navigate to a page with error handling
        const safeGoto = async (page, url, options) => {
            try {
                await page.goto(url, options);
            } catch (error) {
                console.error('Error navigating to page:', error);
            }
        };

        // Function to scrape financial news data
        const scrapeData = async () => {
            // Go to the website
            await safeGoto(page, 'https://www.bloomberght.com/', { waitUntil: 'domcontentloaded', timeout: 0 });
            
            // Wait for the latest news section to load
            await page.waitForSelector('.widget-latest-news', { timeout: 0 });
            
            // Extract links of the highlighted articles
            const articleLinks = await page.evaluate(() => {
                const links = [];
                const articleElements = document.querySelectorAll('.widget-latest-news a');
                articleElements.forEach(article => {
                    links.push(article.href);
                });
                return links;
            });

            console.log("%c📰 News Scraping Started", "color: #4CAF50; font-size: 18px; font-weight: bold;");

            // Print the extracted article links in a column
            console.log('Article Links:');
            articleLinks.forEach((link, index) => {
                console.log(`  ${index + 1}. ${link}`);
            });

            // Iterate over each article link
            for (const link of articleLinks) {
                // Navigate to the news article page
                await safeGoto(page, link, { waitUntil: 'domcontentloaded', timeout: 0 });

                // Wait for the article page to load
                await page.waitForSelector('.featured.type4', { timeout: 0 });

                // Check if the element is found
                const isElementFound = await page.evaluate(() => {
                    return document.querySelector('.featured.type4') !== null;
                });

                if (isElementFound) {
                    console.log("Article page loaded successfully.");
                } else {
                    console.log("Article page could not be loaded.");
                }

                // Extract the title, subtitle, and image URL
                const articleData = await page.evaluate(() => {
                    const titleElement = document.querySelector('.featured.type4 h1');
                    const subtitleElement = document.querySelector('.featured.type4 h2');
                    const imageElement = document.querySelector('.featured.type4 img');
                    
                    const title = titleElement ? titleElement.innerText : '';
                    const subtitle = subtitleElement ? subtitleElement.innerText : '';
                    const imageUrl = imageElement ? imageElement.getAttribute('src') : '';

                    return { title, subtitle, imageUrl };
                });

                // Print the scraped data in a table-like structure
                console.log('\nArticle Information:');
                console.log('-----------------------------------------');
                console.log(`Title:    ${articleData.title}`);
                console.log(`Subtitle: ${articleData.subtitle}`);
                console.log(`Image URL:${articleData.imageUrl}`);
                console.log('-----------------------------------------');
            }
        };

        // Scrape initially
        await scrapeData();

        // Set up a function to scrape when the news section gets updated
        await page.waitForFunction(() => {
            const newsSection = document.querySelector('.widget-latest-news');
            const observer = new MutationObserver(() => {
                clearInterval(scrapeInterval);
                scrapeData();
            });
            observer.observe(newsSection, { childList: true });
            const scrapeInterval = setInterval(() => {
                scrapeData();
            }, 10 * 60 * 1000);
        });

    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        // Close the browser after scraping
        await browser.close();
    }
}

// Run the scraping function
scrapeFinancialNews();
