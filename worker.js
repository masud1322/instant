addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const url = new URL(request.url)
    const downloadUrl = url.searchParams.get('url')

    if (!downloadUrl) {
      return new Response('Missing URL parameter', { status: 400 })
    }

    // Fetch the file
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    // Get original headers
    const headers = new Headers(response.headers)
    
    // Add CORS headers
    Object.keys(corsHeaders).forEach(key => {
      headers.set(key, corsHeaders[key])
    })

    // Force download
    const filename = headers.get('content-disposition') || 'download'
    headers.set('content-disposition', `attachment; filename="${filename}"`)

    // Stream the response
    return new Response(response.body, {
      headers: headers,
      status: response.status,
      statusText: response.statusText
    })

  } catch (err) {
    return new Response(err.message, { status: 500 })
  }
} 