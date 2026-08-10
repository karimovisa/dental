"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Textarea,
  Button,
} from "@/components/shared";
import { updatePatientNotes } from "@/app/[locale]/dashboard/actions";

export function PatientNotes({
  patientId,
  initialNotes,
}: {
  patientId: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = React.useState(initialNotes);
  const [pending, startTransition] = React.useTransition();
  const [saved, setSaved] = React.useState(false);

  const dirty = notes !== initialNotes;

  function save() {
    setSaved(false);
    startTransition(async () => {
      const res = await updatePatientNotes(patientId, notes);
      if (!("error" in res)) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Private notes</CardTitle>
        <CardDescription>Only visible to the clinic.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          placeholder="Allergies, preferences, treatment notes…"
          className="min-h-40"
        />
      </CardContent>
      <CardFooter className="justify-end gap-3">
        {saved && !dirty && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="size-4" /> Saved
          </span>
        )}
        <Button onClick={save} isLoading={pending} disabled={pending || !dirty}>
          Save notes
        </Button>
      </CardFooter>
    </Card>
  );
}
