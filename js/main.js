var sample = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

//Node element created for each event used in EventTree
var Event = function (start, end) {
  this.start = start;
  this.end = end;
  this.height = end - start;
  this.title = "Sample Title";
  this.description = "Lorem Ipsum";
  this.children = [];
};

//Creates a tree from an array of JS objects and renders it
function EventTree() {
  this.nodes = [];
}

//Takes array of events and target element to render calendar on.
//Algorithm for generating calendar is as follows:
/*
    1.Assign all elements that don't overlap to a single depth level, then
      start on a new depth level until all elements are placed.
    2.Go through each depth level and the one directly following it. If any node
      overlaps with one deeper than it, add the deeper one to the node's list of children.
    3.We can now recursively search through each node and its children to determine how
      deep a node stretches, which lets us calculate its width and position.
*/
EventTree.prototype.initialize = function (events, target) {
  var currentDepthNodes, index, temp;
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
    currentDepthNodes = [];
    //By counting backwards, splicing the array and removing an element
    //will not skip over the next element in the iteration
    for (index = array.length - 1; index >= 0; index--) {
      //If this node doesn't overlap with other nodes on the current depth level
      //add it to the current depth level array
      if (this.noOverlappingNodes(array[index], currentDepthNodes)) {
        temp = array.splice(index, 1)[0];
        currentDepthNodes.push(new Event(temp.start, temp.end));
      }
    }
    this.nodes.push(currentDepthNodes);
  }

  //Map out the children relationships
  this.mapNodes();

  //Creates the proper HTML elements and renders them on target element
  this.render(target);
};

//Returns true if entry collides with any other nodes on currentDepthNodes,
//otherwise false
EventTree.prototype.noOverlappingNodes = function (entry, currentDepthNodes) {
  //Count all other nodes on current depth level that entry collides in time with
  var overlappedEvents = currentDepthNodes.filter(function (otherEntry) {
    return this.checkOverlap(entry, otherEntry);
  }, this);

  return overlappedEvents.length === 0;
};

//Looks through each depth level and the one directly after it
//populates the children array of each Event object
EventTree.prototype.mapNodes = function () {
  var i, j, k, node1, node2;

  for (i = 0; i < this.nodes.length - 1; i++) {
    for (j = 0; j < this.nodes[i].length; j++) {
      for (k = 0; k < this.nodes[i + 1].length; k++) {
        node1 = this.nodes[i][j];
        node2 = this.nodes[i + 1][k];
        if (this.checkOverlap(node1, node2)) {
          node1.children.push(node2);
        }
      }
    }
  }
};

//Returns true if node1 overlaps node2, otherwise false
EventTree.prototype.checkOverlap = function (node1, node2) {
  return (node1.start >= node2.start && node1.start <= node2.end) || (node2.start >= node1.start && node2.start <= node1.end);
};

//Goes through each node in the EventTree and calculates width and position,
//then renders on target element
EventTree.prototype.render = function (target) {
  var i, j, el;

  for (i = 0; i < this.nodes.length; i++) {
    for (j = 0; j < this.nodes[i].length; j++) {
      el = document.createElement('div');
      $(el).attr('class', 'entry').css({
        marginTop: this.nodes[i][j].start + 'px',
        width: (600 / (i + this.findMaxDepth(this.nodes[i][j].children))) + 'px',
        marginLeft: i * (600 / (i + this.findMaxDepth(this.nodes[i][j].children))) + 'px',
        height: this.nodes[i][j].height,
      });
      el.innerHTML = '<span><strong>' + this.nodes[i][j].title + '</strong></span>' +
                     '<br><span>' + this.nodes[i][j].description + '</span>';
      target.append(el);
    }
  }
};

//Recursive search for maximum depth of a node and its children
EventTree.prototype.findMaxDepth = function (events) {
  var depth = 0;
  events.forEach(function (entry) {
    depth = Math.max(depth, this.findMaxDepth(entry.children));
  }, this);
  return depth + 1;
};

//Global function that creates a new EventTree on the #calendar element
function layOutDay(events) {
  var eventTree = new EventTree();
  eventTree.initialize(events, $("#calendar"));
}

$(document).ready(function () {
  layOutDay(sample);
});
