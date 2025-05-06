"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateEmailDialog from "./CreateEmailDialog";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { useState } from "react";

export default function EmailTabContent() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const handleAddCampaign = (campaign: any) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Marketing</h2>
        <div className="flex gap-2">
          <CreateCampaignDialog onCreate={handleAddCampaign} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p>Your email campaigns will be displayed here.</p>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c, i) => (
                <div key={i} className="border rounded p-2">
                  <div className="font-semibold">
                    {c.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({c.type})
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    From: {c.from}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Segment: {c.segment}
                  </div>
                  <div className="text-sm">Subject: {c.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    Scheduled: {c.schedule}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
