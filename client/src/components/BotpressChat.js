// BotpressChat.jsx
import React, { useEffect } from 'react';

const BotpressChat = () => {
  useEffect(() => {
    // Load Botpress webchat script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/02/07/20250102072607-YCT1UBYH.json';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.botpressWebChat.init({
        // Replace these with your actual credentials from Botpress
        "botId": "YOUR_BOT_ID",
        "clientId": "YOUR_CLIENT_ID",
        
        // Basic configuration
        "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
        "messagingUrl": "https://messaging.botpress.cloud",
        
        // Customize the appearance
        "botName": "My Assistant",
        "botConversationDescription": "How can I help you today?",
        "backgroundColor": "#ffffff",
        "textColorOnBackground": "#666666",
        "foregroundColor": "#000000",
        "textColorOnForeground": "#ffffff",
        
        // Additional settings
        "useSessionStorage": true,
        "showConversationsButton": true,
        "enableReset": true,
        "showTimestamp": true
      });
    };

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return <div id="botpress-webchat" />;
};

export default BotpressChat;