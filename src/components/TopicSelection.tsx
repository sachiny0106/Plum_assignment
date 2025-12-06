import React, { useState } from 'react';

interface TopicSelectionProps {
  onSelectTopic: (topic: string) => void;
}

const SUGGESTED_TOPICS = ['Tech Trends', 'Wellness', 'History', 'Space Exploration', 'Pop Culture'];

export const TopicSelection: React.FC<TopicSelectionProps> = ({ onSelectTopic }) => {
  const [customTopic, setCustomTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectTopic(customTopic.trim());
    }
  };

  return (
    <div className="card">
      <h1>AI Knowledge Quiz</h1>
      <p>Choose a topic or enter your own to generate a quiz.</p>
      
      <div className="topic-grid">
        {SUGGESTED_TOPICS.map((topic) => (
          <button key={topic} onClick={() => onSelectTopic(topic)}>
            {topic}
          </button>
        ))}
      </div>

      <div className="divider">OR</div>

      <form onSubmit={handleSubmit} className="custom-topic-form">
        <input
          type="text"
          placeholder="Enter any topic..."
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          className="topic-input"
        />
        <button type="submit" disabled={!customTopic.trim()}>
          Generate Quiz
        </button>
      </form>
    </div>
  );
};
