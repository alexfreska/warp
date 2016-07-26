export function createWorker(func) {
  var blobURL = createFuncBlob(func)
  var worker = new Worker(blobURL)
  URL.revokeObjectURL(blobURL)
  return worker
}

function createFuncBlob(func) {
  return URL.createObjectURL(new Blob([
    '(',
    func.toString(),
    ')()'
  ], { type: 'application/javascript' }))
}
