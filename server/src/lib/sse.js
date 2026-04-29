// In-memory SSE client registry
// Key: channelId, Value: Set of response objects
const clients = new Map();

export function addClient(channelId, res) {
  if (!clients.has(channelId)) clients.set(channelId, new Set());
  clients.get(channelId).add(res);
}

export function removeClient(channelId, res) {
  const set = clients.get(channelId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(channelId);
}

export function broadcast(channelId, data) {
  const set = clients.get(channelId);
  if (!set || set.size === 0) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    res.write(payload);
  }
}