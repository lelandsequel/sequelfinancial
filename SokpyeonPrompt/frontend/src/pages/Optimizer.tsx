import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Optimizer() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  const { token } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const [mode, setMode] = useState('llm-prompt');
  const [idea, setIdea] = useState('');
  const [background, setBackground] = useState('');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  // Single mode
  const [requirements, setRequirements] = useState('');
  const [examples, setExamples] = useState('');
  const [considerations, setConsiderations] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [perspective, setPerspective] = useState('');
  const [quality, setQuality] = useState('');
  // Agentic mode
  const [subtasks, setSubtasks] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [decisionPoints, setDecisionPoints] = useState('');
  const [tools, setTools] = useState('');
  const [permissions, setPermissions] = useState('');
  const [errorHandling, setErrorHandling] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [termination, setTermination] = useState('');
  const [humanPoints, setHumanPoints] = useState('');
  const [memory, setMemory] = useState('');
  const [multiAgent, setMultiAgent] = useState('');
  const [feedback, setFeedback] = useState('');
  const [monitoring, setMonitoring] = useState('');
  // Image creation mode
  const [imageStyle, setImageStyle] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [imageQuality, setImageQuality] = useState('');
  const [referenceImages, setReferenceImages] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  const [lighting, setLighting] = useState('');
  const [composition, setComposition] = useState('');
  // Video mode
  const [videoType, setVideoType] = useState('txt2vid'); // txt2vid or img2vid
  const [duration, setDuration] = useState('');
  const [frameRate, setFrameRate] = useState('');
  const [resolution, setResolution] = useState('');
  const [motionStyle, setMotionStyle] = useState('');
  const [sourceImage, setSourceImage] = useState(''); // for img2vid
  const [audioDescription, setAudioDescription] = useState('');

  const [optimized, setOptimized] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      mode,
      idea,
      context: { background, industry, audience },
      outputPrefs: { format, tone, length },
      specific: { requirements, examples, considerations },
      advanced: { reasoning, perspective, quality },
      taskDecomp: { subtasks, dependencies, decisionPoints },
      agentCaps: { tools, permissions, errorHandling },
      workflowParams: { successCriteria, termination, humanPoints, memory },
      advancedAgent: { multiAgent, feedback, monitoring },
      imageParams: { style: imageStyle, dimensions, quality: imageQuality, referenceImages, colorScheme, lighting, composition },
      videoParams: { type: videoType, duration, frameRate, resolution, motionStyle, sourceImage, audioDescription }
    };
    try {
      const res = await axios.post('/api/user/optimize', data, { headers: { 'x-auth-token': token } });
      setOptimized(res.data.optimized);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">PromptCraft Pro Optimizer</h1>
      <form onSubmit={handleSubmit}>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="mb-4 p-2 border">
          <option value="llm-prompt">LLM Prompt</option>
          <option value="agentic">Agentic Workflow</option>
          <option value="image-creation">Image Creation</option>
          <option value="video">Video Generation</option>
        </select>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={
            mode === 'llm-prompt' ? 'Describe what you want to accomplish with AI...' :
            mode === 'agentic' ? 'Describe the complex task or workflow...' :
            mode === 'image-creation' ? 'Describe the image you want to create...' :
            'Describe the video content you want to generate...'
          }
          className="w-full p-2 border mb-4"
          rows={4}
        />
        {/* Universal fields */}
        <div className="mb-4">
          <label>Background</label>
          <textarea value={background} onChange={(e) => setBackground(e.target.value)} className="w-full p-2 border" />
        </div>
        <div className="mb-4">
          <label>Industry</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-2 border" />
        </div>
        <div className="mb-4">
          <label>Audience</label>
          <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full p-2 border" />
        </div>
        <div className="mb-4">
          <label>Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-2 border">
            <option value="">Select Format</option>
            <option value="essay">Essay</option>
            <option value="bullets">Bullet Points</option>
            <option value="numbered">Numbered List</option>
            <option value="paragraph">Paragraph</option>
            <option value="table">Table</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="code">Code/Script</option>
          </select>
        </div>
        <div className="mb-4">
          <label>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border">
            <option value="">Select Tone</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
            <option value="persuasive">Persuasive</option>
            <option value="educational">Educational</option>
            <option value="conversational">Conversational</option>
          </select>
        </div>
        <div className="mb-4">
          <label>Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full p-2 border">
            <option value="">Select Length</option>
            <option value="brief">Brief (1-2 sentences)</option>
            <option value="short">Short (1 paragraph)</option>
            <option value="medium">Medium (3-5 paragraphs)</option>
            <option value="detailed">Detailed (comprehensive)</option>
            <option value="concise">Concise (key points only)</option>
            <option value="comprehensive">Comprehensive (in-depth)</option>
          </select>
        </div>
        {mode === 'llm-prompt' && (
          <>
            <div className="mb-4">
              <label>Requirements</label>
              <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Examples</label>
              <textarea value={examples} onChange={(e) => setExamples(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Considerations</label>
              <textarea value={considerations} onChange={(e) => setConsiderations(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Reasoning Style</label>
              <input value={reasoning} onChange={(e) => setReasoning(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Perspective</label>
              <input value={perspective} onChange={(e) => setPerspective(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Quality Assurance</label>
              <textarea value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-2 border" />
            </div>
          </>
        )}
        {mode === 'agentic' && (
          <>
            <div className="mb-4">
              <label>Sub-tasks</label>
              <textarea value={subtasks} onChange={(e) => setSubtasks(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Dependencies</label>
              <textarea value={dependencies} onChange={(e) => setDependencies(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Decision Points</label>
              <textarea value={decisionPoints} onChange={(e) => setDecisionPoints(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Tools</label>
              <textarea value={tools} onChange={(e) => setTools(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Permissions</label>
              <textarea value={permissions} onChange={(e) => setPermissions(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Error Handling</label>
              <textarea value={errorHandling} onChange={(e) => setErrorHandling(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Success Criteria</label>
              <textarea value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Termination Conditions</label>
              <textarea value={termination} onChange={(e) => setTermination(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Human Intervention Points</label>
              <textarea value={humanPoints} onChange={(e) => setHumanPoints(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Memory Management</label>
              <textarea value={memory} onChange={(e) => setMemory(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Multi-agent Coordination</label>
              <textarea value={multiAgent} onChange={(e) => setMultiAgent(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Feedback Loops</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border" />
            </div>
            <div className="mb-4">
              <label>Monitoring</label>
              <textarea value={monitoring} onChange={(e) => setMonitoring(e.target.value)} className="w-full p-2 border" />
            </div>
          </>
        )}
        {mode === 'image-creation' && (
          <>
            <div className="mb-4">
              <label>Art Style</label>
              <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} className="w-full p-2 border">
                <option value="">Select Style</option>
                <option value="realistic">Realistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="anime">Anime</option>
                <option value="abstract">Abstract</option>
                <option value="minimalist">Minimalist</option>
                <option value="photorealistic">Photorealistic</option>
                <option value="digital-art">Digital Art</option>
                <option value="oil-painting">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Dimensions</label>
              <select value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full p-2 border">
                <option value="">Select Dimensions</option>
                <option value="512x512">Square (512x512)</option>
                <option value="1024x1024">Large Square (1024x1024)</option>
                <option value="1024x768">Landscape (1024x768)</option>
                <option value="768x1024">Portrait (768x1024)</option>
                <option value="1792x1024">Wide (1792x1024)</option>
                <option value="1024x1792">Tall (1024x1792)</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Quality Level</label>
              <select value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} className="w-full p-2 border">
                <option value="">Select Quality</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Reference Images/Artists</label>
              <textarea
                value={referenceImages}
                onChange={(e) => setReferenceImages(e.target.value)}
                placeholder="Describe reference images, artists, or visual influences..."
                className="w-full p-2 border"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label>Color Scheme</label>
              <input
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                placeholder="e.g., warm tones, monochromatic, vibrant colors..."
                className="w-full p-2 border"
              />
            </div>
            <div className="mb-4">
              <label>Lighting Style</label>
              <input
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                placeholder="e.g., dramatic, soft, natural, studio lighting..."
                className="w-full p-2 border"
              />
            </div>
            <div className="mb-4">
              <label>Composition</label>
              <input
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                placeholder="e.g., rule of thirds, centered, dynamic..."
                className="w-full p-2 border"
              />
            </div>
          </>
        )}
        {mode === 'video' && (
          <>
            <div className="mb-4">
              <label>Video Type</label>
              <select value={videoType} onChange={(e) => setVideoType(e.target.value)} className="w-full p-2 border">
                <option value="txt2vid">Text to Video</option>
                <option value="img2vid">Image to Video</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border">
                <option value="">Select Duration</option>
                <option value="5s">5 seconds</option>
                <option value="10s">10 seconds</option>
                <option value="15s">15 seconds</option>
                <option value="30s">30 seconds</option>
                <option value="60s">60 seconds</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Frame Rate</label>
              <select value={frameRate} onChange={(e) => setFrameRate(e.target.value)} className="w-full p-2 border">
                <option value="">Select Frame Rate</option>
                <option value="24fps">24 FPS (Cinematic)</option>
                <option value="30fps">30 FPS (Standard)</option>
                <option value="60fps">60 FPS (Smooth)</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-2 border">
                <option value="">Select Resolution</option>
                <option value="720p">HD (720p)</option>
                <option value="1080p">Full HD (1080p)</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Motion Style</label>
              <select value={motionStyle} onChange={(e) => setMotionStyle(e.target.value)} className="w-full p-2 border">
                <option value="">Select Motion Style</option>
                <option value="smooth">Smooth</option>
                <option value="dynamic">Dynamic</option>
                <option value="cinematic">Cinematic</option>
                <option value="fast-paced">Fast-paced</option>
                <option value="slow-motion">Slow Motion</option>
              </select>
            </div>
            {videoType === 'img2vid' && (
              <div className="mb-4">
                <label>Source Image Description</label>
                <textarea
                  value={sourceImage}
                  onChange={(e) => setSourceImage(e.target.value)}
                  placeholder="Describe the source image for img2vid..."
                  className="w-full p-2 border"
                  rows={3}
                />
              </div>
            )}
            <div className="mb-4">
              <label>Audio/Music Description</label>
              <textarea
                value={audioDescription}
                onChange={(e) => setAudioDescription(e.target.value)}
                placeholder="Describe the audio, music, or sound effects..."
                className="w-full p-2 border"
                rows={3}
              />
            </div>
          </>
        )}
        <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white">
          {loading ? 'Optimizing...' : 'Optimize'}
        </button>
      </form>
      {optimized && (
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Optimized Output</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-2">Original Idea</h3>
              <p className="bg-gray-50 p-3 rounded">{idea}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {mode === 'llm-prompt' ? 'Optimized Prompt' :
                 mode === 'agentic' ? 'Agentic Configuration' :
                 mode === 'image-creation' ? 'Image Generation Prompt' :
                 'Video Generation Prompt'}
              </h3>
              <div className="bg-gray-50 p-3 rounded">
                {(mode === 'llm-prompt' || mode === 'image-creation' || mode === 'video') ?
                  <pre className="whitespace-pre-wrap">{optimized}</pre> :
                  <pre className="whitespace-pre-wrap">{JSON.stringify(optimized, null, 2)}</pre>
                }
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const text = (mode === 'llm-prompt' || mode === 'image-creation' || mode === 'video') ?
                  optimized : JSON.stringify(optimized, null, 2);
                navigator.clipboard.writeText(text);
                alert('Copied to clipboard!');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => {
                const text = (mode === 'llm-prompt' || mode === 'image-creation' || mode === 'video') ?
                  optimized : JSON.stringify(optimized, null, 2);
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const extension = mode === 'agentic' ? 'json' : 'txt';
                a.download = `optimized-${mode.replace('-', '')}-${Date.now()}.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export as File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Optimizer; 