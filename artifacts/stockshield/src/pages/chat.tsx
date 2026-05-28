import { Shell } from "@/components/layout/Shell";
import { useState, useRef, useEffect } from "react";
import { useListConversations, useCreateConversation, useDeleteConversation, useListMessages, getListConversationsQueryKey, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Send, Bot, User, Loader2, Trash2, Sparkles, Shield, TrendingUp, AlertTriangle, BarChart2 } from "lucide-react";
import type { ChatMessage } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: "Analyze GME", prompt: "Analyze GameStop (GME) for signs of a pump and dump scheme. What are the key red flags?" },
  { icon: AlertTriangle, label: "Explain Wash Trading", prompt: "Explain what wash trading is and how I can detect it as a retail investor." },
  { icon: Shield, label: "Insider Activity", prompt: "How do I spot insider trading signals before they become public news?" },
  { icon: BarChart2, label: "Volume Spike Check", prompt: "What does an unusual volume spike typically indicate, and when should I be worried?" },
];

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-5 px-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const queryClient = useQueryClient();
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: convLoading } = useListConversations();
  const createConv = useCreateConversation();
  const deleteConv = useDeleteConversation();

  const { data: historyMessages = [], isLoading: messagesLoading } = useListMessages(activeConvId!, {
    query: { enabled: !!activeConvId, queryKey: getListMessagesQueryKey(activeConvId!) }
  });

  const [streamedMessage, setStreamedMessage] = useState("");

  useEffect(() => {
    if (conversations?.length && !activeConvId) {
      setActiveConvId(conversations[0].id);
    } else if (conversations && conversations.length === 0) {
      setActiveConvId(null);
    }
  }, [conversations, activeConvId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historyMessages, streamedMessage, isStreaming]);

  const handleCreate = () => {
    createConv.mutate({ data: { title: "New Analysis" } }, {
      onSuccess: (newConv) => {
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        setActiveConvId(newConv.id);
      }
    });
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConv.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        if (activeConvId === id) setActiveConvId(null);
      }
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeConvId || isStreaming) return;
    const userMsg = text.trim();
    setInput("");
    setIsStreaming(true);
    setStreamedMessage("");

    const tempMsg: ChatMessage = {
      id: Date.now(),
      conversationId: activeConvId,
      role: "user",
      content: userMsg,
      createdAt: new Date().toISOString()
    };
    queryClient.setQueryData(getListMessagesQueryKey(activeConvId), (old: ChatMessage[] = []) => [...old, tempMsg]);

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${BASE}/api/chat/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg }),
      });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.done) break;
              if (data.content) { fullResponse += data.content; setStreamedMessage(fullResponse); }
            } catch { /* ignore parse errors */ }
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(activeConvId) });
    } catch {
      /* ignore */
    } finally {
      setIsStreaming(false);
      setStreamedMessage("");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (!activeConvId) {
      createConv.mutate({ data: { title: prompt.slice(0, 40) + "..." } }, {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          setActiveConvId(newConv.id);
          setTimeout(() => sendMessage(prompt), 100);
        }
      });
    } else {
      sendMessage(prompt);
    }
  };

  const allMessages = historyMessages;

  return (
    <Shell>
      <div className="flex h-[calc(100vh-10rem)] rounded-2xl border border-border/50 overflow-hidden bg-card/20 backdrop-blur-sm">

        {/* Conversations sidebar */}
        <div className="w-56 md:w-64 border-r border-border/50 bg-black/20 flex flex-col shrink-0">
          <div className="p-3 border-b border-border/50">
            <Button onClick={handleCreate} disabled={createConv.isPending} className="w-full h-9 text-sm" size="sm">
              {createConv.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Plus className="w-3.5 h-3.5 mr-1.5" />}
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1 p-2">
            {convLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-0.5">
                {conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left px-2.5 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      activeConvId === conv.id ? "bg-primary/15 text-primary font-medium border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/20 rounded"
                      onClick={(e) => handleDelete(conv.id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12 gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">ShieldBot AI</h2>
                <p className="text-sm text-muted-foreground max-w-md">Your intelligent market analyst. Ask me about suspicious trading patterns, fraud risks, and how to protect your investments.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_PROMPTS.map((qp) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={qp.label}
                      onClick={() => handleQuickPrompt(qp.prompt)}
                      disabled={createConv.isPending}
                      className="flex items-center gap-2.5 p-3 rounded-xl text-left text-xs border border-border/50 bg-black/20 hover:bg-primary/10 hover:border-primary/40 transition-all group"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-foreground/80 group-hover:text-foreground">{qp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5" ref={scrollRef}>
                {messagesLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-primary/40" />
                  </div>
                ) : (
                  <>
                    {allMessages.length === 0 && !isStreaming && (
                      <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-8">
                        <Sparkles className="w-8 h-8 text-primary/40" />
                        <p className="text-sm text-muted-foreground">Start the conversation — ask me anything about this analysis.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {QUICK_PROMPTS.map((qp) => (
                            <button
                              key={qp.label}
                              onClick={() => handleQuickPrompt(qp.prompt)}
                              className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-black/20 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
                            >
                              {qp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <AnimatePresence initial={false}>
                      {allMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            msg.role === "user" ? "bg-secondary/20 text-secondary" : "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_-4px_hsl(var(--primary))]"
                          }`}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-secondary/10 border border-secondary/20 rounded-tr-sm"
                              : "bg-black/40 border border-border/40 rounded-tl-sm"
                          }`}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isStreaming && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_-4px_hsl(var(--primary))]">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="max-w-[75%] p-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-black/40 border border-border/40">
                          {streamedMessage ? (
                            <>
                              {streamedMessage}
                              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle rounded-sm" />
                            </>
                          ) : (
                            <TypingDots />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-3 md:p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-2 items-end max-w-4xl mx-auto">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask ShieldBot anything about fraud, risks, or patterns... (Enter to send)"
                    className="resize-none min-h-[44px] max-h-32 bg-black/40 border-border/50 focus-visible:ring-primary/50 text-sm py-3"
                    rows={1}
                    disabled={isStreaming}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isStreaming} className="h-11 w-11 shrink-0 shadow-[0_0_16px_-4px_hsl(var(--primary))]">
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
