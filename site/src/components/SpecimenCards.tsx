"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import content from "@/data/content.json";
import type { Role } from "@/lib/content";

function RoleModal({
  role,
  onClose,
}: {
  role: Role;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(44, 28, 18, 0.7)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`role-title-${role.id}`}
        className="relative max-w-lg w-full p-10"
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(74, 14, 43, 0.18)",
          boxShadow: "0 24px 80px rgba(44, 28, 18, 0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-5 text-2xl leading-none"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <div
          className="text-xs tracking-[0.14em] uppercase mb-4"
          style={{ color: "var(--gold-text)" }}
        >
          No. {role.number}
        </div>

        <div className="flex justify-center mb-6">
          <Image
            src={`/glass-assets/tight_png/${role.piece}`}
            alt=""
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        <h3
          id={`role-title-${role.id}`}
          className="text-2xl mb-3"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--wine)",
            fontWeight: 600,
          }}
        >
          {role.title}
        </h3>

        <p
          className="mb-6 leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.9rem",
          }}
        >
          {role.description}
        </p>

        <div className="mb-5">
          <h4
            className="text-xs tracking-[0.18em] uppercase mb-3"
            style={{
              color: "var(--gold-text)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            What You&rsquo;ll Do
          </h4>
          <ul className="list-none space-y-2">
            {role.tasks.map((task, i) => (
              <li
                key={`task-${i}`}
                className="text-sm pl-4 relative"
                style={{
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <span
                  className="absolute left-0 top-[0.45em]"
                  style={{
                    width: "5px",
                    height: "5px",
                    background: "var(--gold)",
                    transform: "rotate(45deg)",
                    display: "block",
                  }}
                />
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="text-xs tracking-[0.18em] uppercase mb-3"
            style={{
              color: "var(--gold-text)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            What We Provide
          </h4>
          <ul className="list-none space-y-2">
            {role.perks.map((perk, i) => (
              <li
                key={`perk-${i}`}
                className="text-sm pl-4 relative"
                style={{
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <span
                  className="absolute left-0 top-[0.45em]"
                  style={{
                    width: "5px",
                    height: "5px",
                    background: "var(--gold)",
                    transform: "rotate(45deg)",
                    display: "block",
                  }}
                />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-6 text-sm"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: "var(--ink-dim)",
          }}
        >
          Time commitment: {role.time}
        </p>

        <div className="mt-6 text-center">
          <a
            href="#join"
            onClick={onClose}
            className="inline-block transition-colors duration-200"
            style={{
              padding: "0.8rem 1.8rem",
              background: "var(--wine)",
              color: "var(--cream)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Become a {role.title.replace("The ", "")} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SpecimenCards({ roles }: { roles?: Role[] }) {
  const list = roles ?? (content.roles as Role[]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback((role: Role) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setSelectedRole(role);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRole(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <>
      <div
        className="grid gap-[30px] max-w-[900px] mx-auto mt-10 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))" }}
      >
        {list.map((role) => (
          <button
            key={role.id}
            type="button"
            className="spec-card relative text-center cursor-pointer"
            style={{
              background: "var(--cream)",
              border: "1px solid rgba(74, 14, 43, 0.18)",
              padding: "40px 34px",
              transition:
                "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
            }}
            onClick={() => openModal(role)}
          >
            <div
              className="absolute"
              style={{
                top: "16px",
                left: "20px",
                fontSize: "0.66rem",
                letterSpacing: "0.14em",
                color: "var(--gold)",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              No. {role.number}
            </div>

            <div
              className="spec-img flex items-center justify-center mb-[22px]"
              style={{ height: "220px" }}
            >
              <div className="relative" style={{ width: "78%", height: "100%" }}>
                <Image
                  src={`/glass-assets/tight_png/${role.piece}`}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-contain"
                />
              </div>
            </div>

            <div
              className="relative mx-auto mb-5"
              style={{ width: "54px", height: "10px" }}
            >
              <span
                className="absolute left-0 right-0"
                style={{
                  top: "50%",
                  height: "1px",
                  background: "var(--gold)",
                }}
              />
              <span
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "6px",
                  height: "6px",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  background: "var(--gold)",
                }}
              />
            </div>

            <div
              className="mb-4"
              style={{
                fontSize: "0.86rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--wine)",
                fontWeight: 400,
                fontFamily: "var(--font-sans)",
              }}
            >
              {role.title}
            </div>

            <p
              className="mx-auto"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.88rem",
                lineHeight: 1.7,
                maxWidth: "340px",
              }}
            >
              {role.description}
            </p>
          </button>
        ))}
      </div>

      {selectedRole && (
        <RoleModal role={selectedRole} onClose={closeModal} />
      )}

    </>
  );
}
