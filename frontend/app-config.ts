import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Travel AI',
  pageTitle: 'Travel Ai Voice Agent',
  pageDescription: 'A voice agent built with Travel AI',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

 
  accent: '#002cf2',
  logo: 'https://img.freepik.com/premium-vector/travel-agency-logo-vector-white-background_1277164-7693.jpg',
  logoDark: 'https://img.freepik.com/premium-vector/travel-agency-logo-vector-white-background_1277164-7693.jpg',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',

  agentName: undefined,
};
