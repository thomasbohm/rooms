const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let classData = [];
let lastUploaded = "-/-";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("upload", {
    lastUploaded: lastUploaded
  });
});

app.get("/dashboard", function(req, res) {
  const now = new Date();
  const lowerBounds = new Date(now - 15 * 60000); // minus 15 minutes
  //const upperBounds = new Date(now.getTime() + 15 * 60000);

  let upcoming = [];
  for(let i=0; i<classData.length;i++){
    const time = classData[i].time;
    let d = new Date();
    d.setHours(time.split(":")[0]);
    d.setMinutes(time.split(":")[1]);

    if (lowerBounds<d) {
      upcoming.push(classData[i]);
    }
  }

  let sum = 0;
  upcoming.forEach(x=>sum+=x.classes.length);
  //console.log("upcoming ("+sum+"): " +upcoming);

  if (upcoming.length===0) {
    res.render("empty");
  } else {
    let displayed = [upcoming[0]];

    if(upcoming.length>1 && (upcoming[0].classes.length + upcoming[1].classes.length) <= 10 ){
      displayed.push(upcoming[1]);
    }
    if(upcoming.length>2
      && (upcoming[0].classes.length + upcoming[1].classes.length + upcoming[2].classes.length) <= 7 ){
      displayed.push(upcoming[2]);
    }
    if(upcoming.length>3
      && (upcoming[0].classes.length + upcoming[1].classes.length + upcoming[2].classes.length + upcoming[3].classes.length) <= 4 ){
      displayed.push(upcoming[3]);
    }

    res.render("dashboard", {
      data: displayed
    });
  }
});

app.get("/all", function(req, res) {
  res.render("all", {
    data: classData,
    lastUploaded: lastUploaded
  });
});

app.post("/all", function(req, res) {
  classData = JSON.parse(req.body.data);
  lastUploaded = req.body.date;
  console.log("CSV file successfully uploaded.");

  res.redirect("/all");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
