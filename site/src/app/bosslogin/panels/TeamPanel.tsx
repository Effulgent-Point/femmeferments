"use client";

import MediaPicker from "@/components/MediaPicker";
import type { TeamData, TeamMember } from "@/lib/content";
import {
  Field,
  cardStyle,
  addBtn,
  removeBtn,
  MoveButtons,
  moveItem,
} from "../fields";

export function TeamPanel({
  data,
  onChange,
}: {
  data: TeamData;
  onChange: (next: TeamData) => void;
}) {
  const members = data.members ?? [];

  function updateMembers(next: TeamMember[]) {
    onChange({ ...data, members: next });
  }

  function updateMember(i: number, patch: Partial<TeamMember>) {
    updateMembers(
      members.map((member, j) => (j === i ? { ...member, ...patch } : member)),
    );
  }

  return (
    <div>
      <Field
        label="Intro"
        value={data.intro}
        onChange={(v) => onChange({ ...data, intro: v })}
        textarea
      />

      {members.map((member, i) => (
        <div key={i} style={cardStyle}>
          <MediaPicker
            label="Photo"
            value={member.photo}
            onChange={(url) => updateMember(i, { photo: url })}
          />
          <Field
            label="Name"
            value={member.name}
            onChange={(v) => updateMember(i, { name: v })}
          />
          <Field
            label="Role"
            value={member.role}
            onChange={(v) => updateMember(i, { role: v })}
          />
          <Field
            label="Bio"
            value={member.bio}
            onChange={(v) => updateMember(i, { bio: v })}
            textarea
          />
          <div className="flex items-center gap-2">
            <MoveButtons
              onUp={() => updateMembers(moveItem(members, i, -1))}
              onDown={() => updateMembers(moveItem(members, i, 1))}
              isFirst={i === 0}
              isLast={i === members.length - 1}
            />
            <button
              type="button"
              onClick={() => updateMembers(members.filter((_, j) => j !== i))}
              aria-label={`Remove person ${i + 1}`}
              style={removeBtn}
            >
              &times;
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          updateMembers([
            ...members,
            { name: "", role: "", photo: "", bio: "" },
          ])
        }
        style={addBtn}
      >
        + Add person
      </button>
    </div>
  );
}
