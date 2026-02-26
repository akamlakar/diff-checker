import { Context } from "https://edge.netlify.com";

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute per IP

const requestCounts = new Map();

export default async (request, context) => {
  const ip = context.ip;
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, value] of requestCounts.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      requestCounts.delete(key);
    }
  }
  
  // Check rate limit
  const userRequests = requestCounts.get(ip);
  
  if (userRequests) {
    if (now - userRequests.timestamp < RATE_LIMIT_WINDOW) {
      if (userRequests.count >= MAX_REQUESTS) {
        return new Response('Rate limit exceeded. Please try again later.', {
          status: 429,
          headers: {
            'Content-Type': 'text/plain',
            'Retry-After': '60'
          }
        });
      }
      userRequests.count++;
    } else {
      requestCounts.set(ip, { count: 1, timestamp: now });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }
  
  return context.next();
};

export const config = { path: "/*" };
