export * from "./ui/button";
export * from "./ui/input";
export * from "./ui/card";
export * from "./ui/label";
export * from "./ui/textarea";
export * from "./ui/skeleton";

// Re-exporting these from original location for now to avoid breaking changes
// but they should be migrated to components/ui/ soon.
export { 
  Badge, 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription,
  Separator,
  Progress,
  Switch
} from "./ui-internal";
