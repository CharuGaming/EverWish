async function test() {
  const res = await fetch('http://localhost:5001/api/sites', {
    headers: { 'Authorization': 'Bearer test' } // just in case
  });
  if (!res.ok) { console.log(await res.text()); return; }
  const json = await res.json();
  const sites = json.data;
  if(sites.length > 0) {
    const siteId = sites[0].siteId;
    console.log("Testing siteId:", siteId);
    const docRes = await fetch('http://localhost:5001/api/sites/' + siteId);
    const docJson = await docRes.json();
    const doc = docJson.data;
    doc.general.coupleName = "Test Name " + Date.now();
    
    // Simulate save
    const saveRes = await fetch('http://localhost:5001/api/sites/' + siteId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
      body: JSON.stringify(doc)
    });
    const saveJson = await saveRes.json();
    console.log("Save Response:", saveJson.success ? "Success" : saveJson.message);
    
    // Fetch again
    const verifyRes = await fetch('http://localhost:5001/api/sites/' + siteId);
    const verifyJson = await verifyRes.json();
    console.log("Verify Name:", verifyJson.data.general.coupleName === doc.general.coupleName ? "MATCH" : "MISMATCH (" + verifyJson.data.general.coupleName + ")");
  } else {
    console.log("No sites found");
  }
}
test();
