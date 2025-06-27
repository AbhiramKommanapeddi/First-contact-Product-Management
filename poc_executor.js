#!/usr/bin/env node

/**
 * First Contact Gather.Town POC Executor
 * 
 * This script executes the complete proof-of-concept for FC's guest list
 * implementation, including:
 * - Creating a branded FC remote office space
 * - Adding contact@firstcontact.lgbt as moderator
 * - Configuring safety and community features
 * - Generating comprehensive implementation report
 */

const FCGuestManager = require('./fc_guest_manager');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

class POCExecutor {
  constructor() {
    this.fcManager = null;
    this.pocId = uuidv4();
    this.startTime = Date.now();
    this.results = {
      success: false,
      space: null,
      fcContact: null,
      report: null,
      errors: []
    };
  }

  /**
   * Execute complete POC workflow
   */
  async executePOC() {
    console.log('🚀 Starting First Contact Gather.Town POC');
    console.log('=' .repeat(60));
    console.log(`POC ID: ${this.pocId}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('=' .repeat(60));

    try {
      // Step 1: Validate environment and initialize
      await this.validateEnvironment();
      
      // Step 2: Initialize FC Guest Manager
      await this.initializeManager();
      
      // Step 3: Create FC Remote Office
      const space = await this.createRemoteOffice();
      this.results.space = space;
      
      // Step 4: Add contact@firstcontact.lgbt as moderator
      const fcContact = await this.addFCContact(space.id);
      this.results.fcContact = fcContact;
      
      // Step 5: Verify implementation
      await this.verifyImplementation(space.id);
      
      // Step 6: Generate comprehensive report
      const report = await this.generateReport();
      this.results.report = report;
      
      // Step 7: Display success summary
      this.displaySuccessSummary();
      
      this.results.success = true;
      return this.results;
      
    } catch (error) {
      await this.handleError(error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Validate environment configuration
   */
  async validateEnvironment() {
    console.log('🔍 Validating environment configuration...');
    
    const requiredEnvVars = [
      'GATHER_API_KEY',
      'FC_CONTACT_EMAIL'
    ];
    
    const missing = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(process.env.FC_CONTACT_EMAIL)) {
      throw new Error('FC_CONTACT_EMAIL is not a valid email address');
    }
    
    console.log('✅ Environment validation passed');
  }

  /**
   * Initialize FC Guest Manager
   */
  async initializeManager() {
    console.log('⚙️ Initializing FC Guest Manager...');
    
    try {
      this.fcManager = new FCGuestManager(process.env.GATHER_API_KEY);
      console.log('✅ FC Guest Manager initialized successfully');
    } catch (error) {
      throw new Error(`Failed to initialize FC Guest Manager: ${error.message}`);
    }
  }

  /**
   * Create FC Remote Office space
   */
  async createRemoteOffice() {
    console.log('🏢 Creating FC Remote Office space...');
    
    try {
      const space = await this.fcManager.createFCRemoteOffice();
      
      console.log('✅ Remote office created successfully!');
      console.log(`   Space ID: ${space.id}`);
      console.log(`   Space URL: ${space.url}`);
      console.log(`   Capacity: ${space.capacity} users`);
      
      return space;
      
    } catch (error) {
      throw new Error(`Failed to create remote office: ${error.message}`);
    }
  }

  /**
   * Add contact@firstcontact.lgbt as moderator
   */
  async addFCContact(spaceId) {
    console.log('👤 Adding contact@firstcontact.lgbt as moderator...');
    
    try {
      const result = await this.fcManager.addFCContactAsModerator(spaceId);
      
      console.log('✅ FC contact added as moderator successfully!');
      console.log(`   Email: ${process.env.FC_CONTACT_EMAIL}`);
      console.log(`   Role: moderator`);
      console.log(`   Permissions: Full moderator access`);
      console.log(`   Invitation: Sent successfully`);
      
      return result;
      
    } catch (error) {
      throw new Error(`Failed to add FC contact: ${error.message}`);
    }
  }

  /**
   * Verify implementation completeness
   */
  async verifyImplementation(spaceId) {
    console.log('🔎 Verifying implementation...');
    
    try {
      // Verify space exists and is accessible
      const spaceDetails = await this.fcManager.gatherApi.getSpace(spaceId);
      if (!spaceDetails) {
        throw new Error('Space verification failed');
      }
      
      // Verify guest list contains FC contact
      const guestList = await this.fcManager.gatherApi.getGuestList(spaceId);
      const fcGuest = guestList.guests?.find(
        guest => guest.email === process.env.FC_CONTACT_EMAIL
      );
      
      if (!fcGuest) {
        throw new Error('FC contact not found in guest list');
      }
      
      if (fcGuest.role !== 'moderator') {
        throw new Error('FC contact does not have moderator role');
      }
      
      console.log('✅ Implementation verification passed');
      console.log(`   Space accessible: Yes`);
      console.log(`   FC contact in guest list: Yes`);
      console.log(`   Moderator permissions: Confirmed`);
      
    } catch (error) {
      throw new Error(`Verification failed: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive implementation report
   */
  async generateReport() {
    console.log('📊 Generating implementation report...');
    
    try {
      const report = await this.fcManager.generateImplementationReport(
        this.results.space,
        this.results.fcContact
      );
      
      // Add POC-specific metadata
      report.pocExecution = {
        pocId: this.pocId,
        executionTime: Date.now() - this.startTime,
        executor: 'FC Product Management Team',
        environment: process.env.NODE_ENV || 'development',
        apiVersion: 'v2',
        clientVersion: '1.0.0'
      };
      
      console.log('✅ Implementation report generated');
      return report;
      
    } catch (error) {
      console.warn('⚠️ Report generation failed:', error.message);
      return null;
    }
  }

  /**
   * Display success summary
   */
  displaySuccessSummary() {
    const executionTime = Date.now() - this.startTime;
    const minutes = Math.floor(executionTime / 60000);
    const seconds = Math.floor((executionTime % 60000) / 1000);
    
    console.log('\n🎉 POC EXECUTION SUCCESSFUL!');
    console.log('=' .repeat(60));
    console.log(`✅ Remote Office Created: ${this.results.space?.url}`);
    console.log(`✅ FC Contact Added: ${process.env.FC_CONTACT_EMAIL}`);
    console.log(`✅ Moderator Permissions: Granted`);
    console.log(`✅ Safety Features: Configured`);
    console.log(`✅ Invitation: Sent successfully`);
    console.log(`⏱️ Total Execution Time: ${minutes}m ${seconds}s`);
    console.log('=' .repeat(60));
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Check email for invitation from Gather.Town');
    console.log('2. Click invitation link to access the space');
    console.log('3. Test moderator controls and features');
    console.log('4. Document user experience');
    console.log('5. Share feedback with product team');
    
    console.log('\n💡 IMPORTANT NOTES:');
    console.log('• Invitation may take 1-2 minutes to arrive');
    console.log('• Check spam folder if not received');
    console.log('• Space URL is also available above for direct access');
    console.log('• All moderator permissions are pre-configured');
    
    console.log('\n📞 SUPPORT:');
    console.log('• Technical issues: tech-support@firstcontact.lgbt');
    console.log('• Product questions: product@firstcontact.lgbt');
    console.log('• General support: contact@firstcontact.lgbt');
  }

  /**
   * Handle errors gracefully
   */
  async handleError(error) {
    console.error('\n❌ POC EXECUTION FAILED');
    console.error('=' .repeat(60));
    console.error(`Error: ${error.message}`);
    console.error(`POC ID: ${this.pocId}`);
    console.error(`Execution Time: ${Date.now() - this.startTime}ms`);
    
    this.results.errors.push({
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack
    });
    
    // Attempt to provide helpful troubleshooting
    console.error('\n🔧 TROUBLESHOOTING:');
    
    if (error.message.includes('API key')) {
      console.error('• Verify GATHER_API_KEY is set correctly in .env file');
      console.error('• Check API key permissions in Gather.Town dashboard');
    }
    
    if (error.message.includes('rate limit')) {
      console.error('• API rate limit exceeded - wait and retry');
      console.error('• Consider upgrading Gather.Town plan for higher limits');
    }
    
    if (error.message.includes('permission')) {
      console.error('• Verify API key has sufficient permissions');
      console.error('• Check account status and plan limits');
    }
    
    console.error('\n📧 For additional support, contact: tech-support@firstcontact.lgbt');
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    console.log('\n🧹 Cleaning up resources...');
    
    // Log final status
    const status = this.results.success ? 'SUCCESS' : 'FAILED';
    console.log(`POC Status: ${status}`);
    
    // Save results to file for later analysis
    if (process.env.NODE_ENV !== 'test') {
      await this.saveResultsToFile();
    }
  }

  /**
   * Save results to file for analysis
   */
  async saveResultsToFile() {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const resultsFile = path.join(__dirname, `poc_results_${this.pocId}.json`);
      await fs.writeFile(resultsFile, JSON.stringify(this.results, null, 2));
      
      console.log(`📄 Results saved to: ${resultsFile}`);
    } catch (error) {
      console.warn('⚠️ Failed to save results file:', error.message);
    }
  }
}

/**
 * CLI execution
 */
async function main() {
  const executor = new POCExecutor();
  
  try {
    await executor.executePOC();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = POCExecutor;
