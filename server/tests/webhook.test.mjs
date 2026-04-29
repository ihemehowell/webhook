import test from "node:test";
import assert from "node:assert/strict";

const webhookUrl = process.env.WEBHOOK_URL ?? "http://localhost:4000/h/msgopv5z3f";

test("webhook endpoint accepts payload", async () => {
  const payload = {
    event: "automated-test",
    source: "node-test",
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  assert.equal(response.status, 200, `Expected 200, received ${response.status}`);

  const json = await response.json();
  assert.equal(json.received, true);
  assert.equal(typeof json.id, "string");
  assert.ok(json.id.length > 0);
});

test("webhook endpoint returns 404 for unknown channel", async () => {
  const invalidChannelUrl = `${new URL(webhookUrl).origin}/h/unknown-channel-id-404`;
  const payload = {
    event: "automated-test-invalid",
    source: "node-test",
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(invalidChannelUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  assert.equal(response.status, 404, `Expected 404, received ${response.status}`);

  const json = await response.json();
  assert.equal(json.error, "Channel not found");
});

test("webhook endpoint captures query parameters", async () => {
  const queryUrl = `${webhookUrl}?apiKey=secret123&userId=user-456&version=2.1`;
  const payload = {
    event: "test-with-query",
    source: "node-test-query",
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(queryUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  assert.equal(response.status, 200, `Expected 200, received ${response.status}`);

  const json = await response.json();
  assert.equal(json.received, true);
  assert.equal(typeof json.id, "string");
  assert.ok(json.id.length > 0);
});

