const express = require("express");
const compression = require('compression')
const fetchUrl = require("fetch").fetchUrl;
const Papa = require('papaparse');
const utils = require(__dirname + '/utils.js');

const app = express();

app.set("view engine", "ejs");

app.use(compression()); // improves performance
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const DEBUG_DATE = '2020-11-05';
const DEBUG_HOUR = 10 + 1; // +2 for local time
const DEBUG_ENABLED = false;

app.get("/", function(req, res) {
  let now = new Date();
  if (DEBUG_ENABLED) {
    now = new Date(DEBUG_DATE);
    now.setHours(DEBUG_HOUR);
    console.log(now);
  }
  const fromDate = { day: now.getDay(), month: now.getMonth() + 1, year: now.getFullYear() }; // {day: 2, month: 4, year: 2020};
  const toDate = fromDate;
  const url = `http://sprachschule-aktiv-muenchen.com/mrbs/web/report.php?from_day=${fromDate.day}&from_month=${fromDate.month}&from_year=${fromDate.year}&to_day=${toDate.day}&to_month=${toDate.month}&to_year=${toDate.year}&areamatch=M%C3%BCnchen&roommatch=&namematch=&descrmatch=&creatormatch=&match_confirmed=2&output=0&output_format=1&sortby=s&sumby=d&phase=2&datatable=1`;

  fetchUrl(url, function(error, meta, body) {
    let data = body.toString().split('\n');
    data = data.slice(1, data.length - 1).join('\n'); // remove header and empty last row

    Papa.parse(data, {
      complete: function(results) {
        const courseData = results.data.map(item => [item[0], item[2], item[3].slice(0, 5)]) // unparsed description, room, time hh:mm
        const allCourses = utils.parseCourses(courseData);
        let upcomingCourses = [];
        if (DEBUG_ENABLED) {
          upcomingCourses = utils.getUpcomingCourses(allCourses, DEBUG_DATE, DEBUG_HOUR);
        } else {
          upcomingCourses = utils.getUpcomingCourses(allCourses);
        }
        
        if (!upcomingCourses.length) {
          res.render("empty");
        } else {
          res.render("dashboard", { data: utils.getDisplayedCourses(upcomingCourses) });
        }
      }
    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
