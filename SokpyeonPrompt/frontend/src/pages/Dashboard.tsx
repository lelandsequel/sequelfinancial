import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  const { token } = context;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/profile', { headers: { 'x-auth-token': token } });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-3xl">Welcome to PromptCraft Pro Dashboard</h1>
      {profile && (
        <div>
          <p>Tier: {profile.subscriptionTier}</p>
          <p>Usage: {profile.usageCount} / {profile.maxUsage === Infinity ? 'Unlimited' : profile.maxUsage}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 