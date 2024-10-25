import { Button, TextInput } from 'flowbite-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSend = async (e) => {
    e.preventDefault();

    const chatRoute = 'http://127.0.0.1:5000/gpt3';
    const userInput = input.trim();
    if (!userInput) return;

    // Store user input before clearing it
    const currentInput = userInput;

    // Add user message
    setMessages((prev) => [...prev, { text: currentInput, sender: 'user', id: Date.now() }]);

    setIsLoading(true);
    setInput(''); // Clear input after storing it

    try {
      const response = await fetch(chatRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      const botMessageId = Date.now() + 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            botMessage += content;

            // Update the bot's message in real-time
            setMessages((prev) => {
              const newMessages = [...prev];
              const botMessageIndex = newMessages.findIndex((msg) => msg.id === botMessageId);

              if (botMessageIndex === -1) {
                // Add the bot message for the first time
                newMessages.push({
                  text: botMessage,
                  sender: 'bot',
                  id: botMessageId,
                });
              } else {
                // Update the bot's existing message
                newMessages[botMessageIndex].text = botMessage;
              }
              return newMessages;
            });

            // Add a small delay for smoother streaming
            await sleep(50); // 50ms delay between updates
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, there was an error processing your request.',
          sender: 'bot',
          id: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for messages
  const messageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for text streaming
  const textVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <h1 className="text-4xl pt-10 text-center font-bold">GIZBOT LAB</h1>
      <hr className="my-4" />
      <div className="flex-grow bg-gray-100 rounded-xl flex flex-col p-4 overflow-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`mb-4 p-2 px-6 max-w-3/4 w-fit rounded-lg ${message.sender === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 text-black self-start'
                }`}
            >
              <motion.span variants={textVariants} initial="initial" animate="animate">
                {message.text}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 bg-gray-100 flex pb-8">
        <TextInput
          type="text"
          color="dark"
          className="w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          type="submit"
          className={`ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}

export default App;
