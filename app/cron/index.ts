import { schedule } from "node-cron";
import { fetchAndStoreRssFeeds } from "~/repositories/rssSourceRepository.server";

const fetchRss = schedule("*/2 * * * *", async () => {
  console.log('Run cron!')

  try {
    await fetchAndStoreRssFeeds();
  } catch (err) {
    console.log('Error in crone: ', err);
  }
});

fetchRss.start();