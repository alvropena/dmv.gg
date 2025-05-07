"use client";

import { useState } from "react";
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
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { useRouter } from "next/navigation";
import { Mail, Plus, Search, Settings } from "lucide-react";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CAMPAIGN_TYPES = [
  { value: "one-time", label: "One-time" },
  { value: "drip", label: "Drip" },
  { value: "reminder", label: "Reminder" },
  { value: "triggered", label: "Triggered" },
  { value: "recurring", label: "Recurring" },
  { value: "ab-test", label: "A/B Test" },
];

// Campaign type for campaign creation
export interface Campaign {
  name: string;
  type: string;
  from: string;
  segment: string;
  subject: string;
  content: string;
  schedule: string;
  scheduleType: string;
  dripSequence: { subject: string; content: string; delay: string }[];
  triggerEvent: string;
  active: boolean;
  sentCount: number;
  succeededCount: number;
  failedCount: number;
}

export default function EmailPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Campaign>({
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
    active: true,
    sentCount: 0,
    succeededCount: 0,
    failedCount: 0,
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

  const handleSubmit = () => {
    // Handle form submission
  };

  const handleFormat = async () => {
    try {
      const formatted = await prettier.format(formData.content, {
        parser: "html",
        plugins: [parserHtml],
      });
      setFormData((prev) => ({ ...prev, content: formatted }));
    } catch (e) {
      // Optionally handle formatting errors
    }
  };

  return (
    <div className="w-full py-8 bg-[#F1F1EF] min-h-screen">
      <div className="px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-transparent"
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Set up a new email marketing campaign. Fields will adjust based on campaign type.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-2 gap-6">
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
          </div>

          {/* Drip sequence fields */}
          {formData.type === "drip" && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Drip Sequence</label>
              {formData.dripSequence.map((step, idx) => (
                <div key={idx} className="border p-4 rounded-lg space-y-4">
                  <h3 className="font-medium">Step {idx + 1}</h3>
                  <Input
                    name={`drip-subject-${idx}`}
                    value={step.subject}
                    onChange={(e) => handleDripChange(idx, "subject", e.target.value)}
                    placeholder="Subject"
                    required
                  />
                  <Textarea
                    name={`drip-content-${idx}`}
                    value={step.content}
                    onChange={(e) => handleDripChange(idx, "content", e.target.value)}
                    placeholder="Content"
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
              <Input 
                name="triggerEvent" 
                value={formData.triggerEvent} 
                onChange={handleChange} 
                placeholder="e.g. User Signup, Purchase" 
                required 
              />
            </div>
          )}

          {/* Standard subject/content for non-drip */}
          {formData.type !== "drip" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <label className="text-sm font-medium">
                    Email Content <span className="text-xs text-muted-foreground">(HTML supported)</span>
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={handleFormat}
                      >
                        <Paintbrush className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      Format code
                    </TooltipContent>
                  </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg h-[600px] bg-white flex flex-col">
                    <CodeMirror
                      value={formData.content}
                      height="100%"
                      minHeight="100%"
                      maxHeight="100%"
                      extensions={[html()]}
                      theme="light"
                      onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                      basicSetup={{ lineNumbers: true, autocompletion: true }}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div className="border rounded-lg bg-white p-4 h-[600px] overflow-auto">
                    <div className="text-sm font-medium mb-2">Preview</div>
                    <div 
                      className="prose prose-sm max-w-none h-full"
                      dangerouslySetInnerHTML={{ __html: formData.content || '<div class="text-muted-foreground">Preview will appear here...</div>' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Schedule Type</label>
              <Select value={formData.scheduleType} onValueChange={(v) => handleSelectChange("scheduleType", v)}>
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
                  required
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
                    <SelectItem value="test-incomplete">Test Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 