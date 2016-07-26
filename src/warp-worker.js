import * as vd from 'virtual-dom'

console.log('WarpWorker running...')
console.log('Waiting to load application...')

var messageApp = function() {}
var VTree = null;

function diffDOMFactory(vd) {
  return function diffDOM(nextVTree) {
    var diff = vd.diff(VTree, nextVTree)
    VTree = nextVTree
    return diff
  }
}

var diffDOM = diffDOMFactory(vd)

/**
  * setup message passing subscriptions
  */
onmessage = e => {
  var d = e && e.data || {}

  // mount app
  d.type === 'application' && loadApplication(d.url)

  // handle events
  d.event && messageApp(d)

  return
}

function loadApplication(appURL) {
  importScripts(appURL)
  messageApp = App(vd, initDOM, updateDOM)
}

function initDOM(tree) {
  VTree = tree
  postMessage({dom: serializeVTree(tree)})
}

function sendPatch(patch, vTree) {
  postMessage({patch: serializeVPatch(patch)})
}

function serializeVTree(vdom) {
  return serializeVNode(vdom)
}

function serializeVPatch(vpatch) {
  var keys = Object.keys(vpatch)
  keys.forEach(key => {
    if(key !== 'a') {
      vpatch[key].patch = serializeVNode(vpatch[key].patch)
      vpatch[key].vNode = serializeVNode(vpatch[key].vNode)
    } else {
      vpatch[key] = serializeVNode(vpatch[key])
    }
  })
  return vpatch
}

function serializeVNode(vNode) {
  if(!vNode || typeof vNode === 'string') return vNode
  if('Thunk' === vNode.type) vNode = vNode.render()
  if(vNode.children) vNode.children = vNode.children.map(serializeVNode)
  vNode.type = vNode.type
  vNode.version = vNode.version
  return vNode
}

function updateDOM(tree) {
  console.log('updateDOM')
  sendPatch(diffDOM(tree), VTree)
}
