"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";


type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const EMPTY_TOASTS: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener());
}

function dismiss(id: number) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  toasts = toasts.filter((item) => item.id !== id);
  notify();
}

function show(type: ToastType, message: string) {
  const item: ToastItem = { id: Date.now() + Math.random(), type, message };
  toasts = [...toasts, item];
  notify();

  timers.set(
    item.id,
    setTimeout(() => dismiss(item.id), 4500),
  );
  return () => dismiss(item.id);
}

export const toast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
  info: (message: string) => show("info", message),
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={19} className="text-emerald-600" />,
  error: <TriangleAlert size={19} className="text-red-600" />,
  info: <Info size={19} className="text-[#A67C45]" />,
};

const accentBar: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-[#A67C45]",
};

function ToastCard({ item }: { item: ToastItem }) {
  return (
    <div
      role="status"
      className="relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-[#D6D1C8] bg-white py-3.5 pl-4 pr-10 shadow-lg animate-in fade-in slide-in-from-bottom-2"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${accentBar[item.type]}`} />
      <span className="mt-0.5 shrink-0">{icons[item.type]}</span>

      <p className="py-0.5 pr-1 text-sm leading-6 text-[#191917]">{item.message}</p>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismiss(item.id)}
        className="absolute right-2 top-2 cursor-pointer rounded-md p-1 text-[#777777] transition-colors hover:bg-[#F5F2EC] hover:text-[#191917]"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Toaster() {
  const items = React.useSyncExternalStore(
    (handleChange) => {
      listeners.add(handleChange);
      return () => {
        listeners.delete(handleChange);
      };
    },
    () => toasts,
    () => EMPTY_TOASTS,
  );

  if (items.length === 0) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>,
    document.body,
  );
}


