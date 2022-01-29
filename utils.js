const flagForLanguage = {
  deutsch: 'deutsch.png',
  englisch: 'englisch.png',
  spanisch: 'spanisch.png',
  albanisch: 'albanisch.png',
  arabisch: 'arabisch.png',
  bulgarisch: 'bulgarisch.png',
  chinesisch: 'chinesisch.png',
  dänisch: 'dänisch.png',
  estnisch: 'estnisch.png',
  französisch: 'französisch.png',
  georgisch: 'georgisch.png',
  griechisch: 'griechisch.png',
  hindi: 'hindi.png',
  italienisch: 'italienisch.png',
  japanisch: 'japanisch.png',
  koreanisch: 'koreanisch.png',
  kroatisch: 'kroatisch.png',
  niederländisch: 'niederländisch.png',
  persisch: 'persisch.png',
  portugiesisch: 'portugiesisch.png',
  polnisch: 'polnisch.png',
  rumänisch: 'rumänisch.png',
  russisch: 'russisch.png',
  schwedisch: 'schwedisch.png',
  serbisch: 'serbisch.png',
  slowakisch: 'slowakisch.png',
  thailändisch: 'thailändisch.png',
  tschechisch: 'tschechisch.png',
  türkisch: 'türkisch.png',
  ukrainisch: 'ukrainisch.png',
  ungarisch: 'ungarisch.png'
};

const types = {
  SIK: "Semi-intensiv",
  IK: "Intensiv",
  GK: "Gruppe",
  PK: "Privat",
  AK: "Abend"
};

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Parses the courses into the format { time: time, courses: [courses] }.
 * @param {*} data all courses with full description for the day.
 * @returns a list of courses per time slot.
 */
exports.parseCourses = function(data) {
  let times = data.flatMap(d => d[2]);
  times = Array.from(new Set(times)); // remove duplicates
  times.sort();

  const coursesPerTime = times.flatMap(t => [{
    time: t,
    classes: []
  }]);

  for (const course of data) {
    let description = course[0];
    const room = course[1];
    const time = course[2];

    description = description.replace("/","");  // remove these terms from the description
    description = description.replace(".1",""); // A1.1 -> A1
    description = description.replace(".2","");
    description = description.replace(".3","");
    description = description.replace(".4","");

    let flag = "";
    for (const l in flagForLanguage) {
      if (description.includes(l.charAt(0).toUpperCase() + l.slice(1))) {
        flag = flagForLanguage[l];
        break;
      }
    }

    let type = "";
    for (const t in types) {
      if (description.includes(t)) {
        type = types[t];
        description = description.replace(t+" ","");
        break;
      }
    }

    let level = "";
    for (const l of levels) {
      if (description.includes(l)) {
        level = l;
        description = description.replace(l,"");
        break;
      }
    }

    for (const timeSlot of coursesPerTime) {
      if (time === timeSlot.time) {
        timeSlot.classes.push([flag, description, level, type, room]);
        break;
      }
    }
  }
  return coursesPerTime;
};

/**
 * Returns a list of all upcoming courses.
 * @param {*} all The list of all courses for this day.
 * @param {string=} opt_debugDate If set, use this date.
 * @param {Array<number>=} opt_debugTime If set, use this hour.
 * @returns a list of all upcoming courses in format [ { time: time, courses: [courses] } ].
 */
exports.getUpcomingCourses = function(all, opt_debugDate, opt_debugTime) {
  const now = opt_debugDate ? new Date(opt_debugDate) : new Date();
  if (opt_debugDate && opt_debugTime) {
    now.setHours(opt_debugTime[0]);
    now.setMinutes(opt_debugTime[1]);
  }
  const lowerBounds = new Date(now - 15 * 60000); // minus 15 minutes
  //const upperBounds = new Date(now.getTime() + 15 * 60000);
  
  let upcoming = [];
  for (let i = 0; i < all.length; i++) {
    const time = all[i].time;
    let date = opt_debugDate ? new Date(opt_debugDate) : new Date();
    date.setHours(time.split(":")[0]);
    date.setMinutes(time.split(":")[1]);

    if (lowerBounds < date) {
      upcoming.push(all[i]);
    }
  }
  return upcoming;
};

/**
 * Returns a list of courses who fit onto the screen. If the next slot's courses fit onto the screen, include them as well.
 * @param {*} upcoming All courses who are still scheduled for the day. Sorted by time.
 * @returns A list of all courses who fit onto the screen.
 */
exports.getDisplayedCourses = function(upcoming) {
  let displayed = [upcoming[0]];

  if (upcoming.length > 1 && (upcoming[0].classes.length + upcoming[1].classes.length) <= 8 ) {
    displayed.push(upcoming[1]);
  
    if (upcoming.length > 2 && (upcoming[0].classes.length + upcoming[1].classes.length + upcoming[2].classes.length) <= 7 ) {
      displayed.push(upcoming[2]);
    
      if (upcoming.length > 3 && (upcoming[0].classes.length + upcoming[1].classes.length + upcoming[2].classes.length + upcoming[3].classes.length) <= 6 ) {
        displayed.push(upcoming[3]);
      }
    }
  }
  return displayed;
};
