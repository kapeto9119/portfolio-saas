#!/usr/bin/env node

/**
 * AI Content Enhancer Microservice
 * 
 * This service connects to the OpenAI API to provide content enhancement
 * features for portfolio content. It acts as a lightweight API server
 * that can be deployed independently from the main application.
 */

const express = require('express');
const cors = require('cors');
const { enhanceContent, generateBio, recommendSkills } = require('../ai/content-enhancer');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️ OPENAI_API_KEY environment variable is not set. AI features will not work correctly.');
}

// Health check endpoint
app.get('/api/ai/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Content Enhancer',
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Content enhancement endpoint
app.post('/api/ai/enhance', async (req, res) => {
  try {
    const { content, type, tone, userId } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Verify the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Rate limiting check - basic implementation
    // A more sophisticated rate limiting solution would be implemented in production
    const recentRequests = await prisma.aiRequest.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 3600000) // last hour
        }
      }
    });
    
    if (recentRequests >= 10) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Try again later.',
        retryAfter: '1 hour'
      });
    }
    
    // Log the request
    await prisma.aiRequest.create({
      data: {
        userId,
        requestType: type || 'enhance',
        promptLength: content.length
      }
    });
    
    // Process the request
    const enhancedContent = await enhanceContent(content, type, tone);
    
    // Return the enhanced content
    res.json({ enhancedContent });
    
  } catch (error) {
    console.error('Error enhancing content:', error);
    res.status(500).json({ error: 'Failed to enhance content' });
  }
});

// Bio generation endpoint
app.post('/api/ai/generate-bio', async (req, res) => {
  try {
    const { skills, experience, education, tone, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Verify the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Rate limiting check
    const recentRequests = await prisma.aiRequest.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 3600000)
        }
      }
    });
    
    if (recentRequests >= 10) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Try again later.',
        retryAfter: '1 hour'
      });
    }
    
    // Log the request
    await prisma.aiRequest.create({
      data: {
        userId,
        requestType: 'generate-bio',
        promptLength: JSON.stringify({ skills, experience, education }).length
      }
    });
    
    // Process the request
    const bioContent = await generateBio(skills, experience, education, tone);
    
    // Return the generated bio
    res.json({ bioContent });
    
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

// Skill recommendations endpoint
app.post('/api/ai/recommend-skills', async (req, res) => {
  try {
    const { jobTitle, currentSkills, experience, userId } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Verify the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Rate limiting check
    const recentRequests = await prisma.aiRequest.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 3600000)
        }
      }
    });
    
    if (recentRequests >= 10) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Try again later.',
        retryAfter: '1 hour'
      });
    }
    
    // Log the request
    await prisma.aiRequest.create({
      data: {
        userId,
        requestType: 'recommend-skills',
        promptLength: jobTitle.length + (currentSkills?.length || 0) + (experience?.length || 0)
      }
    });
    
    // Process the request
    const recommendedSkills = await recommendSkills(jobTitle, currentSkills, experience);
    
    // Return the recommended skills
    res.json({ recommendedSkills });
    
  } catch (error) {
    console.error('Error recommending skills:', error);
    res.status(500).json({ error: 'Failed to recommend skills' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ AI Content Enhancer microservice running on port ${port}`);
  console.log(`💡 API endpoints available:`);
  console.log(`   - GET  /api/ai/health`);
  console.log(`   - POST /api/ai/enhance`);
  console.log(`   - POST /api/ai/generate-bio`);
  console.log(`   - POST /api/ai/recommend-skills`);
}); 