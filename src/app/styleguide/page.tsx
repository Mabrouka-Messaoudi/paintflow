import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, FileText, FolderKanban, Plus, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge, type Status } from "@/components/shared/status-badge";

export const metadata: Metadata = { title: "Styleguide" };

const colors = [
  { name: "background", hex: "#FAFAF7", className: "bg-background" },
  { name: "card", hex: "#FFFFFF", className: "bg-card" },
  { name: "muted", hex: "#F3F2EE", className: "bg-muted" },
  { name: "border", hex: "#E7E5E0", className: "bg-border" },
  { name: "foreground", hex: "#1C1B19", className: "bg-foreground" },
  { name: "muted-foreground", hex: "#6B6862", className: "bg-muted-foreground" },
  { name: "brand", hex: "#C8553D", className: "bg-brand" },
  { name: "brand-soft", hex: "#F6E3DD", className: "bg-brand-soft" },
  { name: "success", hex: "#3F8F5F", className: "bg-success" },
  { name: "success-soft", hex: "#E4F2E8", className: "bg-success-soft" },
  { name: "warning", hex: "#B7791F", className: "bg-warning" },
  { name: "warning-soft", hex: "#FBF1DC", className: "bg-warning-soft" },
  { name: "danger", hex: "#C2453B", className: "bg-danger" },
  { name: "danger-soft", hex: "#F8E1DF", className: "bg-danger-soft" },
];

const statuses: Status[] = [
  "draft", "sent", "accepted", "declined", "expired",
  "pending", "in_progress", "completed", "cancelled",
  "unpaid", "partially_paid", "paid", "void",
];

const stats = [
  { label: "Total revenue", value: "€12,450", icon: Wallet },
  { label: "Active projects", value: "8", icon: FolderKanban },
  { label: "Pending quotes", value: "4", icon: FileText },
  { label: "Outstanding", value: "€3,200", icon: Clock },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 border-t py-12">
      <h2 className="text-caption text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 lg:px-8">
      <header className="space-y-4 pb-12">
        <p className="text-caption text-muted-foreground">Design system</p>
        <h1 className="text-display">PaintFlow styleguide</h1>
        <p className="text-lead max-w-2xl text-muted-foreground">
          Tokens, typography and core components. Every screen of the app is built from these pieces.
        </p>
      </header>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-xl border bg-card">
              <div className={`h-20 ${c.className}`} />
              <div className="p-3">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs tabular-nums text-muted-foreground">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-6">
          <p className="text-display">Your painting business, beautifully organized.</p>
          <p className="text-h1">Everything you need. One dashboard.</p>
          <p className="text-h2">From quote to payment</p>
          <p className="text-h3">Recent projects</p>
          <p className="text-lead max-w-2xl text-muted-foreground">
            Manage clients, projects, quotes, payments and conversations — all in one place.
          </p>
          <p className="max-w-2xl">
            Body text. The client can review the quote, accept it, and follow every payment until the project is completed.
          </p>
          <p className="text-sm text-muted-foreground">Small text — secondary information and helper text.</p>
          <p className="text-caption text-muted-foreground">Caption label</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="brand">
            Get started <ArrowRight />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Status badges">
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-raised"
            >
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <p className="text-h2 tabular-nums">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-md shadow-card">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-h3">Ahmed&apos;s House</p>
              <StatusBadge status="partially_paid" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="tabular-nums font-medium">€1,000 / €2,300</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[43%] rounded-full bg-brand" />
              </div>
              <p className="text-sm text-muted-foreground">43% paid · €1,300 remaining</p>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Form">
        <div className="grid max-w-md gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ahmed@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" disabled placeholder="Not editable" />
          </div>
          <Button variant="brand" className="w-full">
            Create account
          </Button>
        </div>
      </Section>
    </main>
  );
}
