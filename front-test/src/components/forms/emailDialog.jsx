import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import QuillToolbar, { formats, modules } from "../quill/quillToolbar";
import "react-quill/dist/quill.snow.css";
import { handleSendEmail } from "@/functions/clients";

export function EmailDialog({ isEmailOpen, setIsEmailOpen, selectedRows }) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSend = async () => {
    if (message.trim() && subject.trim()) {
      setIsLoading(true);
      try {
        await handleSendEmail(selectedRows, message, subject);
        setIsEmailOpen(false);
        setMessage("");
        setSubject("");
        toast.success("Email sent successfully");
      } catch (error) {
        toast.error("Failed to send email: " + error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter a message and a subject before sending");
    }
  };

  return (
    <Dialog
      className="w-[1024px]"
      open={isEmailOpen}
      onOpenChange={setIsEmailOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Email to {selectedRows.length} clients</DialogTitle>
        </DialogHeader>
        <div>
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            placeholder="Enter your Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <QuillToolbar toolbarId="t1" />
          <ReactQuill
            theme="snow"
            value={message}
            onChange={setMessage}
            modules={modules("t1")}
            formats={formats}
            readOnly={isLoading}
            placeholder="Write your message here..."
            aria-label="Email message"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={onSend}
            disabled={isLoading || !message.trim() || !subject.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
