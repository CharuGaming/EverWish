async function test() {
  try {
    const obj = { sort: function() { throw new Error('sync throw'); } };
    const res = await obj.sort();
  } catch(e) {
    console.log('caught!', e.message);
  }
}
test();
