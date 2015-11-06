import {createWorker} from "./create-worker";
import {WarpWorker} from "./warp-worker";
import Events from "./events";
import {$} from "jquery";

export function WarpManager() {
  console.log('awfewef')
  // initialize application thread
  var m = createWorker(WarpWorker);

  // requires
  var events = Events.string;

  // state
  var eventMap = {};
  var vTree = null;

  // setup messaging system
  m.onmessage = function(e) {
    // event updates
    e.data.eventMap && (eventMap = e.data.eventMap);
  }

  $(function() {
    // setup event propogation watchers
    $("body").on(events, function(e) {
      var x = e.target.attributes["data-wid"];
      var wid = x && x.nodeValue;
      // checks events, we could just optimistically send
      wid && eventMap[wid] && eventMap[wid][e.type]
      && m.postMessage({event: e.type, wid: wid});
    });
  });
}
