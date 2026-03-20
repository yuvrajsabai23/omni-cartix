import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDownloadUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
      const result = await prisma.$transaction(async (tx) => {
      const link = await tx.downloadLink.findUnique({
        where: { token: params.token },
        include: { product: true },
      });

      if (!link) throw new Error("not_found");
      if (link.expiresAt < new Date()) throw new Error("expired");
      if (link.downloadCount >= link.maxDownloads) throw new Error("limit_reached");

      // Optional: verify user owns this download
      // if (link.userId && session?.user?.id && link.userId !== session.user.id) throw new Error("unauthorized");

      await tx.downloadLink.update({
        where: { id: link.id },
        data: { downloadCount: { increment: 1 }, lastDownloadAt: new Date() },
      });

      return link;
    });

    if (!result.product.digitalFileKey) {
      return NextResponse.json({ error: "Download file not found." }, { status: 404 });
    }

    const downloadUrl = await getDownloadUrl(result.product.digitalFileKey);
    return NextResponse.redirect(downloadUrl);
  } catch (err: unknown) {
    if ((err as Error).message === "not_found") {
      return NextResponse.json({ error: "Download link not found." }, { status: 404 });
    }
    if ((err as Error).message === "expired") {
      return NextResponse.json({ error: "This download link has expired. Please contact support to get a new link." }, { status: 410 });
    }
    if ((err as Error).message === "limit_reached") {
      return NextResponse.json({ error: "Download limit reached for this link. Please contact support." }, { status: 403 });
    }
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed." }, { status: 500 });
  }
}
