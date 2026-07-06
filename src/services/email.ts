/// <reference types="vite/client" />
/**
 * Unified service to send clinical and support inquiries.
 * If EmailJS keys are configured, it sends directly from client-side via EmailJS.
 * Otherwise, it falls back to the backend /api/contact simulation endpoint.
 */
export async function sendSupportEnquiry(payload: {
  name: string;
  email: string;
  subject: string;
  priority: string;
  message: string;
}): Promise<{ success: boolean; message: string; method: 'emailjs' | 'backend' }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const isEmailJSConfigured = 
    serviceId && 
    templateId && 
    publicKey && 
    serviceId !== 'your_service_id' &&
    templateId !== 'your_template_id' &&
    publicKey !== 'your_public_key';

  if (isEmailJSConfigured) {
    try {
      const emailJSPayload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: payload.name,
          reply_to: payload.email,
          subject: payload.subject,
          priority: payload.priority,
          message: payload.message,
          to_email: 'arutkumaran19@gmail.com'
        }
      };

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailJSPayload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to send via EmailJS API');
      }

      return { success: true, message: 'Email dispatched via EmailJS.', method: 'emailjs' };
    } catch (err: any) {
      console.error('EmailJS Send failed, falling back to backend:', err);
      // Fall through to backend if EmailJS fails at runtime
    }
  }

  // Fallback to Express backend endpoint
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit inquiry to backend.');
  }

  return { 
    success: true, 
    message: data.message || 'Submitted successfully.', 
    method: 'backend' 
  };
}
