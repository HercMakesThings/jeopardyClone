//install service worker
self.addEventListener('install', (e)=>{
    console.log('service worker installed!!');
});

//listen for activate event of serviceworker
self.addEventListener('activate', (e)=>{
    console.log('service worker activated!!');
});