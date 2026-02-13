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

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}

function foldVCardLine(line: string) {
  const maxLineLength = 75;
  if (line.length <= maxLineLength) {
    return [line];
  }

  const folded: string[] = [];
  let index = 0;
  while (index < line.length) {
    const chunk = line.slice(index, index + maxLineLength);
    folded.push(index === 0 ? chunk : ` ${chunk}`);
    index += maxLineLength;
  }
  return folded;
}

async function getEmbeddedPhotoLines() {
  try {
    const imagePath = path.join(process.cwd(), "public", "charizard.png");
    const imageBuffer = await readFile(imagePath);
    const base64 = imageBuffer.toString("base64");
    return foldVCardLine(`PHOTO;ENCODING=b;TYPE=PNG:${base64}`);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const firstName = searchParams.get("firstName")?.trim() || "Antonia";
  const lastName = searchParams.get("lastName")?.trim() || "Gianakas";
  const phone = searchParams.get("phone")?.trim() || "+17082037932";
  const email = searchParams.get("email")?.trim() || "";
  const org = searchParams.get("org")?.trim() || "Hawk Media";
  const title = searchParams.get("title")?.trim() || "Marketing with Energy Mastery";
  const note =
    searchParams.get("note")?.trim() ||
    "Making relationships built to last, the Charizard Way.";
  const profileImageUrl = searchParams.get("photoUrl")?.trim() || "";
  const embeddedPhotoLines = await getEmbeddedPhotoLines();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(`${firstName} ${lastName}`.trim())}`,
    `ORG:${escapeVCardValue(org)}`,
    `TITLE:${escapeVCardValue(title)}`,
    `NOTE:${escapeVCardValue(note)}`,
    `TEL;TYPE=CELL:${escapeVCardValue(phone)}`,
  ];

  if (email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(email)}`);
  }

  if (embeddedPhotoLines.length > 0) {
    lines.push(...embeddedPhotoLines);
  } else if (profileImageUrl) {
    lines.push(`PHOTO;VALUE=URI:${escapeVCardValue(profileImageUrl)}`);
  }

  lines.push("END:VCARD");

  const vcardText = `${lines.join("\r\n")}\r\n`;
  const safeFirst = sanitizeFilenamePart(firstName) || "Contact";
  const safeLast = sanitizeFilenamePart(lastName);
  const filename = safeLast ? `${safeFirst}_${safeLast}.vcf` : `${safeFirst}.vcf`;

  return new NextResponse(vcardText, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
