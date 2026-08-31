export function trackEvent(name: string, properties: Record<string, any> = {}) {
  console.log(JSON.stringify({ type: "event", name, properties, timestamp: new Date().toISOString() }));
}

export function trackException(error: any, properties: Record<string, any> = {}) {
  console.error(JSON.stringify({ type: "exception", message: error.message, stack: error.stack, properties, timestamp: new Date().toISOString() }));
}

export async function alertAdministrators(subject: string, details: Record<string, any>) {
  trackEvent("AdminAlert", { subject, ...details });
}
