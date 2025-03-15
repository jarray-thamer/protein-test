"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, Calendar, ChevronRight, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessagesView } from "@/components/messages/messagesView";
import axios from "axios";

export function MessagesList() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/admin/messages/get");

        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };
    fetchMessages();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Filter messages based on search term
  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort messages based on selection
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Handle message selection
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  // Handle closing the detailed view
  const handleCloseView = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="container p-4 mx-auto">
      {selectedMessage ? (
        <MessagesView message={selectedMessage} onBack={handleCloseView} />
      ) : (
        <>
          <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">
                Manage and respond to customer inquiries
              </p>
            </div>
            <div className="flex flex-col w-full gap-3 sm:flex-row md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedMessages.length > 0 ? (
              sortedMessages.map((message) => (
                <Card
                  key={message._id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary hover:bg-primary/10"
                      >
                        {format(new Date(message.createdAt), "MMM d")}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {message.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    <p className="mt-3 text-sm line-clamp-2">
                      {message.message}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="justify-between w-full"
                      onClick={() => handleSelectMessage(message)}
                    >
                      View details
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center rounded-lg col-span-full bg-muted">
                <p className="text-muted-foreground">
                  No messages found matching your search criteria.
                </p>
              </div>
            )}
          </div>

          {messages.length === 0 && (
            <div className="p-8 text-center rounded-lg bg-muted">
              <p className="text-muted-foreground">No messages received yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
