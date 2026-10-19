const PORTAL_ID = '52186839';
const FORM_GUID = '4bbbc12b-8741-4a84-8127-2c04dc735f85';

const ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

export async function sendToHubSpot({ firstname, email }) {
  const payload = {
    fields: [
      { objectTypeId: '0-1', name: 'firstname', value: firstname },
      { objectTypeId: '0-1', name: 'email', value: email },
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: 'Acepto recibir novedades y acepto la Política de privacidad.',
      },
    },
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

      if (!res.ok) {
    const detail = await res.text();
    console.error('HubSpot error', res.status, detail);
    throw new Error(`HubSpot respondió ${res.status}`);
  }
  return res.json();
}