import { cn } from "@/lib/utils";

export type Status =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "void";

type Tone = "neutral" | "success" | "warning" | "danger";

const STATUS_TONE: Record<Status, Tone> = {
  draft: "neutral",
  void: "neutral",
  sent: "warning",
  pending: "warning",
  in_progress: "warning",
  partially_paid: "warning",
  accepted: "success",
  completed: "success",
  paid: "success",
  declined: "danger",
  expired: "danger",
  cancelled: "danger",
  unpaid: "danger",
};

const STATUS_LABEL: Record<Status, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  unpaid: "Unpaid",
  partially_paid: "Partially paid",
  paid: "Paid",
  void: "Void",
};

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger-strong",
};

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASS[STATUS_TONE[status]],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
