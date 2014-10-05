var sample = [  {start: 30, end:  150}, {start: 540,  end:  600}, {start: 560,  end:  620}, {start: 610,  end: 670}  ];

function layOutDay(events) {
  var cal = document.getElementById("calendar");
  var minWidth = [];

  while (cal.firstChild) {
    cal.removeChild(cal.firstChild);
  }

  events.forEach(function (entry, index) {
    var el = document.createElement("div");
    el.className = "entry";
    el.innerHTML = entry.start;
    el.style.marginTop = entry.start + "px";
    el.style.height = (entry.end - entry.start) + "px";
    var overlap = events.filter(function (entry2) {
      return (entry.start >= entry2.start && entry.start <= entry2.end) || (entry2.start >= entry.start && entry2.start <= entry.end);
    }).length;
    if (!minWidth[index] || minWidth[index] > 600 / overlap) {
      minWidth[index] = 600 / overlap;
    }
    el.style.width = minWidth[index] + "px";
    cal.appendChild(el);
  });
}

layOutDay(sample);
