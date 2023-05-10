export async function api<T>(
  path: string, base = 'https://api.github.com'
): Promise <T>
{
const options = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
  }
}

const response: Response = await fetch(`${base}/${path}`, options)
return response.json();
}