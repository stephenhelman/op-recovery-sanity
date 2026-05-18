export async function postToSheets(
  webhookUrl: string,
  data: {
    submittedAt: string;
    companyName: string;
    fields: { label: string; value: string }[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submittedAt: data.submittedAt,
        company: data.companyName,
        ...Object.fromEntries(data.fields.map(f => [f.label, f.value])),
      }),
    });
    if (!response.ok) throw new Error(`Sheets webhook failed: ${response.status}`);
    return { success: true };
  } catch (error) {
    console.error('Google Sheets webhook error:', error);
    return { success: false, error: String(error) };
  }
}
