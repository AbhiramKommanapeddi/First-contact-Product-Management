# Workspace Setup Guide

## Gather.Town Remote Office Configuration for First Contact

### Quick Setup Instructions

#### Prerequisites

1. **Gather.Town Account**: Sign up at [gather.town](https://gather.town) (free plan sufficient)
2. **API Access**: Generate API key from developer settings
3. **Node.js**: Version 16+ for running the POC scripts

#### Step 1: Account Setup

1. Go to gather.town and create a free account
2. Navigate to Account Settings > Developer
3. Generate a new API key
4. Save the API key securely

#### Step 2: Clone and Configure

```bash
# Navigate to the technical POC directory
cd "c:\Users\abhik\Downloads\First contact Product Management\implementation\technical_poc"

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env file with your Gather.Town API key
```

#### Step 3: Execute POC

```bash
# Run the proof of concept
npm run poc
```

#### Step 4: Verify Results

1. Check console output for success confirmation
2. Verify contact@firstcontact.lgbt receives invitation email
3. Access the created remote office space using the provided URL

### Manual Workspace Setup (Alternative)

If you prefer to set up the workspace manually through the Gather.Town interface:

#### 1. Create New Space

- Log into your Gather.Town account
- Click "Create Space"
- Choose "Office" template
- Name: "First Contact Remote Office"
- Set capacity to 50 users
- Make space private

#### 2. Customize Space

- Add FC logo and branding
- Set brand colors (#FF6B35)
- Configure welcome message
- Set up different zones (collaboration, quiet work, social)

#### 3. Add Guest List

- Go to Space Settings > Guest List
- Add contact@firstcontact.lgbt
- Set role to "Moderator"
- Grant full permissions
- Send invitation

#### 4. Configure Safety

- Enable community guidelines
- Set moderation level to "Strict"
- Configure reporting system
- Add emergency contact: safety@firstcontact.lgbt

### Space Layout Recommendations

#### Zone 1: Entrance & Welcome Area

- Display community guidelines
- Welcome message with FC values
- Moderator contact information
- Help and support resources

#### Zone 2: Collaboration Areas

- Open workspace for team projects
- Shared whiteboards and tools
- Screen sharing capabilities
- Group discussion areas

#### Zone 3: Quiet Work Zones

- Individual focus areas
- Reduced audio/video interactions
- Private workspace options
- Minimal distractions

#### Zone 4: Social & Networking

- Casual conversation areas
- Community building activities
- Virtual coffee chat spaces
- Celebration and recognition zones

#### Zone 5: Private Meeting Rooms

- 1:1 conversation spaces
- Small group meeting rooms
- Leadership team areas
- Sensitive discussion rooms

### Guest List Management Best Practices

#### User Roles & Permissions

- **Moderators**: Full access, safety controls, space management
- **Members**: Regular community members with standard access
- **Guests**: Temporary access for specific events or meetings
- **Restricted**: Limited access for trial or probationary users

#### Invitation Process

1. **Pre-Screening**: Verify alignment with community values
2. **Custom Messages**: Include FC-specific welcome content
3. **Onboarding**: Provide orientation materials and support
4. **Follow-up**: Check in after first visit

#### Safety Protocols

- **Emergency Response**: Immediate escalation procedures
- **Incident Reporting**: Anonymous and direct reporting options
- **Moderation Training**: Regular updates for all moderators
- **Community Feedback**: Regular surveys and improvement cycles

### Troubleshooting Common Issues

#### API Connection Problems

- Verify API key is correct and active
- Check account permissions and plan limits
- Ensure network connectivity

#### Invitation Delivery Issues

- Check spam folders for invitation emails
- Verify email addresses are correct
- Use alternative contact methods if needed

#### Access and Permission Problems

- Confirm user has accepted invitation
- Verify role assignments are correct
- Check space privacy settings

#### Performance Issues

- Monitor concurrent user counts
- Check internet connection quality
- Consider upgrading plan for higher capacity

### Support Resources

#### Technical Support

- **API Documentation**: [Gather.Town Developer Docs](https://gather.town/api)
- **Community Forum**: Platform-specific troubleshooting
- **FC Tech Team**: tech-support@firstcontact.lgbt

#### Community Support

- **Onboarding Help**: community@firstcontact.lgbt
- **Safety Concerns**: safety@firstcontact.lgbt
- **General Questions**: contact@firstcontact.lgbt

#### Training Materials

- **User Guides**: Available in the docs folder
- **Video Tutorials**: Coming soon
- **Best Practices**: Documented in implementation guides

### Next Steps After Setup

1. **Test All Features**: Verify functionality works as expected
2. **Train Moderators**: Ensure team is comfortable with controls
3. **Gather Feedback**: Collect user experience insights
4. **Iterate and Improve**: Continuous refinement based on usage
5. **Scale Gradually**: Expand user base systematically

---

**Last Updated**: June 26, 2025  
**Setup Support**: tech-support@firstcontact.lgbt
