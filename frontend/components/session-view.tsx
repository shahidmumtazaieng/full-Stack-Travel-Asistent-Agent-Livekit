'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
}

export const SessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();

  useDebugMode({
    enabled: process.env.NODE_END !== 'production',
  });

  async function handleSendMessage(message: string) {
    await send(message);
  }

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: (
              <p className="w-full">
                {reason}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="whitespace-nowrap underline"
                >
                  See quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 20_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'opacity-0',
        // prevent page scrollbar
        // when !chatOpen due to 'translate-y-20'
        !chatOpen && 'max-h-svh overflow-hidden'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 -z-10"></div>
      
      <ChatMessageView
        className={cn(
          'mx-auto min-h-svh w-full max-w-2xl px-4 pt-32 pb-40 transition-[opacity,translate] duration-300 ease-out md:px-0 md:pt-36 md:pb-48',
          chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-20 opacity-0'
        )}
      >
        <div className="space-y-4 whitespace-pre-wrap">
          <AnimatePresence>
            {messages.map((message: ReceivedChatMessage) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 1, height: 'auto', translateY: 0.001 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <ChatEntry hideName key={message.id} entry={message} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ChatMessageView>

      <div className="bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent fixed top-0 right-0 left-0 h-32 md:h-36 -z-10">
        <div className="absolute bottom-0 left-0 h-12 w-full translate-y-full bg-gradient-to-b from-white/50 to-transparent dark:from-gray-900/50"></div>
      </div>

      <MediaTiles chatOpen={chatOpen} />

      <div className="fixed right-0 bottom-0 left-0 z-50 px-4 pt-3 pb-4 md:px-12 md:pb-12">
        <motion.div
          key="control-bar"
          initial={{ opacity: 0, translateY: '100%' }}
          animate={{
            opacity: sessionStarted ? 1 : 0,
            translateY: sessionStarted ? '0%' : '100%',
          }}
          transition={{ duration: 0.3, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
        >
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            {appConfig.isPreConnectBufferEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: sessionStarted && messages.length === 0 ? 1 : 0,
                  transition: {
                    ease: 'easeIn',
                    delay: messages.length > 0 ? 0 : 0.8,
                    duration: messages.length > 0 ? 0.2 : 0.5,
                  },
                }}
                aria-hidden={messages.length > 0}
                className={cn(
                  'absolute inset-x-0 -top-14 text-center',
                  sessionStarted && messages.length === 0 && 'pointer-events-none'
                )}
              >
                <p className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-sm font-semibold">
                  Agent is listening, ask it a question
                </p>
              </motion.div>
            )}

            <AgentControlBar
              capabilities={capabilities}
              onChatOpenChange={setChatOpen}
              onSendMessage={handleSendMessage}
              onDisconnect={async () => {
                // Send transcript to n8n webhook on disconnect
                if (messages.length > 0) {
                  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
                  
                  // Only attempt to send if webhook URL is properly configured
                  if (webhookUrl && webhookUrl !== 'YOUR_N8N_WEBHOOK_URL') {
                    try {
                      const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ transcript: messages }),
                      });
                      
                      if (!response.ok) {
                        console.error('Failed to send transcript to webhook:', response.status, response.statusText);
                      } else {
                        console.log('Transcript successfully sent to webhook');
                      }
                    } catch (error) {
                      console.error('Error sending transcript to webhook:', error);
                    }
                  } else {
                    console.log('Webhook URL not configured, skipping transcript send');
                  }
                }
              }}
            />
          </div>
          <div className="bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent absolute top-0 left-0 h-12 w-full -translate-y-full"></div>
        </motion.div>
      </div>
    </section>
  );
};