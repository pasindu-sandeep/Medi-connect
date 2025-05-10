import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "./../../../components/atoms/Toast";
import { useToast } from "./../../../hooks/use-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./../../../components/atoms/Avatar";
import { useTheme } from "next-themes";

export function NotificationToast() {
  const { toast, toasts, dismissToast } = useToast();
  const { theme } = useTheme();

  // Remove the automatic toast triggers
  useEffect(() => {
    // Don't show notifications on the login page
    if (window.location.pathname === "/") {
      return;
    }

    // We've removed the automatic toast triggers
    // They will now be triggered manually via the dev panel
  }, [toast]);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-0 backdrop-blur-sm ${
            theme === "dark" ? "bg-black/90" : "bg-black/75"
          }`}
        >
          <div
            className={`w-full max-w-md rounded-lg shadow-lg border-2 border-destructive p-0 overflow-hidden ${
              theme === "dark" ? "bg-background" : "bg-background"
            }`}
          >
            {/* Alert header with red background */}
            <div className="bg-destructive py-4 px-6 text-destructive-foreground flex items-center gap-4">
              {props.data?.image && (
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage src={props.data.image} alt="User" />
                  <AvatarFallback>
                    <AlertTriangle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              )}
              {title && (
                <ToastTitle className="text-xl font-bold">{title}</ToastTitle>
              )}
            </div>

            {/* Alert body */}
            <div className="p-6">
              {description && (
                <ToastDescription className="text-base text-foreground font-medium">
                  {description}
                </ToastDescription>
              )}

              {action && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="inline-flex h-10 min-w-[100px] items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      action.onClick?.();
                      // Don't dismiss the toast here - let the hard refresh handle it
                    }}
                  >
                    {action.label}
                  </button>
                  {/* Fix the dismiss button by using an onClick handler that explicitly calls dismissToast */}
                  <button
                    className="inline-flex h-10 min-w-[100px] items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dismissToast(id);
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </Toast>
      ))}
      <ToastViewport className="p-0" />
    </ToastProvider>
  );
}

export default NotificationToast;
