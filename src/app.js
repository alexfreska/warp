

function handleClick() {
  console.log("click");
}

// A. The data structure
// build nodeTree with virtual dom include event function properties
div({},span({style: {color: "blue"}, events: {click: handleClick} },"hello"))

// hyperscript uids
div#a1
span#b2

// B. DOM
// The vdom datastructure is stripped of events (used for step C) result would be: 
div({},span({style: {color: "blue"}},"hello"))
// return resulting vdom to be diffed
diff(prevVdom, vdom)
// this is sent to main thread where the rootNode is patched

// C. Eventing
// strip out event map based on uids
eventMap = {
  "div#a1": {
  },
  "span#b2": {
    click: handleClick
  }
}
// diff the event map to find patch
return diff(prevEventMap, eventMap)
// say the prevEventMap was
eventMap = {
  "div#a1": {
    mouseup: func,
  },
  "span#b2": {
  }
}
// result is just a bool map to send to main thread,
// false indicates event listener can be removed
// true indicates event listener should be registered
eventPatch = {
  "div#a1": {
    mouseup: false
  },
  "span#b2": {
    click: true
  }
}

// on the main thread the eventSubscriptions map is updated
var listenerFn = eventSubscriptions["div#a1"]["mouseup"]; 
document.findElementById("div#a1").removeEventListener("mouseup", listenerFn);
var listenerFn = eventSubscriptions["span#b2"]["click"] = new Warp.listenerFn("span#b2", "click");
document.findElementById("span#b2").addEventListener("mouseup", listenerFn);

// say someone clicks on span#b2
// Warp.listenerFn sends message to application thread and fires handleClick
// this may then in turn dispatch and action or execute business logic but the
// developer is completely abstracted away from message passing

// D. DOM Access
// DOM access through async value accessor functions
Warp.getDOMNodeValue(uid, function(value) {
  // use the result in your application
  Actions.setFullName(value);
})

