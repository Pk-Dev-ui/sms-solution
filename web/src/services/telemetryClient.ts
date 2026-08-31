export function trackClientEvent(name: string, properties: Record<string, unknown> = {}) { console.log(JSON.stringify({ name, properties })); }
