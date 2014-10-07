var sample = [  {start: 30, end:  150}, {start: 540,  end:  600}, {start: 560,  end:  620}, {start: 610,  end: 670}  ];

var Event = function (start, end) {
  this.start = start;
  this.end = end;
  this.width = -1;
  this.height = end - start;
  this.marginLeft = -1;
  this.rendered = false;
  this.title = "Sample Title";
  this.description = "Lorem Ipsum";
  this.maxDepth = 0;
  this.depth = 0;
  this.children = [];
};

function EventTree () {
  this.tree = [];
};

EventTree.prototype.initialize = function(events, target) {
  target.children().remove();

  //Sort array by starting time
  var array = events.sort(function (a, b) {
    return ((a.start < b.start) ? -1 : (a.start > b.start) ? 1 : 0);
  });

  array.forEach(function (entry, index) {
    // var el = document.createElement("div");
    // el.className = "entry";
    // el.innerHTML = entry.start;
    // el.style.marginTop = entry.start + "px";
    // el.style.height = (entry.end - entry.start) + "px";
    this.append(entry);
    // if (!minWidth[index] || minWidth[index] > 600 / overlap) {
    //   minWidth[index] = 600 / overlap;
    // }
    // el.style.width = minWidth[index] + "px";
    // cal.appendChild(el);
  }, this);

  this.render(target);
}

EventTree.prototype.append = function(entry) {
  var currentEvent = new Event(entry.start, entry.end)
  var overlappedEvents = this.tree.filter(function (otherEntry) {
    //If otherEntry overlaps with current event at any time
    if ((entry.start >= otherEntry.start && entry.start <= otherEntry.end) || (otherEntry.start >= entry.start && otherEntry.start <= entry.end)) {
      //Append the current event to the other entry
      currentEvent.depth = otherEntry.depth + 1;
      otherEntry.children.push(currentEvent);
      debugger;
      return true;
    }
  }, this);

  if (overlappedEvents.length == 0) {
    this.tree.push(currentEvent);
  }
}

EventTree.prototype.render = function(target) {
  this.tree.forEach(function (entry) {
    var el = document.createElement('div');
    $(el).attr('class', 'entry').css({
      top: entry.start + 'px',
      width: (600 / this.findMaxDepth(entry.children, entry.depth)) + 'px',
      height: entry.height,
    });
    el.innerHTML = '<span><strong>' + entry.title + '</strong></span>' +
                   '<br><span>' + entry.description + '</span>';
    target.append(el);
  }, this);
}

EventTree.prototype.findMaxDepth = function(events) {
  // if (!events) {
  //   return depth - 1;
  // } else {
  //   events.forEach(function (entry) {
  //     return 
  //   });
  // }
  var depth = 0;
  events.forEach(function (entry) {
    depth = Math.max(depth, this.findMaxDepth(entry.children));
  }, this);
  return depth + 1;
}

function layOutDay(events) {
  var eventTree = new EventTree();
  eventTree.initialize(events, $("#calendar"));
}

$(document).ready(function () {
  layOutDay(sample);
});
