"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2, Check } from "lucide-react"

export function RobotGate() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "checking" | "done">("idle")

  function handleCheck() {
    if (status !== "idle") return
    setStatus("checking")
    setTimeout(() => {
      setStatus("done")
      setTimeout(() => {
        router.push("/loja")
      }, 700)
    }, 1600)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section
        className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm"
        aria-labelledby="gate-title"
      >
        <div className="flex justify-center">
          <ShieldCheck className="h-10 w-10 text-foreground" aria-hidden="true" />
        </div>

        <h1 id="gate-title" className="mt-4 text-lg font-bold text-foreground text-balance">
          Confirme que você não é um robô
        </h1>

        <button
          type="button"
          onClick={handleCheck}
          disabled={status !== "idle"}
          aria-pressed={status === "done"}
          className="mt-6 flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted disabled:cursor-default"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-card">
            {status === "checking" ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : status === "done" ? (
              <Check className="h-4 w-4 text-foreground" aria-hidden="true" />
            ) : null}
          </span>
          <span className="text-sm font-medium text-foreground">
            {status === "done" ? "Verificado" : "Não sou um robô"}
          </span>
        </button>
      </section>
    </main>
  )
}
