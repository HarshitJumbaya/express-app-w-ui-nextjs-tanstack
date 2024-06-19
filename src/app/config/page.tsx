"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import '../css/style.css';

interface ConfigData {
  key: string;
  value: string;
}
 
const fetchConfig = async (): Promise<ConfigData> => {
  const response = await fetch('/api/config');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const updateConfig = async (newConfig: ConfigData): Promise<ConfigData> => {
  const response = await fetch('/api/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newConfig),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  fetchConfig();
  return response.json();
};

const ConfigEditor: React.FC = () => {
  useEffect(() => {
    fetchConfig();
  }, []);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [configInput, setConfigInput] = useState<string>('');

  // const { data: configData, error, isLoading } = useQuery<ConfigData, Error>(['config'], fetchConfig);
  const { data: configData, error, isLoading } = useQuery<ConfigData, Error>({
    queryKey: ['config'],
    queryFn: fetchConfig,
  });
  
  const mutation = useMutation({
    mutationFn: updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['config']}); 
      alert('JSON data updated successfully!');
    },
    onError: (error) => {
      // Error actions
      console.error('Failed to update configuration:', error);
      alert('Failed to update configuration. Check console.');
    },
  });


  const handleUpdateConfig = () => {
    try {
      const parsedConfig = JSON.parse(configInput);
      mutation.mutate(parsedConfig);
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="container">
      <h1>JSON File Editor</h1>
      <div id="configDisplay">
        <h2>Current Configuration</h2>
        <pre id="configData">{JSON.stringify(configData, null, 2)}</pre>
      </div>
      <div id="configForm">
        <h2>Update Configuration</h2>
        <label htmlFor="configInput">New data (JSON format):</label>
        <textarea
          id="configInput"
          placeholder="Enter JSON here..."
          value={configInput}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setConfigInput(e.target.value)}
        ></textarea>
        <button onClick={handleUpdateConfig}>Update Configuration</button>
        <button onClick={() => router.push("/")}>Home</button>
      </div> 
    </div>
  );
};

export default ConfigEditor;
