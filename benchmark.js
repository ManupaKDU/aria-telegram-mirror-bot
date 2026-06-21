const { performance } = require('perf_hooks');

const members = [];
for (let i = 0; i < 1000; i++) {
  members.push({ user: { id: i } });
}

function testFor(members, id) {
  for (var i = 0; i < members.length; i++) {
    if (members[i].user.id === id) {
      return true;
    }
  }
  return false;
}

function testSome(members, id) {
  return members.some(m => m.user.id === id);
}

// Warmup
for (let i = 0; i < 10000; i++) {
  testFor(members, 999);
  testSome(members, 999);
}

const iters = 100000;

let start = performance.now();
for (let i = 0; i < iters; i++) {
  testFor(members, 999);
}
let end = performance.now();
console.log(`for loop: ${end - start} ms`);

start = performance.now();
for (let i = 0; i < iters; i++) {
  testSome(members, 999);
}
end = performance.now();
console.log(`some: ${end - start} ms`);
