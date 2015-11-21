import { createWorker } from './create-worker'
import { WarpApplicationThreadManager } from './warp-worker'
import { Events } from './events'
import * as vd from 'virtual-dom'
var $ = require('jquery')

// import * as vd from 'virtual-dom'

export function WarpMainThreadManager() {
  console.log('Bootstrapping WarpVM')

  /** 
   * initialize application thread
   */
  const m = createWorker(WarpApplicationThreadManager, vd)

  /**
   * requires constants
   */
  const events = Events.getString()

  /**
   * state managment
   */
  var eventMap = {}
  var vTree = null

  /**
   * setup message passing subscriptions
   */
  m.onmessage = e => {

    // event updates
    e.data.eventMap && (eventMap = e.data.eventMap)
  }

  /**
   * setup top level event listener
   */
  $(() => {
    $('body').on(events, e => {
      var x = e.target.attributes['data-wid']
      var wid = x && x.nodeValue
      // checks events, we could just optimistically send
      wid && eventMap[wid] && eventMap[wid][e.type]
      && m.postMessage({event: e.type, wid: wid})
    })
  })
}
