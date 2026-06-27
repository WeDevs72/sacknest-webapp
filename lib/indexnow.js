/**
 * Utility to ping IndexNow when content is published or updated.
 */
export async function pingIndexNow(urlPath) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.warn('[IndexNow] INDEXNOW_KEY is not defined in environment variables.');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sacknest.com';
  const targetUrl = `${baseUrl}${urlPath}`;

  try {
    const pingUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(targetUrl)}&key=${key}`;
    console.log(`[IndexNow] Pinging: ${pingUrl}`);
    const response = await fetch(pingUrl);
    if (!response.ok) {
      console.error(`[IndexNow] Failed to ping IndexNow. Status: ${response.status} ${response.statusText}`);
    } else {
      console.log(`[IndexNow] Successfully pinged IndexNow for URL: ${targetUrl}`);
    }
  } catch (error) {
    console.error('[IndexNow] Error pinging IndexNow:', error);
  }
}
