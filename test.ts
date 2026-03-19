fetch('http://localhost:3000/api/live-tokens').then(r=>r.text()).then(console.log).catch(console.error);
