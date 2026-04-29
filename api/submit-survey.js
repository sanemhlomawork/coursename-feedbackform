module.exports = async function handler(req, res) {

  const allowedOrigin = "https://cpcontents.adobe.com"; 

  

  // Set CORS headers for all responses 

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin); 

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); 

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key"); 

  

  // Handle preflight request 

  if (req.method === "OPTIONS") { 

    return res.status(200).end(); 

  } 

  

  console.log("Headers:", req.headers); 

  

  if (req.method !== "POST") { 

    return res.status(405).json({ error: "Method not allowed" }); 

  } 

  

  // Validate API key 

  const apiKey = req.headers["x-api-key"]; 

  if (apiKey !== process.env.PROXY_KEY) { 

    return res.status(401).json({ error: "Unauthorized" }); 

  } 

  

  try { 

    const response = await fetch(process.env.POWER_AUTOMATE_URL, { 

      method: "POST", 

      headers: { 

        "Content-Type": "application/json" 

      }, 

      body: JSON.stringify(req.body) 

    }); 

  

    const data = await response.text(); 

    return res.status(200).json({ success: true, data }); 

  } catch (error) { 

    console.error("Proxy error:", error); 

    return res.status(500).json({ error: "Proxy failed" }); 

  } 

} 
