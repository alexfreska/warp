import {Events} from "events";

function stripEvents(rootNode) {
  // walk through v-dom object and grap all event hashes
  return [cleanDom, eventsObj];
}

var eventStore = {
  "wfeji": {
    click: function() { console.log("blue") },
    hover: function() { console.log("red") }
  },
  "578jx": {
    mouseout: function() { console.log("yellow") }
  }
}

function computeEventMap(nextEventFuncMap) {
  var wids = Object.keys(nextEventFuncMap);
  var resMap = {};
  wids.forEach(function(wid) {
    var events = Object.keys(nextEventFuncMap[wid]);
    var resEvents = {};
    events.forEach(function(e) {
      resEvents[e] = true;
    });
    resMap[wid] = resEvents;
  });
  return resMap;
}

function diffDOM(prevDOM, nextDOM) {

}

export function WarpWorker() {
  onmessage = function(e) {
    var d = e.data;
    d.event && eventStore[d.wid]
    && eventStore[d.wid][d.event]();
    postMessage({report: true});
  }
  postMessage({eventMap: computeEventMap(eventStore)});
}

