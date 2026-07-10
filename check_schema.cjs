const { createClient } = require("@supabase/supabase-js");
const url = "https://krmcxyafxouhuzapulxj.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjM4MzUsImV4cCI6MjA5NTczOTgzNX0.8sHHLRBakYvA8rvg6WIqbMHrjUKHzCUrqf-zro65EvQ";
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from("users").select("email").limit(5);
  if (error) {
    console.error(error);
  } else {
    console.log("Users:", data);
  }
}
check();
