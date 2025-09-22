export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar petición pre-flight de CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Leer el token desde las variables de entorno de Vercel
  const BSALE_TOKEN = process.env.BSALE_TOKEN;
  
  // Verificar que el token exista (SIN el ! antes del paréntesis)
  if (!BSALE_TOKEN) {
    return res.status(500).json({ 
      success: false, 
      error: 'El BSALE_TOKEN no está configurado en el servidor.' 
    });
  }
  
  try {
    const { type = 'documents' } = req.query;
    let endpoint = '';
    
    if (type === 'documents') {
      endpoint = 'https://api.bsale.cl/v1/documents.json?limit=50';
    } else if (type === 'clients') {
      endpoint = 'https://api.bsale.cl/v1/clients.json?limit=50';
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Tipo de petición inválido. Usa "documents" o "clients".' 
      });
    }
    
    console.log('Fetching from BSale:', endpoint);
    
    const response = await fetch(endpoint, {
      headers: {
        'access_token': BSALE_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`BSale API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      count: data.items ? data.items.length : 0,
      data: data.items || [],
      message: 'Datos obtenidos exitosamente'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error desconocido'
    });
  }
}
