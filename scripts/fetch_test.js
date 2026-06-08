const url = "https://krmcxyafxouhuzapulxj.supabase.co/rest/v1/products?select=id,name,sku,technical_name,color_id&limit=5";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjM4MzUsImV4cCI6MjA5NTczOTgzNX0.8sHHLRBakYvA8rvg6WIqbMHrjUKHzCUrqf-zro65EvQ";

fetch(url, {
  headers: { "apikey": key, "Authorization": `Bearer ${key}` }
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(e => console.error(e));
