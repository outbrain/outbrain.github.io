self.addEventListener('fetch', function(event: any) {
  console.log('hey hey fettttchingssss', event.request);
  let {request} = event;
  console.log('request', request);
  //pass through
  return fetch(event.request)
});

self.addEventListener('install', function(event) {
  console.log('A *new* Service Worker is installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Finally active. Ready to start serving content!');  
});


