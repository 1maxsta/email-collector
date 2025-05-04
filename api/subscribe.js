export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = 'TWxiSf';

  try {
    const response = await fetch(`https://a.klaviyo.com/api/profiles/`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        revision: '2023-09-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: errorData });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
