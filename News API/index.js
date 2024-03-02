const puppeteer = require("puppeteer");

async function scrapeFinancialNews() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Function to navigate to a page with error handling
    const safeGoto = async (page, url, options) => {
        try {
          const response = await page.goto(url, options);
          await response.ok(); // Ensure the response is successful
          await page.waitForNavigation({ waitUntil: "domcontentloaded" }); // Wait for navigation to complete
        } catch (error) {
          console.error("Error navigating to page:", error);
        }
      };
      

    // Function to scrape financial news data
    const scrapeData = async () => {
      // Go to the website
      await safeGoto(page, "https://www.bloomberght.com/", {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      // Wait for the latest news section to load
      await page.waitForSelector(".widget-latest-news", { timeout: 60000 }); // Increased timeout to 60 seconds

      // Extract links of the highlighted articles
      const articleLinks = await page.evaluate(() => {
        const links = [];
        const articleElements = document.querySelectorAll(".widget-latest-news a");
        articleElements.forEach((article) => {
          links.push(article.href);
        });
        return links;
      });

      console.log("%c📰 News Scraping Started", "color: #4CAF50; font-size: 18px; font-weight: bold;");

      // Print the extracted article links in a column
      console.log("Article Links:");
      articleLinks.forEach((link, index) => {
        console.log(`  ${index + 1}. ${link}`);
      });

      // Iterate over each article link
      for (const link of articleLinks) {
        // Navigate to the news article page
        await safeGoto(page, link, {
          waitUntil: "domcontentloaded",
          timeout: 0,
        });

        // Wait for the article page to load
        await page.waitForSelector(".featured.type4", { timeout: 60000 }); // Increased timeout to 60 seconds

        // Check if the element is found
        const isElementFound = await page.evaluate(() => {
          return document.querySelector(".featured.type4") !== null;
        });

        if (isElementFound) {
          console.log("Article page loaded successfully.");
        } else {
          console.log("Article page could not be loaded.");
        }

        // Extract the title and image URL
        const articleData = await page.evaluate(() => {
          const titleElement = document.querySelector(".featured.type4 h1");
          const imageElement = document.querySelector(".featured.type4 img");

          const title = titleElement ? titleElement.innerText : "";
          const imageUrl = imageElement ? imageElement.getAttribute("src") : "";

          return { title, imageUrl };
        });

        // Print the scraped data in a table-like structure
        console.log("\nArticle Information:");
        console.log("-----------------------------------------");
        console.log(`Title: ${articleData.title}`);
        console.log(`Image URL: ${articleData.imageUrl}`);

        // Extract the paragraphs from the article content
        const articleContent = await page.$$eval('article', (articles) => {
          const content = [];
          articles.forEach((article) => {
            const paragraphs = Array.from(article.querySelectorAll('p'));
            const articleText = paragraphs.map(p => p.textContent.trim()).join('\n');
            content.push(articleText);
          });
          return content;
        });

        // Print the paragraphs
        articleContent.forEach((articleText, index) => {
          if (articleText.trim() !== "") {
            console.log(`\nArticle Content:`);
            console.log(articleText.trim()); // Print the article content
          } else {
            console.log(`No content available for Article ${index + 1}.`);
          }
        });

        console.log("-----------------------------------------");
      }
    };

    // Scrape initially
    await scrapeData();

    // Set up a function to scrape periodically
    const scrapePeriodically = async () => {
      setInterval(scrapeData, 10 * 60 * 1000); // Scrape every 10 minutes
    };

    // Call the function to start scraping periodically
    await scrapePeriodically();

  } catch (error) {
    console.error("Error scraping data:", error);
  } finally {
    // Close the browser after scraping
    await browser.close();
  }
}

// Run the scraping function
scrapeFinancialNews();
