import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { handleSendSMS } from "@/functions/clients";
import { Textarea } from "../ui/textarea";

export function SMSDialog({ isOpen, setIsOpen, selectedRows }) {
  const [message, setMessage] = useState("");

  const onSend = () => {
    if (message.trim()) {
      handleSendSMS(selectedRows, message);
      setIsOpen(false);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SMS to {selectedRows.length} clients</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onSend} disabled={!message.trim()}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
