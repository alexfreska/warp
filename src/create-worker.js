export function createWorker(func) {
  var blobURL = URL.createObjectURL(new Blob(['(',
    func.toString(),
  ')()'], { type: 'application/javascript' })),
  worker = new Worker(blobURL)
  URL.revokeObjectURL(blobURL)
  return worker
}
