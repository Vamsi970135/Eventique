import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatTime, getInitials } from "@/lib/utils";
import { 
  ArrowLeft, 
  Send, 
  MessagesSquare,
  UserCircle2,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Get the user ID from URL query params if present
  const searchParams = new URLSearchParams(window.location.search);
  const urlUserId = searchParams.get("user");
  
  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/messages'],
    enabled: !!user,
  });
  
  // Fetch the selected conversation
  const { data: selectedConversation, isLoading: conversationLoading } = useQuery({
    queryKey: ['/api/messages', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await fetch(`/api/messages/${selectedUserId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return response.json();
    },
    enabled: !!selectedUserId,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedUserId) throw new Error("No recipient selected");
      const response = await apiRequest("POST", `/api/messages/${selectedUserId}`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      // Refetch both the conversation list and the current conversation
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedUserId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize selectedUserId from URL if provided
  useEffect(() => {
    if (urlUserId) {
      setSelectedUserId(Number(urlUserId));
    } else if (conversations && conversations.length > 0) {
      // Select the first conversation if one exists and none is selected
      setSelectedUserId(conversations[0].otherUser.id);
    }
  }, [urlUserId, conversations]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);
  
  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    if (!selectedUserId) {
      toast({
        title: "No recipient selected",
        description: "Please select a conversation first",
        variant: "destructive",
      });
      return;
    }
    
    sendMessageMutation.mutate(message);
  };
  
  // Filter conversations by search query
  const filteredConversations = conversations?.filter(conversation => {
    const otherUser = conversation.otherUser;
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    const businessName = otherUser.businessName?.toLowerCase() || '';
    
    return !searchQuery || 
      fullName.includes(searchQuery.toLowerCase()) || 
      businessName.includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2"
              onClick={() => navigate(user?.userType === "customer" ? "/dashboard/customer" : "/dashboard/business")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-neutral-600">
              Communicate with {user?.userType === "customer" ? "service providers" : "customers"}
            </p>
          </div>
          
          {/* Messages Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Conversation List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Conversations</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="h-[calc(75vh-8rem)] overflow-y-auto">
                {conversationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center p-2 animate-pulse">
                        <div className="rounded-full bg-neutral-200 h-10 w-10 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-neutral-200 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations && filteredConversations.length > 0 ? (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.otherUser.id} 
                        className={`flex items-center p-2 rounded-md cursor-pointer ${
                          selectedUserId === conversation.otherUser.id 
                            ? 'bg-primary/10' 
                            : 'hover:bg-neutral-100'
                        }`}
                        onClick={() => setSelectedUserId(conversation.otherUser.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={conversation.otherUser.profileImage} />
                            <AvatarFallback>
                              {getInitials(conversation.otherUser.firstName, conversation.otherUser.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">
                              {conversation.otherUser.businessName || 
                               `${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`}
                            </h4>
                            {conversation.lastMessage && (
                              <span className="text-xs text-neutral-500">
                                {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 truncate">
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessagesSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-neutral-500 text-sm mb-4">
                      {user?.userType === "customer" 
                        ? "Start a conversation by contacting a service provider"
                        : "When customers contact you, you'll see their messages here"}
                    </p>
                    {user?.userType === "customer" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/services")}
                      >
                        Browse Services
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Conversation Detail */}
            <Card className="lg:col-span-2">
              {selectedUserId ? (
                <>
                  <CardHeader className="pb-2 border-b">
                    {conversationLoading || !filteredConversations ? (
                      <div className="flex items-center animate-pulse">
                        <div className="rounded-full bg-neutral-200 h-10 w-10 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-neutral-200 rounded w-32 mb-1"></div>
                          <div className="h-4 bg-neutral-200 rounded w-24"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={filteredConversations.find(c => 
                            c.otherUser.id === selectedUserId
                          )?.otherUser.profileImage} />
                          <AvatarFallback>
                            {getInitials(
                              filteredConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser.firstName,
                              filteredConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser.lastName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {filteredConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser.businessName || 
                             `${filteredConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser.firstName} ${
                                filteredConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser.lastName
                              }`}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {user?.userType === "customer" ? "Service Provider" : "Customer"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-0 flex flex-col h-[calc(75vh-13rem)]">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {conversationLoading ? (
                        <div className="space-y-4 py-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 rounded-lg animate-pulse ${
                                i % 2 === 0 ? 'bg-neutral-200' : 'bg-primary/20'
                              }`} style={{ height: `${Math.floor(Math.random() * 40) + 40}px`, width: `${Math.floor(Math.random() * 200) + 100}px` }}></div>
                            </div>
                          ))}
                        </div>
                      ) : selectedConversation && selectedConversation.length > 0 ? (
                        <div className="space-y-4 py-2">
                          {selectedConversation.map((msg: any) => {
                            const isFromMe = msg.fromUserId === user?.id;
                            return (
                              <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                                {!isFromMe && (
                                  <Avatar className="h-8 w-8 mr-2 mt-1">
                                    <AvatarImage src={filteredConversations?.find(c => 
                                      c.otherUser.id === selectedUserId
                                    )?.otherUser.profileImage} />
                                    <AvatarFallback>
                                      {getInitials(
                                        filteredConversations?.find(c => c.otherUser.id === selectedUserId)?.otherUser.firstName,
                                        filteredConversations?.find(c => c.otherUser.id === selectedUserId)?.otherUser.lastName
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className={`max-w-[75%] p-3 rounded-lg ${
                                  isFromMe ? 'bg-primary text-primary-foreground' : 'bg-neutral-200'
                                }`}>
                                  <p>{msg.content}</p>
                                  <p className={`text-xs mt-1 ${isFromMe ? 'text-primary-foreground/80' : 'text-neutral-500'}`}>
                                    {formatTime(new Date(msg.createdAt))}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messageEndRef} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <MessagesSquare className="h-12 w-12 mb-4 text-neutral-400" />
                          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                          <p className="text-neutral-500 text-sm">
                            Send a message to start the conversation
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Textarea
                          placeholder="Type your message here..."
                          className="resize-none flex-1"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        <Button 
                          type="submit" 
                          size="icon"
                          disabled={sendMessageMutation.isPending || !message.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-[75vh] flex flex-col items-center justify-center text-center p-8">
                  <UserCircle2 className="h-16 w-16 mb-4 text-neutral-300" />
                  <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
                  <p className="text-neutral-500 max-w-md">
                    {conversations && conversations.length > 0 
                      ? "Select a conversation from the left to view messages" 
                      : `You don't have any conversations yet. ${
                          user?.userType === "customer" 
                            ? "Contact a service provider to start messaging." 
                            : "Customers will be able to message you about your services."
                        }`
                    }
                  </p>
                  {user?.userType === "customer" && !conversations?.length && (
                    <Button 
                      className="mt-4"
                      onClick={() => navigate("/services")}
                    >
                      Browse Services
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
