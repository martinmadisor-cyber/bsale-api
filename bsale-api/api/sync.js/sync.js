export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // IMPORTANTE: Pon aquí tu token nuevo de BSale
  const BSALE_TOKEN = '2a7bf9dd3f9594699e5862c6f199d99cfabce557';
  
  try {
    const { type = 'documents' } = req.query;
    
    let endpoint = '';
    if (type === 'documents') {
      endpoint = 'https://api.bsale.cl/v1/documents.json?limit=50';
    } else if (type === 'clients') {
      endpoint = 'https://api.bsale.cl/v1/clients.json?limit=50';
    }
    
    const response = await fetch(endpoint, {
      headers: {
        'access_token': BSALE_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      data: data.items || []
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}