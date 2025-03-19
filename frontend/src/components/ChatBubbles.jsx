import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatBubbles = ({ sender, text }) => {
  const isUser = sender === 'User';

  const renderMessageContent = (message) => {
    const parts = [];
    const lines = message.split('\n');

    if (isUser) {
      // User: Always use plain text
      lines.forEach((line, index) => {
        parts.push(
          <p key={`text-${index}`} className="mb-1">
            {line}
          </p>
        );
      });
    } else {
      // Bot: Use SyntaxHighlighter for code blocks
      let currentCode = [];
      let inCodeBlock = false;
      let codeLanguage = 'text';

      lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
          if (inCodeBlock) {
            parts.push(
              <SyntaxHighlighter
                key={`code-${index}`}
                language={codeLanguage}
                style={materialDark}
                className="my-2 rounded-lg text-sm"
              >
                {currentCode.join('\n')}
              </SyntaxHighlighter>
            );
            currentCode = [];
            inCodeBlock = false;
            codeLanguage = 'text';
          } else {
            inCodeBlock = true;
            const languageMatch = line.match(/```(\w+)/);
            codeLanguage = languageMatch ? languageMatch[1] : 'text';
          }
        } else if (inCodeBlock) {
          currentCode.push(line);
        } else {
          parts.push(
            <p key={`text-${index}`} className="mb-1">
              {line}
            </p>
          );
        }
      });

      if (inCodeBlock && currentCode.length > 0) {
        parts.push(
          <SyntaxHighlighter
            key="code-end"
            language={codeLanguage}
            style={materialDark}
            className="my-2 rounded-lg text-sm"
          >
            {currentCode.join('\n')}
          </SyntaxHighlighter>
        );
      }
    }

    return parts.length > 0 ? parts : <p>{message}</p>;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${
          isUser
            ? 'bg-blue-500 text-white max-w-xs md:max-w-lg lg:max-w-2xl'
            : 'bg-gray-300 text-black max-w-xs md:max-w-xl lg:max-w-5xl'
        } p-3 rounded-lg mb-1 break-words text-sm`}
      >
        <strong className="text-base">{sender}:</strong>
        {renderMessageContent(text)}
      </div>
    </div>
  );
};

export default ChatBubbles;
