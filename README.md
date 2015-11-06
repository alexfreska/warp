<img src="/assets/logo.png" alt="warpvm" width="180">

> Ultra-lightweight interface for multithreaded declarative web applications.

> **Bob:** How the **** is this a VM?

> **Mary:** `warpvm` abstracts browser API's and the main execution thread creating an efficient, isolated environment to multithread applications; loosely "a vm for the wild web".

**Status**: `warpvm` is still in a very unstable experimental stage. It is highly encouraged not to use this software yet.

## Usage
Loading your application.
```js
// create a WarpVM instance and pass in your application closure.
var w = new WarpVM(App);
```
The `warpvm` sets up on the main thread and exposes its API on a primary application thread. The application closure is passed to this application thread and instantiated.
**Note:** The application must conform to the `warpvm`'s declarative API for virtual DOM, eventing, and node accessors.

Inside the application `warpvm` methods are used as an interface for updating the browser.
```js
// Virtual DOM
// pass updated new virtual-tree state with wid attributes and the `warpvm` will diff and patch the dom
w.updateDOM(nextVTree);

// Virtual Events
// pass updated event subscription map and the `warpvm` will wire up callbacks
w.updateEvents(nextEvents);

// Node Accessors
w.DOMFocus(wid, callback(success));
w.DOMValue(wid, callback(value));
```

## Motivation
Over the past decade Javacript has gotten extremely fast, yet DOM operations remain slow. This has inspired libraries like Facebook's React to use Javascript to abstract DOM operations by leveraging a virtual representation to compute batched and minimized operations. This has taken advantage of Javascript's capabilities and taken away the overhead and cognitive load required to manually write optimized DOM mutation.

Modern applications are becoming more massive, capable, and complex every year. The Javascript runtime in modern browsers is doing an excellent job handling the evermore intensive applications, and React does a decent job at minimizing DOM mutation. Large applications will have a slew of functions getting fired when an event is fired. Currently the main Javascript thread is handling all of this, while also listening for more events and user interaction. Intensive processing tasks can be offloaded to run asnychronously on a web worker thread, but if your applications has lots of medium size routines then running all these operations on asynchronous side threads becomes a tedious undertaking and with the current speed of Javascript it is not often necessary or worthwhile. 

What if you did not have to change the way you build your application but could take *all* business logic onto separate threads leaving the main thread dedicated and free to respond to events and user interaction. Welcome to the `warpvm`. The advent of declarative paradigms and virtual dom has made this possible. The `warpvm` takes over the main thread and handles all browser APIs, dom, and events. All application code is run on a separate thread and updates the main thread by passing declarative patch reports.

Lots of the DOM diffing and event delegation of the `warpvm` can be found in the React library. The reason the `warpvm` does not simply take and reorganize React's implemenations is to try and keep the `warpvm` codebase stripped down to the bare essentials. `warpvm`'s primitive thread bridging can then be extended to create frameworks or libraries with first class development features like React's. `warpvm` is build with highly modular pieces like virtual-dom that together can expose a dead simple API to build frameworks or applications.

