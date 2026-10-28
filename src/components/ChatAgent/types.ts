export type ChatActionType = 
  | 'FILTER_CATALOG'
  | 'OPEN_BOOKING'
  | 'OPEN_CUSTOM_REQUEST'
  | 'OPEN_WHATSAPP'
  | 'SCROLL_TO_CATALOG';

export interface ChatAction {
  type: ChatActionType;
  payload?: any;
}

export interface QuickReply {
  id: string;
  label: string;
  icon?: string;
  nextNodeId?: string;
  action?: ChatAction;
}

export interface ChatNode {
  id: string;
  botMessages: string[];
  quickReplies?: QuickReply[];
  action?: ChatAction;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  action?: ChatAction;
  quickReplies?: QuickReply[];
}
