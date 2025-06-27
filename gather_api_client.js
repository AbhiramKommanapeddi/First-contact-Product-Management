const fetch = require('node-fetch');
require('dotenv').config();

/**
 * Gather.Town API Client
 * Handles all interactions with the Gather.Town HTTP API
 */
class GatherAPIClient {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GATHER_API_KEY;
    this.baseUrl = process.env.GATHER_BASE_URL || 'https://gather.town/api/v2';
    this.retryConfig = {
      maxRetries: 3,
      backoffMs: 1000,
      retryCondition: (error) => error.status >= 500 || error.status === 429
    };

    if (!this.apiKey) {
      throw new Error('Gather.Town API key is required');
    }
  }

  /**
   * Make HTTP request to Gather.Town API with retry logic
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FC-GuestList-POC/1.0'
      }
    };

    const requestOptions = { ...defaultOptions, ...options };

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        console.log(`🔄 API Request: ${options.method || 'GET'} ${endpoint} (attempt ${attempt + 1})`);
        
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new APIError(response.status, responseData.message || response.statusText);
        }
        
        console.log(`✅ API Success: ${endpoint}`);
        return responseData;
        
      } catch (error) {
        console.log(`❌ API Error: ${error.message}`);
        
        if (attempt === this.retryConfig.maxRetries || 
            !this.retryConfig.retryCondition(error)) {
          throw error;
        }
        
        // Exponential backoff
        const backoffTime = this.retryConfig.backoffMs * Math.pow(2, attempt);
        console.log(`⏳ Retrying in ${backoffTime}ms...`);
        await this.delay(backoffTime);
      }
    }
  }

  /**
   * Create a new Gather.Town space
   */
  async createSpace(spaceConfig) {
    return await this.makeRequest('/spaces', {
      method: 'POST',
      body: JSON.stringify(spaceConfig)
    });
  }

  /**
   * Get space details
   */
  async getSpace(spaceId) {
    return await this.makeRequest(`/spaces/${spaceId}`);
  }

  /**
   * Update space configuration
   */
  async updateSpace(spaceId, updates) {
    return await this.makeRequest(`/spaces/${spaceId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Add guest to space
   */
  async addGuest(spaceId, guestConfig) {
    try {
      return await this.makeRequest(`/spaces/${spaceId}/guests`, {
        method: 'POST',
        body: JSON.stringify({
          guests: Array.isArray(guestConfig) ? guestConfig : [guestConfig],
          sendInvitation: true
        })
      });
    } catch (error) {
      // Enhanced error handling for common scenarios
      if (error.status === 400) {
        throw new ValidationError('Invalid guest configuration', guestConfig);
      } else if (error.status === 403) {
        throw new PermissionError('Insufficient permissions to add guests');
      } else if (error.status === 409) {
        throw new ConflictError('Guest already exists in space');
      }
      throw error;
    }
  }

  /**
   * Get guest list for space
   */
  async getGuestList(spaceId) {
    return await this.makeRequest(`/spaces/${spaceId}/guests`);
  }

  /**
   * Update guest permissions
   */
  async updateGuest(spaceId, guestId, updates) {
    return await this.makeRequest(`/spaces/${spaceId}/guests/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Remove guest from space
   */
  async removeGuest(spaceId, guestId) {
    return await this.makeRequest(`/spaces/${spaceId}/guests/${guestId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Send custom invitation
   */
  async sendInvitation(invitationConfig) {
    return await this.makeRequest('/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationConfig)
    });
  }

  /**
   * Create webhook for real-time events
   */
  async createWebhook(webhookConfig) {
    return await this.makeRequest('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhookConfig)
    });
  }

  /**
   * Utility: Delay function for rate limiting
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Custom Error Classes
 */
class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

class ValidationError extends APIError {
  constructor(message, data) {
    super(400, message);
    this.name = 'ValidationError';
    this.data = data;
  }
}

class PermissionError extends APIError {
  constructor(message) {
    super(403, message);
    this.name = 'PermissionError';
  }
}

class ConflictError extends APIError {
  constructor(message) {
    super(409, message);
    this.name = 'ConflictError';
  }
}

/**
 * Rate Limit Manager
 */
class RateLimitManager {
  constructor() {
    this.limits = {
      standard: { requests: 1000, window: 3600 }, // 1000/hour
      premium: { requests: 5000, window: 3600 },  // 5000/hour
      burst: { requests: 100, window: 60 }        // 100/minute
    };
    this.usage = new Map();
  }

  async checkLimit(tier = 'standard') {
    const now = Date.now();
    const limit = this.limits[tier];
    const windowStart = now - (limit.window * 1000);
    
    // Clean old entries
    for (const [timestamp] of this.usage) {
      if (timestamp < windowStart) {
        this.usage.delete(timestamp);
      }
    }
    
    if (this.usage.size >= limit.requests) {
      const oldestRequest = Math.min(...this.usage.keys());
      const resetTime = oldestRequest + (limit.window * 1000);
      const waitTime = resetTime - now;
      
      throw new RateLimitError(`Rate limit exceeded. Reset in ${waitTime}ms`);
    }
    
    this.usage.set(now, true);
    return true;
  }
}

class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  GatherAPIClient,
  APIError,
  ValidationError,
  PermissionError,
  ConflictError,
  RateLimitManager,
  RateLimitError
};
