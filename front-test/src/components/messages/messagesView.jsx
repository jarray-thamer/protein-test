"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function MessagesView({ message, onBack }) {
  // Format dates for display
  const formattedDate = format(new Date(message.createdAt), "MMMM d, yyyy");
  const formattedTime = format(new Date(message.createdAt), "h:mm a");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Back to messages</span>
        </Button>
        <h1 className="text-2xl font-bold">Message Details</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl">{message.subject}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/10"
                >
                  {formattedDate}
                </Badge>
                <Badge variant="outline" className="bg-muted hover:bg-muted">
                  {formattedTime}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Mark as Read</Button>
              <Button>Mark as Replied</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Sender Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{message.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`mailto:${message.email}`}
                    className="text-primary hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                {message.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${message.phone}`}
                      className="hover:underline"
                    >
                      {message.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Message Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{message.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Message Content
            </h3>
            <div className="p-4 whitespace-pre-wrap rounded-lg bg-muted/50">
              {message.message}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Messages
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
