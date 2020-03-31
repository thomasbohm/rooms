const languages = {
  deutsch: '🇩🇪',
  englisch: '🇬🇧',
  spanisch: '🇪🇸',
  albanisch: '🇦🇱',
  arabisch: '🇲🇦',
  bulgarisch: '🇧🇬',
  chinesisch: '🇨🇳',
  dänisch: '🇩🇰',
  estnisch: '🇪🇪',
  französisch: '🇫🇷',
  georgisch: '🇬🇪',
  griechisch: '🇬🇷',
  hindi: '🇮🇳',
  italienisch: '🇮🇹',
  japanisch: '🇯🇵',
  koreanisch: '🇰🇷',
  kroatisch: '🇭🇷',
  niederländisch: '🇳🇱',
  persisch: '🇮🇷',
  portugiesisch: '🇵🇹',
  polnisch: '🇵🇱',
  rumänisch: '🇹🇩',
  russisch: '🇷🇺',
  schwedisch: '🇸🇪',
  serbisch: '🇷🇸',
  slowakisch: '🇸🇰',
  thailändisch: '🇹🇭',
  tschechisch: '🇨🇿',
  türkisch: '🇹🇷',
  ukrainisch: '🇺🇦',
  ungarisch: '🇭🇺'
};
const types = {
  SIK: "Semi-intensiv",
  IK: "Intensiv",
  GK: "Gruppe",
  PK: "Privat"
};
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

function parseClasses(data) {
  let times = data.flatMap(d => d[2]);
  times = Array.from(new Set(times));
  times.sort();
  const classesPerTime = times.flatMap(t => [{
    time: t,
    classes: []
  }]);

  for (const d of data) {
    d[0] = d[0].replace("/","");
    d[0] = d[0].replace(".1","");
    d[0] = d[0].replace(".2","");
    d[0] = d[0].replace(".3","");
    d[0] = d[0].replace(".4","");

    let flag = "";
    for (const l in languages) {
      if (languages.hasOwnProperty(l) && d[0].includes(l.charAt(0).toUpperCase() + l.slice(1))) {
        flag = languages[l];
        break;
      }
    }
    let type = "";
    for (const t in types) {
      if (types.hasOwnProperty(t) && d[0].includes(t)) {
        type = types[t];
        d[0] = d[0].replace(t+" ","");
        break;
      }
    }
    let level = "";
    for (const l of levels) {
      if (d[0].includes(l)) {
        level = l;
        d[0] = d[0].replace(l,"");
        break;
      }
    }

    for (const f of classesPerTime) {
      if (d[2] === f.time) {
        f.classes.push([flag, d[0], level, type, d[1]]);
        break;
      }
    }
  }

  return classesPerTime;
}

function handleFiles(files) {
  const file = files[0];

  Papa.parse(file, {
    complete: function(results) {
      // remove header row and empty last row
      const data_old = results.data.slice(1, results.data.length - 1);
      const data_new = [];
      for (const d of data_old) {
        const n = [d[0], d[2], d[3].slice(0, 5)]; // description, room, time
        data_new.push(n);
      }

      post("/all", {
        data: JSON.stringify(parseClasses(data_new)),
        date: (new Date()).toLocaleString("de-DE")
      });
    }
  });
}

function post(path, params, method = 'post') {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}
