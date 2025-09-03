const userService = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const user = await userService.findByIdWithoutPassword(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

async function checkAndResetUsage(user) {
  if (['starter', 'pro', 'unlimited'].includes(user.subscriptionTier)) {
    const now = new Date();
    const lastReset = user.lastReset ? user.lastReset.toDate() : new Date();
    const last = new Date(lastReset);
    if (now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear()) {
      await userService.update(user.id, {
        usageCount: 0,
        lastReset: now
      });
      user.usageCount = 0;
      user.lastReset = now;
    }
  }
}

const canOptimize = (user) => {
  if (user.subscriptionTier === 'unlimited') return true;
  return user.usageCount < user.maxUsage;
};

const optimizePrompt = async (req, res) => {
  try {
    const user = await userService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await checkAndResetUsage(user);
    if (!canOptimize(user)) return res.status(403).json({ message: 'Usage limit reached' });

    const {
      mode,
      idea,
      context: { background, industry, audience },
      outputPrefs: { format, tone, length },
      specific,
      advanced,
      taskDecomp,
      agentCaps,
      workflowParams,
      advancedAgent,
      imageParams,
      videoParams
    } = req.body;

    let optimized;
    if (mode === 'llm-prompt') {
      optimized = `
You are ${advanced.perspective || 'an AI assistant'}, adopting a ${advanced.reasoning || 'step-by-step'} reasoning style.

Context and Background: ${background}
Industry/Domain: ${industry}
Target Audience: ${audience}

Task: ${idea}

Specific Requirements: ${specific.requirements || ''}
Examples of desired output: ${specific.examples || ''}
Special considerations: ${specific.considerations || ''}

Output Preferences:
- Format: ${format}
- Tone: ${tone}
- Length: ${length}

Quality Assurance: ${advanced.quality || ''}
      `;
    } else if (mode === 'image-creation') {
      optimized = `
Create an image with the following specifications:

Subject/Concept: ${idea}

Art Style: ${imageParams.style || 'unspecified'}
Dimensions: ${imageParams.dimensions || 'unspecified'}
Quality Level: ${imageParams.quality || 'unspecified'}

Visual Context:
- Background: ${background}
- Industry/Domain: ${industry}
- Target Audience: ${audience}

Detailed Requirements:
- Reference Images/Artists: ${imageParams.referenceImages || 'none specified'}
- Color Scheme: ${imageParams.colorScheme || 'natural colors'}
- Lighting Style: ${imageParams.lighting || 'natural lighting'}
- Composition: ${imageParams.composition || 'balanced composition'}

Additional Context: ${specific.requirements || 'none'}
      `;
    } else if (mode === 'video') {
      optimized = `
Create a video with the following specifications:

Video Type: ${videoParams.type === 'txt2vid' ? 'Text to Video' : 'Image to Video'}
Content Description: ${idea}

Technical Specifications:
- Duration: ${videoParams.duration || 'unspecified'}
- Frame Rate: ${videoParams.frameRate || 'unspecified'}
- Resolution: ${videoParams.resolution || 'unspecified'}
- Motion Style: ${videoParams.motionStyle || 'smooth'}

${videoParams.type === 'img2vid' ? `Source Image: ${videoParams.sourceImage || 'unspecified'}` : ''}

Audio/Music: ${videoParams.audioDescription || 'appropriate background music'}

Context and Background: ${background}
Industry/Domain: ${industry}
Target Audience: ${audience}

Additional Requirements: ${specific.requirements || 'none'}
      `;
    } else {
      // Agentic mode
      const systemPrompt = `You are an advanced AI agent designed to handle complex tasks in the ${industry} domain for ${audience}. Background: ${background}.
Goal: ${idea}
Capabilities: Tools - ${agentCaps.tools || ''}; Permissions - ${agentCaps.permissions || ''}; Error Handling - ${agentCaps.errorHandling || ''}.
Memory and State Management: ${workflowParams.memory || ''}.
`;

      const workflow = `Task Decomposition:
Sub-tasks: ${taskDecomp.subtasks || ''}
Dependencies: ${taskDecomp.dependencies || ''}
Decision Points: ${taskDecomp.decisionPoints || ''}

Workflow Parameters:
Success Criteria: ${workflowParams.successCriteria || ''}
Termination Conditions: ${workflowParams.termination || ''}
Human Intervention Points: ${workflowParams.humanPoints || ''}

Advanced Settings:
Multi-agent Coordination: ${advancedAgent.multiAgent || ''}
Feedback Loops: ${advancedAgent.feedback || ''}
Monitoring: ${advancedAgent.monitoring || ''}
      `;

      optimized = {
        systemPrompt,
        workflow,
        tools: agentCaps.tools || '',
        guidelines: 'Implement as per specifications.'
      };
    }

    user.usageCount += 1;
    await userService.update(user.id, { usageCount: user.usageCount });
    res.json({ optimized });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, optimizePrompt }; 