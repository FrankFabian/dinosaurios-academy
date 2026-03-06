"use client";

import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download } from "lucide-react";

import type { StudentRow } from "@/features/students/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  student: Pick<StudentRow, "fullName" | "qrCodeValue">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StudentQrDialog({ student, open, onOpenChange }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  function handleCopy() {
    navigator.clipboard.writeText(student.qrCodeValue);
  }

  function handleDownloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `${student.fullName.replaceAll(" ", "_")}_qr.png`;
    a.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "border border-white/10 bg-black p-5 text-white",
          "max-w-none",
          "w-[calc(100vw-2rem)] sm:w-215",
          "sm:max-w-215"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-base">Student QR</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-[320px_1fr] sm:items-start">
          <div
            data-qr-canvas="true"
            className={cn(
              "flex w-full items-center justify-center rounded-xl border border-emerald-500/15",
              "bg-linear-to-b from-emerald-500/10 to-transparent p-6 sm:w-[320px]"
            )}
          >
            <div className="rounded-lg bg-white p-3">
              <QRCodeCanvas ref={canvasRef} value={student.qrCodeValue} size={220} marginSize={4} />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/60">Student</div>
              <div className="mt-1 font-medium">{student.fullName}</div>

              <div className="mt-3 text-sm text-white/60">QR value</div>
              <div className="mt-1 break-all rounded-md border border-white/10 bg-black/40 p-2 text-xs text-white/80">
                {student.qrCodeValue}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={handleCopy}
                className="bg-emerald-500 text-black hover:bg-emerald-400"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy value
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadPng}
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
