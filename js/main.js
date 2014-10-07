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
  this.nodes = [];
};

EventTree.prototype.initialize = function(events, target) {
  //Remove all children of the target calendar so we can render from scratch
  target.children().remove();

  //Sort array by starting time
  var array = events.sort(function (a, b) {
    return ((a.start < b.start) ? 1 : (a.start > b.start) ? -1 : 0);
  });

  //Until all nodes are placed, find all nodes that don't collide
  //with each other and place them on the same depth level
  while (array.length > 0) {
    //Create a new depth level
    var currentDepthNodes = [];
    //By counting backwards, splicing the array and removing an element
    //will not skip over the next element
    for (var index = array.length-1; index >= 0; index--) {
      //Check if this node overlaps with other nodes on the current depth level
      if(this.noOverlappingNodes(array[index], currentDepthNodes)){
        currentDepthNodes.push(array.splice(index, 1)[0]);
      }
    }
    this.nodes.push(currentDepthNodes);
  }

  //Map out the relationships between nodes on different depths
  this.mapNodes();

  console.log(this.nodes);
  this.render(target);
}

//Returns true if entry collides with any other nodes on currentDepthNodes,
//otherwise false
EventTree.prototype.noOverlappingNodes = function(entry, currentDepthNodes) {
  var currentEvent = new Event(entry.start, entry.end);
  //Count all other nodes on current depth level that entry collides in time with
  var overlappedEvents = currentDepthNodes.filter(function (otherEntry) {
    return (entry.start >= otherEntry.start && entry.start <= otherEntry.end) || (otherEntry.start >= entry.start && otherEntry.start <= entry.end);
  });

  return overlappedEvents.length == 0;
}

EventTree.prototype.mapNodes = function() {

}

EventTree.prototype.render = function(target) {
  this.nodes.forEach(function (entry) {
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
  var depth = 0;
  events.forEach(function (entry) {
    depth = Math.max(depth, this.findMaxDepth(entry.children));
  }, this);
  return depth + 1;
}

//Render the calendar
function layOutDay(events) {
  var eventTree = new EventTree();
  eventTree.initialize(events, $("#calendar"));
}

$(document).ready(function () {
  layOutDay(sample);
});
