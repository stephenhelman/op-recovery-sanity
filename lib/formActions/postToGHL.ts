export async function postToGHL(
  apiKey: string,
  formData: {
    name?: string;
    email?: string;
    phone?: string;
    fields: { label: string; value: string }[];
    pipelineId?: string;
    stageId?: string;
    companyName: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const nameField = formData.fields.find(f => f.label.toLowerCase().includes('name'));
    const emailField = formData.fields.find(f => f.label.toLowerCase().includes('email'));
    const phoneField = formData.fields.find(f => f.label.toLowerCase().includes('phone'));

    const notes = formData.fields.map(f => `${f.label}: ${f.value}`).join('\n');

    const contactPayload: Record<string, unknown> = {
      firstName: nameField?.value?.split(' ')[0] || '',
      lastName: nameField?.value?.split(' ').slice(1).join(' ') || '',
      email: emailField?.value || '',
      phone: phoneField?.value || '',
      source: formData.companyName,
      notes,
    };

    const contactResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactResponse.ok) {
      throw new Error(`GHL contact creation failed: ${contactResponse.status}`);
    }

    const contact = await contactResponse.json();

    if (formData.pipelineId && contact.contact?.id) {
      await fetch('https://rest.gohighlevel.com/v1/opportunities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          pipelineId: formData.pipelineId,
          stageId: formData.stageId || '',
          contactId: contact.contact.id,
          name: `${nameField?.value || 'New Lead'} — ${formData.companyName}`,
          status: 'open',
        }),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('GHL integration error:', error);
    return { success: false, error: String(error) };
  }
}
