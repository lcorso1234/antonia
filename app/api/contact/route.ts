import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function cleanFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
}

function foldVCardLine(line: string) {
  const maxLen = 75;
  if (line.length <= maxLen) {
    return [line];
  }

  const result: string[] = [];
  let i = 0;
  while (i < line.length) {
    const chunk = line.slice(i, i + maxLen);
    result.push(i === 0 ? chunk : ` ${chunk}`);
    i += maxLen;
  }
  return result;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const firstName = searchParams.get("firstName")?.trim() || "Contact";
  const lastName = searchParams.get("lastName")?.trim() || "Card";
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = searchParams.get("phone")?.trim() || "";
  const email = searchParams.get("email")?.trim() || "";
  const org = searchParams.get("org")?.trim() || "";
  const title = searchParams.get("title")?.trim() || "Pokemon Leader";
  const note = searchParams.get("note")?.trim() || "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(fullName)}`,
  ];

  if (org) {
    lines.push(`ORG:${escapeVCardValue(org)}`);
  }
  if (title) {
    lines.push(`TITLE:${escapeVCardValue(title)}`);
  }
  if (note) {
    lines.push(`NOTE:${escapeVCardValue(note)}`);
  }
  if (phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(phone)}`);
  }
  if (email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(email)}`);
  }

  try {
    const imagePath = path.join(process.cwd(), "public", "charizard.png");
    const imageBase64 = (await readFile(imagePath)).toString("base64");
    lines.push(...foldVCardLine(`PHOTO;ENCODING=b;TYPE=PNG:${imageBase64}`));
  } catch {
    // If image is unavailable, vCard is still valid without PHOTO.
  }

  lines.push("END:VCARD");

  const vcard = `${lines.join("\r\n")}\r\n`;
  const safeFirst = cleanFilename(firstName) || "Contact";
  const safeLast = cleanFilename(lastName);
  const filename = safeLast ? `${safeFirst}_${safeLast}.vcf` : `${safeFirst}.vcf`;

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
