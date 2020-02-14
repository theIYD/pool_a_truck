const cheerio = require("cheerio");
const axios = require("axios");

axios
  .get("https://www.commodityonline.com/commodity-trading-markets/maharashtra")
  .then(response => {
    // console.log(response.data);
    let links = [];
    const $ = cheerio.load(response.data);
    let marketsString = $("#warelist");
    // const marketsArray = marketsString.trim().split(" ");
    console.log(links);
  })
  .catch(err => console.log(err));
