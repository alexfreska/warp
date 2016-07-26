var App = function(vd, initDOM, updateDOM) {
  var state = {
    val: " "
  }
  var eventSubMap = {}
  var testFunc = (value) => {
    state.val = value
    update()
  }

  var vTree = render(state)
  eventMapFromVTree(vTree)
  initDOM(vTree)

  function processMessage(message) {
    eventSubMap[message.wid]
    && eventSubMap[message.wid][message.event]
    && eventSubMap[message.wid][message.event](message.value)
  }

  function update() {
    var vTree = render(state)
    eventMapFromVTree(vTree)
    updateDOM(vTree)
  }

  function render(state) {
    return vd.h('div', {
      events: {
        mouseout: function() {console.log('yolo')}
      },
      style: {
        textAlign: 'center',
        border: '1px solid red',
        width: '100px',
        height: '100px'
      }
    },[new vd.h('div', {}, [
      new vd.h('span', {}, [state.val]),
      new vd.h('input', {events: {keyup: testFunc}, attributes: {"data-wid": "a1"}, placeholder: 'type here'}, [])
    ])])
  }

  function eventMapFromVTree(vnode) {
    if('VirtualNode' !== vnode.type) return
    if(vnode.children) vnode.children.map(eventMapFromVTree)
    if(!vnode.properties.events) return
    var wid = String(Math.random()*1000000)
    var props = vnode.properties

    if(!props.attributes) props.attributes = {}
    props.attributes['data-wid'] = wid
    
    eventSubMap[wid] = props.events
    delete props.events
  }

  return processMessage
}
