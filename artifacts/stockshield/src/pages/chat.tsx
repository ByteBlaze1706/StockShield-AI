import { Shell } from "@/components/layout/Shell";
import { useState, useRef, useEffect } from "react";
import { useListConversations, useCreateConversation, useDeleteConversation, useListMessages, getListConversationsQueryKey, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import type { ChatMessage } from "@workspace/api-client-react";

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
  }, [historyMessages, streamedMessage]);

  const handleCreate = () => {
    createConv.mutate({ data: { title: "New Analysis Request" } }, {
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConvId || isStreaming) return;
    
    const userMsg = input.trim();
    setInput("");
    setIsStreaming(true);
    setStreamedMessage("");

    // Optimistically update UI
    const tempMsg: ChatMessage = {
      id: Date.now(),
      conversationId: activeConvId,
      role: 'user',
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
              if (data.content) {
                fullResponse += data.content;
                setStreamedMessage(fullResponse);
              }
            } catch (err) {
              console.error("Error parsing SSE JSON:", err);
            }
          }
        }
      }

      // After streaming finishes, invalidate to get the saved message
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(activeConvId) });
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsStreaming(false);
      setStreamedMessage("");
    }
  };

  return (
    <Shell>
      <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
        
        {/* Sidebar */}
        <div className="w-64 border-r border-border/50 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-border/50">
            <Button onClick={handleCreate} disabled={createConv.isPending} className="w-full flex items-center gap-2">
              {createConv.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1 p-2">
            {convLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-1">
                {conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex items-center justify-between group cursor-pointer ${
                      activeConvId === conv.id ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`w-6 h-6 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/20`}
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {!activeConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a conversation or start a new chat to analyze market risks.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {messagesLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                  </div>
                ) : (
                  <>
                    {historyMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary border border-primary/30'
                        }`}>
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'bg-secondary/10 text-foreground' : 'bg-black/40 border border-border/50 text-foreground/90'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    
                    {isStreaming && streamedMessage && (
                      <div className="flex gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/20 text-primary border border-primary/30">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="p-4 rounded-2xl text-sm leading-relaxed bg-black/40 border border-border/50 text-foreground/90">
                          {streamedMessage}
                          <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border/50">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask ShieldBot about any suspicious activity..."
                    className="pr-12 bg-black/40 border-border/50 focus-visible:ring-primary/50 h-12"
                    disabled={!activeConvId || isStreaming}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || !activeConvId || isStreaming} className="h-12 w-12 shrink-0">
                    <Send className="w-5 h-5" />
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
