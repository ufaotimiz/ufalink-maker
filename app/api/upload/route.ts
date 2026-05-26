import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

const MAX_BYTES = 5 * 1024 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = [
  "image/*",
  "audio/*",
  "video/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "text/plain",
  "text/csv",
];

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch (err) {
    console.error("[upload] body parse failed", err);
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session?.user?.id) {
          throw new Error("Não autenticado");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session.user.id, pathname }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[upload] completed", { url: blob.url });
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    console.error("[upload] handleUpload threw", {
      message: err instanceof Error ? err.message : String(err),
      bodyType: body?.type,
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro no upload" },
      { status: 400 },
    );
  }
}
