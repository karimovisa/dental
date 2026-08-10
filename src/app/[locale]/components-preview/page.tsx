"use client";

import * as React from "react";
import {
  Sun,
  Moon,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Badge,
  StatusPill,
  Modal,
  Accordion,
  Avatar,
  SectionHeading,
  LightboxImage,
  DataTable,
  type DataTableColumn,
} from "@/components/shared";
import {
  appointments,
  doctors,
  services,
  faqs,
  galleryImages,
} from "@/data";
import { formatDate, formatPrice } from "@/lib/format";
import type { Appointment } from "@/types";

const serviceMap = new Map(services.map((s) => [s.id, s]));
const doctorMap = new Map(doctors.map((d) => [d.id, d]));

function ThemeToggle() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }
  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-border py-10">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

const appointmentColumns: DataTableColumn<Appointment>[] = [
  {
    key: "patient_name",
    header: "Patient",
    sortable: true,
    accessor: (r) => r.patient_name,
  },
  {
    key: "service_id",
    header: "Service",
    accessor: (r) => serviceMap.get(r.service_id)?.title ?? "—",
    render: (r) => serviceMap.get(r.service_id)?.title ?? "—",
  },
  {
    key: "doctor_id",
    header: "Doctor",
    accessor: (r) => (r.doctor_id ? doctorMap.get(r.doctor_id)?.name ?? "" : "Any"),
    render: (r) =>
      r.doctor_id ? (
        doctorMap.get(r.doctor_id)?.name ?? "—"
      ) : (
        <span className="text-muted-foreground">Any doctor</span>
      ),
  },
  {
    key: "preferred_date",
    header: "Date",
    sortable: true,
    accessor: (r) => r.preferred_date,
    render: (r) => (
      <span className="whitespace-nowrap">
        {formatDate(r.preferred_date)} · {r.preferred_time}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    accessor: (r) => r.status,
    render: (r) => <StatusPill status={r.status} />,
  },
];

export default function ComponentsPreviewPage() {
  const [selectValue, setSelectValue] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between gap-4 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Design System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stage 2 — shared components. Toggle the theme to review both modes.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button leftIcon={<Calendar />}>Book appointment</Button>
          <Button variant="outline" rightIcon={<ArrowRight />}>
            Learn more
          </Button>
          <Button isLoading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button variant="destructive" leftIcon={<Trash2 />}>
            Delete
          </Button>
        </div>
        <div className="max-w-sm">
          <Button fullWidth href="#buttons" rightIcon={<ArrowRight />}>
            Full width link button
          </Button>
        </div>
      </Section>

      <Section title="Badges & Status">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="muted">Muted</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status="upcoming" />
          <StatusPill status="completed" />
          <StatusPill status="cancelled" />
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-5 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Basic card</CardTitle>
              <CardDescription>Soft shadow, rounded corners.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A neutral surface for grouping content.
            </CardContent>
          </Card>
          <Card hoverable>
            <CardHeader>
              <CardTitle>Hoverable</CardTitle>
              <CardDescription>Lifts gently on hover.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ideal for service and doctor cards.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>With footer</CardTitle>
              <CardDescription>Actions live in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {formatPrice(180)} · Teeth whitening
            </CardContent>
            <CardFooter>
              <Button size="sm" rightIcon={<ArrowRight />}>
                Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section title="Form controls">
        <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <Input label="Full name" placeholder="Aziza Tolipova" />
          <Input
            label="Phone"
            placeholder="+998 90 123 45 67"
            leftIcon={<Phone />}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            leftIcon={<Mail />}
            hint="We'll never share your email."
          />
          <Input
            label="Required field"
            placeholder="Empty"
            error="This field is required."
          />
          <Select
            label="Service"
            placeholder="Choose a service"
            value={selectValue}
            onValueChange={setSelectValue}
            options={services.map((s) => ({ value: s.id, label: s.title }))}
            containerClassName="sm:col-span-1"
          />
          <Input label="Disabled" placeholder="Disabled" disabled />
          <Textarea
            label="Comment"
            placeholder="Anything we should know?"
            containerClassName="sm:col-span-2"
          />
        </div>
      </Section>

      <Section title="Avatars">
        <div className="flex flex-wrap items-end gap-4">
          <Avatar name="Dilnoza Karimova" src={doctors[0].image_url} size="sm" />
          <Avatar name="Dilnoza Karimova" src={doctors[0].image_url} size="md" />
          <Avatar name="Dilnoza Karimova" src={doctors[0].image_url} size="lg" />
          <Avatar name="Jasur Rahimov" size="lg" />
          <Avatar name="Malika Yusupova" size="xl" />
        </div>
      </Section>

      <Section title="Section heading">
        <div className="rounded-2xl border border-border p-8">
          <SectionHeading
            eyebrow="Why choose us"
            title="Care that feels effortless"
            description="A reusable heading block with an eyebrow, balanced title, and supporting copy — animated on scroll."
          />
        </div>
      </Section>

      <Section title="Accordion (FAQ)">
        <div className="max-w-2xl rounded-2xl border border-border px-5">
          <Accordion
            items={faqs.slice(0, 4).map((f) => ({
              id: f.id,
              title: f.question,
              content: f.answer,
            }))}
          />
        </div>
      </Section>

      <Section title="Modal / Dialog">
        <div className="flex flex-wrap gap-3">
          <Modal
            trigger={<Button variant="outline">Open with trigger</Button>}
            title="Confirm appointment"
            description="This is a UI-only dialog — no submit logic in V1."
            footer={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button>Confirm</Button>
              </>
            }
          >
            <p className="text-sm text-muted-foreground">
              Body content goes here. The dialog handles the portal, backdrop,
              focus trap, and close button automatically.
            </p>
          </Modal>

          <Button onClick={() => setModalOpen(true)}>Open (controlled)</Button>
          <Modal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Controlled dialog"
            description="Opened via React state."
            footer={<Button onClick={() => setModalOpen(false)}>Got it</Button>}
          >
            <p className="text-sm text-muted-foreground">
              Fully controlled through <code>open</code> /{" "}
              <code>onOpenChange</code>.
            </p>
          </Modal>
        </div>
      </Section>

      <Section title="Lightbox gallery">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {galleryImages.slice(0, 4).map((img) => (
            <LightboxImage
              key={img.id}
              src={img.image_url}
              alt={img.title ?? "Gallery image"}
              caption={img.title ?? undefined}
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ))}
        </div>
      </Section>

      <Section title="Data table (sortable + searchable)">
        <DataTable
          columns={appointmentColumns}
          data={appointments}
          getRowId={(row) => row.id}
          searchPlaceholder="Search appointments…"
          initialSort={{ key: "preferred_date", dir: "desc" }}
        />
      </Section>
    </main>
  );
}
