export function createWorker(func, vDOM) {
  var vDOM = vDOM.default
  var blobURL = createFuncBlobWithVDOM(func, vDOM)
  var worker = new Worker(blobURL)
  URL.revokeObjectURL(blobURL)
  return worker
}

function createFuncBlobWithVDOM(func, vDOM) {
  var keys = Object.keys(vDOM)
  var obj = {}
  keys.forEach(key => {
    obj[key] = vDOM[key].toString()
  })
  var arr = keys.map(key => {
    return 'var ' + key + ' = ' + obj[key] + ';'
  })
  console.log(arr)
  return URL.createObjectURL(new Blob([
    ...arr,
    '(',
    func.toString(),
    ')()'
  ], { type: 'application/javascript' }))
}

function serialize(obj) {
 return JSON.stringify(obj, function(i,v) {
    if(typeof v === 'function') {
      return v.toString();
    }
    return v;
 }) 
}
