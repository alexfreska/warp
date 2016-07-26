import { createWorker } from './create-worker'
import { Events } from './events'
import * as vd from 'virtual-dom'
var $ = require('jquery')

WarpMain()

function WarpMain() {
  $(() => {
    /** 
    * initialize application thread
    */
    // const m = createWorker(WarpApplicationThreadManager)
    const m = new Worker("build/warp-worker.bundle.js")
    m.postMessage({type: 'application', url: '/test/build/app.js'})

    /**
    * initialize root
    */
    var rootNode = null

    /**
    * setup message passing subscriptions
    */
    m.onmessage = e => {
      if(e.data.patch) {
        rootNode = vd.patch(rootNode, e.data.patch)
      } else if(e.data.dom) {
        rootNode = vd.create(e.data.dom)
        document.body.appendChild(rootNode)
      }
    }

    /**
    * setup top level event listener
    */
    $('body').on(Events.getString(), e => {
      var x = e.target.attributes['data-wid']
      var wid = x && x.nodeValue
      m.postMessage({value: e.target && e.target.value, event: e.type, wid: wid})
    })
  })
}
