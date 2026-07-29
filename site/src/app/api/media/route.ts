import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";
import {
  uploadImage,
  listImages,
  deleteImage,
  isValidMediaKey,
} from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

// The public proxy URL a stored `media/...` pathname is served from. Kept in one
// place so POST and GET hand the editor identical, ready-to-use <img src> values.
function publicUrl(pathname: string): string {
  return `/api/media/file/${pathname}`;
}

// Upload one image (multipart/form-data, field "file"). Auth + same-origin gated.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const { pathname } = await uploadImage(file.name, bytes, file.type);
    return NextResponse.json({ pathname, url: publicUrl(pathname) });
  } catch (err) {
    // uploadImage throws on a bad type / oversize payload — that's a 400.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}

// List every stored image (auth-gated), newest first, with proxy URLs.
export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const images = await listImages();
    return NextResponse.json({
      images: images.map((img) => ({
        pathname: img.pathname,
        url: publicUrl(img.pathname),
        uploadedAt: img.uploadedAt,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "List failed." },
      { status: 500 },
    );
  }
}

// Delete one image by `?pathname=`. Auth + same-origin gated.
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pathname = req.nextUrl.searchParams.get("pathname");
  if (!pathname || !isValidMediaKey(pathname)) {
    return NextResponse.json({ error: "Invalid pathname." }, { status: 400 });
  }
  try {
    await deleteImage(pathname);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed." },
      { status: 500 },
    );
  }
}
