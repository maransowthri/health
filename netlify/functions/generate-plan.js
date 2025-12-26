// Netlify serverless function to generate health plan using OpenAI
// The OPENAI_API_KEY is stored as an environment variable in Netlify

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'OpenAI API key not configured' })
            };
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert health and fitness coach. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: errorData.error?.message || 'Failed to generate health plan' 
                })
            };
        }

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                content: data.choices[0].message.content
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error.message || 'Internal server error' 
            })
        };
    }
};
