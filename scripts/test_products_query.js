const url = "https://krmcxyafxouhuzapulxj.supabase.co/rest/v1/products?select=id%2Cname%2Cvariations%3Aproduct_variations%28id%2Cinventory_batches%28quantity_available%29%29&limit=1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjM4MzUsImV4cCI6MjA5NTczOTgzNX0.8sHHLRBakYvA8rvg6WIqbMHrjUKHzCUrqf-zro65EvQ";

fetch(url, {
  headers: { "apikey": key, "Authorization": `Bearer ${key}` }
})
.then(async r => {
  console.log("Status:", r.status);
  const text = await r.text();
  console.log("Body:", text);
})
.catch(e => console.error(e));
