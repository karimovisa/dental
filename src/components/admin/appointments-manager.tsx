"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, CircleCheck, UserX, CalendarPlus } from "lucide-react";
import {
  DataTable,
  Select,
  Button,
  Input,
  Modal,
  Badge,
  type DataTableColumn,
} from "@/components/shared";
import { AppointmentStatusBadge } from "./status-badge";
import {
  updateAppointmentStatus,
  createFollowUp,
} from "@/app/dashboard/actions";
import { formatDate } from "@/lib/format";
import type { AppointmentDbStatus } from "@/types";

export type AppointmentRowFull = {
  id: string;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  source: string;
  comment: string | null;
  service_id: string | null;
  doctor_id: string;
  services: { title: string; booking_type: string } | null;
  doctors: { name: string } | null;
};

type ServiceLite = { id: string; title: string; booking_type: string };

const formatTime = (t: string) => t.slice(0, 5);

const statusFilterOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

export function AppointmentsManager({
  appointments,
  services,
}: {
  appointments: AppointmentRowFull[];
  services: ServiceLite[];
}) {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [followUpFor, setFollowUpFor] =
    React.useState<AppointmentRowFull | null>(null);

  const rows =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const columns: DataTableColumn<AppointmentRowFull>[] = [
    {
      key: "patient_name",
      header: "Patient",
      sortable: true,
      accessor: (r) => r.patient_name,
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground">{r.patient_name}</p>
          <p className="text-xs text-muted-foreground">{r.patient_phone}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      accessor: (r) => r.services?.title ?? "",
      render: (r) => r.services?.title ?? "—",
    },
    {
      key: "appointment_date",
      header: "When",
      sortable: true,
      accessor: (r) => `${r.appointment_date} ${r.start_time}`,
      render: (r) => (
        <span className="whitespace-nowrap">
          {formatDate(r.appointment_date)} · {formatTime(r.start_time)}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      accessor: (r) => r.source,
      render: (r) => (
        <Badge variant={r.source === "online" ? "primary" : "muted"}>
          {r.source}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (r) => r.status,
      render: (r) => <AppointmentStatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <RowActions appointment={r} onFollowUp={() => setFollowUpFor(r)} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-52">
        <Select
          options={statusFilterOptions}
          value={statusFilter}
          onValueChange={setStatusFilter}
        />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        searchPlaceholder="Search patient, phone, service…"
        emptyMessage="No appointments match."
      />

      <FollowUpModal
        appointment={followUpFor}
        services={services}
        onClose={() => setFollowUpFor(null)}
      />
    </div>
  );
}

function RowActions({
  appointment,
  onFollowUp,
}: {
  appointment: AppointmentRowFull;
  onFollowUp: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const act = (status: AppointmentDbStatus) =>
    startTransition(async () => {
      await updateAppointmentStatus(appointment.id, status);
      router.refresh();
    });

  const isConsultation = appointment.services?.booking_type === "consultation";
  const canFollowUp =
    isConsultation &&
    (appointment.status === "confirmed" || appointment.status === "completed");

  return (
    <div className="flex items-center justify-end gap-1.5">
      {appointment.status === "pending" && (
        <Button size="sm" variant="primary" isLoading={pending} onClick={() => act("confirmed")} leftIcon={<Check />}>
          Confirm
        </Button>
      )}
      {appointment.status === "confirmed" && (
        <>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => act("completed")} leftIcon={<CircleCheck />}>
            Complete
          </Button>
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => act("no_show")} leftIcon={<UserX />}>
            No-show
          </Button>
        </>
      )}
      {(appointment.status === "pending" || appointment.status === "confirmed") && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => act("cancelled")} leftIcon={<X />}>
          Cancel
        </Button>
      )}
      {canFollowUp && (
        <Button size="sm" variant="secondary" onClick={onFollowUp} leftIcon={<CalendarPlus />}>
          Follow-up
        </Button>
      )}
    </div>
  );
}

function FollowUpModal({
  appointment,
  services,
  onClose,
}: {
  appointment: AppointmentRowFull | null;
  services: ServiceLite[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [serviceId, setServiceId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  // Reset when the target appointment changes.
  React.useEffect(() => {
    setServiceId("");
    setDate("");
    setTime("");
    setError(null);
  }, [appointment?.id]);

  const treatmentOptions = services
    .filter((s) => s.booking_type !== "consultation")
    .map((s) => ({ value: s.id, label: s.title }));

  function submit() {
    if (!appointment || !serviceId || !date || !time) {
      setError("Pick a treatment, date, and time.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createFollowUp({
        parentId: appointment.id,
        serviceId,
        date,
        startTime: time,
      });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Modal
      open={appointment !== null}
      onOpenChange={(o) => !o && onClose()}
      title="Create follow-up treatment"
      description={
        appointment
          ? `Linked to ${appointment.patient_name}'s consultation.`
          : undefined
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={pending} disabled={pending}>
            Create appointment
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Treatment"
          placeholder="Choose a treatment"
          options={treatmentOptions}
          value={serviceId}
          onValueChange={setServiceId}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </Modal>
  );
}
