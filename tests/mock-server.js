#!/usr/bin/env node
/**
 * Mock Server for n8n Workflows Testing
 * 
 * Simulates n8n webhook endpoints and backend API responses
 * 
 * Usage:
 *   node tests/mock-server.js
 */

const http = require('http');
const url = require('url');

const PORT = process.env.MOCK_PORT || 3000;
const HOST = process.env.MOCK_HOST || 'localhost';

// Mock responses for each provider
const mockResponses = {
  toast: {
    orders: {
      success: true,
      orderId: 'mock-order-123',
      status: 'confirmed',
      timestamp: new Date().toISOString()
    },
    orderDetails: {
      guid: 'mock-order-123',
      customer: { name: 'John Doe' },
      items: [{ name: 'Burger', price: 12.99 }],
      total: 12.99
    },
    menu: {
      menuGroups: [
        {
          guid: 'group-1',
          name: 'Main Dishes',
          items: [
            { guid: 'item-1', name: 'Burger', price: 12.99 },
            { guid: 'item-2', name: 'Pizza', price: 15.99 }
          ]
        }
      ]
    }
  },
  
  google: {
    reviews: {
      reviews: [
        {
          reviewId: 'review-1',
          reviewer: { displayName: 'Jane Smith' },
          starRating: 'FIVE',
          comment: 'Great service!',
          createTime: new Date().toISOString()
        }
      ],
      nextPageToken: 'next-page-123'
    },
    replySuccess: {
      reviewId: 'review-1',
      reply: {
        comment: 'Thank you for your review!',
        updateTime: new Date().toISOString()
      }
    }
  },
  
  yelp: {
    reviews: {
      reviews: [
        {
          id: 'yelp-review-1',
          rating: 5,
          text: 'Excellent food and atmosphere!',
          user: { name: 'Bob Johnson' },
          time_created: new Date().toISOString()
        }
      ],
      total: 50
    }
  },
  
  opentable: {
    reservations: {
      reservations: [
        {
          id: 'reservation-1',
          partySize: 4,
          dateTime: '2026-06-10T19:00:00',
          customerName: 'Alice Brown',
          status: 'confirmed'
        }
      ]
    }
  },
  
  resy: {
    reservations: {
      results: [
        {
          resy_token: 'resy-123',
          num_seats: 2,
          day: '2026-06-10',
          slot: '19:00:00',
          user: { first_name: 'Charlie', last_name: 'Davis' }
        }
      ]
    }
  },
  
  instagram: {
    postSuccess: {
      id: 'instagram-post-123',
      permalink: 'https://instagram.com/p/mock123'
    },
    commentSuccess: {
      id: 'comment-456',
      text: 'Test comment'
    }
  },
  
  facebook: {
    postSuccess: {
      id: 'facebook-post-123',
      post_id: '123_456'
    },
    commentSuccess: {
      id: 'comment-789',
      message: 'Test comment'
    }
  }
};

// Error responses
const errors = {
  unauthorized: {
    error: 'Unauthorized',
    message: 'Invalid or missing authentication credentials'
  },
  badRequest: {
    error: 'Bad Request',
    message: 'Missing required parameters'
  },
  notFound: {
    error: 'Not Found',
    message: 'Resource not found'
  }
};

// Validate webhook authentication
function validateAuth(req) {
  const apiKey = req.headers['x-n8n-api-key'];
  const auth = req.headers['authorization'];
  
  // Check webhook key
  if (!apiKey || apiKey !== 'test-webhook-key') {
    return { valid: false, error: 'Invalid webhook key' };
  }
  
  // Check provider auth
  if (!auth || !auth.startsWith('Bearer ') && !auth.startsWith('ResyAPI')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }
  
  return { valid: true };
}

// Route handler
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-N8N-API-Key');
  
  // Handle OPTIONS
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Validate authentication
  const authResult = validateAuth(req);
  if (!authResult.valid) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ...errors.unauthorized,
      details: authResult.error
    }));
    return;
  }
  
  // Read body for POST/PUT requests
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    // Parse body if present
    let parsedBody = null;
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ...errors.badRequest,
          details: 'Invalid JSON body'
        }));
        return;
      }
    }
    
    // Route to appropriate handler
    let response = null;
    let statusCode = 200;
    
    // Toast routes
    if (pathname === '/webhook/toast/orders' && method === 'POST') {
      response = mockResponses.toast.orders;
    } else if (pathname.startsWith('/webhook/toast/orders/') && method === 'GET') {
      response = mockResponses.toast.orderDetails;
    } else if (pathname === '/webhook/toast/menu' && method === 'GET') {
      response = mockResponses.toast.menu;
    }
    
    // Google routes
    else if (pathname === '/webhook/google/reviews' && method === 'GET') {
      response = mockResponses.google.reviews;
    } else if (pathname === '/webhook/google/reviews/reply' && method === 'PUT') {
      response = mockResponses.google.replySuccess;
    }
    
    // Yelp routes
    else if (pathname === '/webhook/yelp/reviews' && method === 'GET') {
      response = mockResponses.yelp.reviews;
    }
    
    // OpenTable routes
    else if (pathname === '/webhook/opentable/reservations' && method === 'GET') {
      response = mockResponses.opentable.reservations;
    }
    
    // Resy routes
    else if (pathname === '/webhook/resy/reservations' && method === 'GET') {
      response = mockResponses.resy.reservations;
    }
    
    // Instagram routes
    else if (pathname === '/webhook/instagram/posts' && method === 'POST') {
      response = mockResponses.instagram.postSuccess;
    } else if (pathname === '/webhook/instagram/comments' && method === 'POST') {
      response = mockResponses.instagram.commentSuccess;
    }
    
    // Facebook routes
    else if (pathname === '/webhook/facebook/posts' && method === 'POST') {
      response = mockResponses.facebook.postSuccess;
    } else if (pathname === '/webhook/facebook/comments' && method === 'POST') {
      response = mockResponses.facebook.commentSuccess;
    }
    
    // Not found
    else {
      response = errors.notFound;
      statusCode = 404;
    }
    
    // Send response
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
    
    console.log(`  → ${statusCode} ${response.error || 'Success'}`);
  });
}

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log('='.repeat(70));
  console.log('🚀 Mock Server for n8n Workflows');
  console.log('='.repeat(70));
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log();
  console.log('Available endpoints:');
  console.log('  POST   /webhook/toast/orders');
  console.log('  GET    /webhook/toast/orders/:id');
  console.log('  GET    /webhook/toast/menu');
  console.log('  GET    /webhook/google/reviews');
  console.log('  PUT    /webhook/google/reviews/reply');
  console.log('  GET    /webhook/yelp/reviews');
  console.log('  GET    /webhook/opentable/reservations');
  console.log('  GET    /webhook/resy/reservations');
  console.log('  POST   /webhook/instagram/posts');
  console.log('  POST   /webhook/instagram/comments');
  console.log('  POST   /webhook/facebook/posts');
  console.log('  POST   /webhook/facebook/comments');
  console.log();
  console.log('Authentication:');
  console.log('  Header: X-N8N-API-Key: test-webhook-key');
  console.log('  Header: Authorization: Bearer <token>');
  console.log();
  console.log('Press Ctrl+C to stop');
  console.log('='.repeat(70));
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down mock server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
