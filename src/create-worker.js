export function createWorker(func) {
  // Build a worker from an anonymous function body
  var blobURL = URL.createObjectURL(new Blob(['(',
  function(){ func(); }.toString(),
  ')()'], { type: 'application/javascript' })),
  worker = new Worker(blobURL);
  URL.revokeObjectURL(blobURL);
  return worker;
}
