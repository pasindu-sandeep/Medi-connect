import React, { useState } from "react";
import { Button } from "./../../../components/atoms/Botton";
import { useToast } from "./../../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../../../components/molecules/Dialog";
import { Input } from "./../../../components/atoms/Input";
import { Label } from "./../../../components/atoms/Label";
import { BugPlay } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../../../components/molecules/Tab";

export function DevPanel() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("unauthorized");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  // Preset alerts
  const alertPresets = {
    unauthorized: {
      title: "Unauthorized Access Attempt",
      description: "Unknown person tried to enter through Gate B",
      image: "/placeholder.svg?height=40&width=40",
      variant: "destructive",
    },
    suspended: {
      title: "Suspended Student Access Attempt",
      description: "James Wilson (STU045) tried to enter the campus",
      image: "/placeholder.svg?height=40&width=40",
      variant: "destructive",
    },
    idMismatch: {
      title: "ID Mismatch Detected",
      description:
        "Face recognized as Michael Brown (STU007) but used Emma Wilson's ID (STU015)",
      image: "/placeholder.svg?height=40&width=40",
      variant: "destructive",
    },
    system: {
      title: "System Alert",
      description: "Gate C camera is offline",
      image: null,
      variant: "default",
    },
  };

  const triggerAlert = () => {
    let title = customTitle;
    let description = customDescription;
    let image = "/placeholder.svg?height=40&width=40";
    let variant = "destructive";

    // Use preset values if custom fields are empty or a preset is selected
    if (alertType !== "custom" || (!customTitle && !customDescription)) {
      const preset = alertPresets[alertType];
      title = customTitle || preset.title;
      description = customDescription || preset.description;
      image = preset.image;
      variant = preset.variant;
    }

    toast({
      title,
      description,
      variant,
      action: {
        label: "View",
        onClick: () => (window.location.href = "/alerts"), // Hard refresh
      },
      data: {
        image,
      },
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BugPlay className="h-4 w-4" />
          <span>Dev Tools</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Development Tools</DialogTitle>
          <DialogDescription>
            Trigger test notifications and alerts for development purposes.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Quick Alerts</TabsTrigger>
            <TabsTrigger value="custom">Custom Alert</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  setAlertType("unauthorized");
                  triggerAlert();
                }}
              >
                <div>
                  <div className="font-medium">Unauthorized Access</div>
                  <div className="text-sm text-muted-foreground">
                    Unknown person tried to enter
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  setAlertType("suspended");
                  triggerAlert();
                }}
              >
                <div>
                  <div className="font-medium">Suspended Student</div>
                  <div className="text-sm text-muted-foreground">
                    Suspended student tried to enter
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  setAlertType("idMismatch");
                  triggerAlert();
                }}
              >
                <div>
                  <div className="font-medium">ID Mismatch</div>
                  <div className="text-sm text-muted-foreground">
                    Student using someone else's ID
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  setAlertType("system");
                  triggerAlert();
                }}
              >
                <div>
                  <div className="font-medium">System Alert</div>
                  <div className="text-sm text-muted-foreground">
                    Technical issue with security system
                  </div>
                </div>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter alert title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Alert Description</Label>
                <Input
                  id="description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter alert description"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              onClick={() => {
                setAlertType("custom");
                triggerAlert();
              }}
              disabled={!customTitle || !customDescription}
              className="w-full"
            >
              Trigger Custom Alert
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default DevPanel;
