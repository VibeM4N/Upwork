const puppeteer = require("puppeteer");

async function scrapeYahooFinanceArticles() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Function to scrape and log articles
    const scrapeAndLogArticles = async () => {
      try {
        await page.setDefaultNavigationTimeout(60000); // 60 seconds timeout
        await page.goto("https://finance.yahoo.com/topic/economic-news/");
        await page.waitForSelector("li.js-stream-content a.js-content-viewer");

        const articleLinks = await page.evaluate(() => {
          const links = [];
          const articleElements = document.querySelectorAll(
            "li.js-stream-content a.js-content-viewer"
          );
          articleElements.forEach((article) => {
            links.push(article.href);
          });
          return links;
        });

        console.log(
          "%c📰 News Scraping Started",
          "color: #4CAF50; font-size: 18px; font-weight: bold;"
        );
        console.log("Article Links:");
        articleLinks.forEach((link, index) => {
          console.log(`${index + 1}. ${link}`);
        });

        // Iterate over each article link
        for (const link of articleLinks) {
          await page.goto(link);
          await page.waitForSelector("h1");

          // Extract title
          const title = await page.$eval(
            "h1",
            (element) => element.textContent
          );

          // Extract main article content
          const mainContent = await page.$eval(
            "div.caas-body",
            (element) => element.textContent
          );

          // Extract image URL
          const imageUrl = await page.$eval("img.caas-img", (img) => img.src);

          console.log("\nArticle Information:");
          console.log("-----------------------------------------");
          console.log(`Title: ${title}`);
          console.log(`Image URL: ${imageUrl}`);
          console.log("Content:");
          console.log(mainContent.trim());
          console.log("-----------------------------------------");
        }
      } catch (error) {
        console.error("Error scraping articles:", error);
      }
    };

    // Run initially
    await scrapeAndLogArticles();

    // Set up a function to run every 10 minutes
    setInterval(async () => {
      await scrapeAndLogArticles();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Set up a function to run when the page reloads
    page.on("load", async () => {
      console.log("Page reloaded, scraping updated articles...");
      await scrapeAndLogArticles();
    });
  } catch (error) {
    console.error("Error launching browser:", error);
  } finally {
    await browser.close();
  }
}

scrapeYahooFinanceArticles();
