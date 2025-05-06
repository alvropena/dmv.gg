"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail } from "lucide-react";

const CAMPAIGN_TYPES = [
  { value: "one-time", label: "One-time" },
  { value: "drip", label: "Drip" },
  { value: "reminder", label: "Reminder" },
  { value: "triggered", label: "Triggered" },
  { value: "recurring", label: "Recurring" },
  { value: "ab-test", label: "A/B Test" },
];

interface CreateCampaignDialogProps {
  onCreate?: (campaign: any) => void;
}

export default function CreateCampaignDialog({ onCreate }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "one-time",
    from: "support@dmv.gg",
    segment: "",
    subject: "",
    content: "",
    schedule: "",
    scheduleType: "schedule",
    // For drip/triggered
    dripSequence: [{ subject: "", content: "", delay: "" }],
    triggerEvent: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDripChange = (
    idx: number,
    field: 'subject' | 'content' | 'delay',
    value: string
  ) => {
    setFormData((prev) => {
      const dripSequence = [...prev.dripSequence];
      dripSequence[idx][field] = value;
      return { ...prev, dripSequence };
    });
  };

  const addDripStep = () => {
    setFormData((prev) => ({
      ...prev,
      dripSequence: [...prev.dripSequence, { subject: "", content: "", delay: "" }],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle campaign creation logic here
    if (onCreate) {
      onCreate(formData);
    }
    setOpen(false);
    setFormData({
      name: "",
      type: "one-time",
      from: "support@dmv.gg",
      segment: "",
      subject: "",
      content: "",
      schedule: "",
      scheduleType: "schedule",
      dripSequence: [{ subject: "", content: "", delay: "" }],
      triggerEvent: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="w-4 h-4" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new email marketing campaign. Fields will adjust based on campaign type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Type</label>
            <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={formData.from} onValueChange={(v) => handleSelectChange("from", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sender email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support@dmv.gg">Susan from DMV.gg &lt;support@dmv.gg&gt;</SelectItem>
                <SelectItem value="noreply@dmv.gg">DMV.gg &lt;noreply@dmv.gg&gt;</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Segment</label>
            <Select value={formData.segment} onValueChange={(v) => handleSelectChange("segment", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new-signups">New Signups</SelectItem>
                <SelectItem value="vips">VIPs</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Drip sequence fields */}
          {formData.type === "drip" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Drip Sequence</label>
              {formData.dripSequence.map((step, idx) => (
                <div key={idx} className="border p-2 rounded mb-2">
                  <Input
                    name={`drip-subject-${idx}`}
                    value={step.subject}
                    onChange={(e) => handleDripChange(idx, "subject", e.target.value)}
                    placeholder={`Step ${idx + 1} Subject`}
                    className="mb-1"
                    required
                  />
                  <Textarea
                    name={`drip-content-${idx}`}
                    value={step.content}
                    onChange={(e) => handleDripChange(idx, "content", e.target.value)}
                    placeholder={`Step ${idx + 1} Content`}
                    className="mb-1"
                    required
                  />
                  <Input
                    name={`drip-delay-${idx}`}
                    value={step.delay}
                    onChange={(e) => handleDripChange(idx, "delay", e.target.value)}
                    placeholder="Delay after previous (e.g. 2 days)"
                    required
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addDripStep}>+ Add Step</Button>
            </div>
          )}
          {/* Trigger event field */}
          {formData.type === "triggered" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Event</label>
              <Input name="triggerEvent" value={formData.triggerEvent} onChange={handleChange} placeholder="e.g. User Signup, Purchase" required />
            </div>
          )}
          {/* Standard subject/content for non-drip */}
          {formData.type !== "drip" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Content</label>
                <Textarea name="content" value={formData.content} onChange={handleChange} required />
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule Type</label>
            <Select value={formData.scheduleType || "schedule"} onValueChange={(v) => handleSelectChange("scheduleType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="trigger">Trigger</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.scheduleType === "schedule" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Date & Time</label>
              <Input
                type="datetime-local"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                required={formData.scheduleType === "schedule"}
              />
            </div>
          )}
          {formData.scheduleType === "trigger" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Condition</label>
              <Select value={formData.triggerEvent} onValueChange={(v) => handleSelectChange("triggerEvent", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-signup">User Signup</SelectItem>
                  <SelectItem value="purchase-completed">Purchase Completed</SelectItem>
                  <SelectItem value="cart-abandoned">Cart Abandoned</SelectItem>
                  <SelectItem value="profile-updated">Profile Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Create Campaign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 