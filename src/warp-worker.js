export function WarpApplicationThreadManager(vd) {
  // TODO add precompile step to inline this
  var vd = require('virtual-dom')
  console.log('WarpWorker running...')

  /**
   * walk through v-dom object and grap all event hashes
   *
   * @param {VirtualTree} vTree
   * @return {[VirtualTree, Object]}
   */
  function stripEvents(vTree) {
    // TODO
    var cleanDOM = {}
    var events = {}
    return [cleanDOM, events]
  }

  /**
   * state
   */
  var eventSubMap = {
    'wfeji': {
      click: () => console.log('blue'),
      hover: () => console.log('red')
    },
    '578jx': {
      mouseout: () => console.log('yellow')
    }
  }

  /**
   * translate event callback mapping into a boolean mapping
   *
   * @param {Object} subFuncMap
   * @return {Object} subBoolMap
   */
  function computeEventMap(subFuncMap) {
    var wids = Object.keys(subFuncMap)
    var subBoolMap = {}
    wids.forEach(wid => {
      var events = Object.keys(subFuncMap[wid])
      var evBoolMap = {}
      events.forEach(e => {
        evBoolMap[e] = true
      })
      subBoolMap[wid] = evBoolMap
    })
    return subBoolMap
  }

  /**
   * calculate DOM patch
   * @param {VirtualTree} prevVTree
   * @param {VirtualTree} nextVTree
   * @return {Object}
   */
  function diffDOM(prevVTree, nextVTree) {
    // return vd.diff(prevVTree, nextVTree)
  }

  /**
   * setup message passing subscriptions
   */
  onmessage = e => {
    var d = e.data
    d.event && eventSubMap[d.wid]
    && eventSubMap[d.wid][d.event]()
    postMessage({report: true})
  }

  /**
   * initial subs
   */
  postMessage({eventMap: computeEventMap(eventSubMap)})

  // function render(count)  {
  //   return vd.h('div', {
  //     style: {
  //       textAlign: 'center',
  //       lineHeight: (100 + count) + 'px',
  //       border: '1px solid red',
  //       width: (100 + count) + 'px',
  //       height: (100 + count) + 'px'
  //     }
  //   }, [String(count)])
  // }
  //
  // console.log(diffDOM(render(1), render(2)))

}

