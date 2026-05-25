"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createPageSchema,
  customButtonSchema,
  socialLinkSchema,
  updatePageSchema,
} from "@/lib/page-schemas";

type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");
  return session.user.id;
}

async function assertOwner(
  clientPageId: string,
  userId: string,
): Promise<void> {
  const page = await prisma.clientPage.findUnique({
    where: { id: clientPageId },
    select: { ownerId: true },
  });
  if (!page) throw new Error("Página não encontrada");
  if (page.ownerId !== userId) throw new Error("Sem permissão");
}

// ============================================================
// ClientPage CRUD
// ============================================================

export async function createClientPage(input: {
  name: string;
  slug: string;
}): Promise<ActionResult<{ id: string }>> {
  let createdId: string | null = null;
  try {
    const userId = await requireUserId();
    const parsed = createPageSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido" };
    }

    const existing = await prisma.clientPage.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) {
      return { ok: false, error: "Esse slug já está em uso" };
    }

    const page = await prisma.clientPage.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        ownerId: userId,
      },
      select: { id: true },
    });
    createdId = page.id;
    revalidatePath("/dashboard");
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
  // redirect() throws — must be outside try/catch
  if (createdId) redirect(`/dashboard/clients/${createdId}`);
  return { ok: true };
}

export async function updateClientPage(
  clientPageId: string,
  input: {
    name: string;
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    themeColor: string;
    themeMode: "LIGHT" | "DARK" | "AUTO";
  },
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await assertOwner(clientPageId, userId);

    const parsed = updatePageSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido" };
    }

    const page = await prisma.clientPage.update({
      where: { id: clientPageId },
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null,
        coverUrl: parsed.data.coverUrl || null,
        themeColor: parsed.data.themeColor,
        themeMode: parsed.data.themeMode,
      },
      select: { slug: true },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/clients/${clientPageId}`);
    revalidatePath(`/p/${page.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}

export async function deleteClientPage(
  clientPageId: string,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const page = await prisma.clientPage.findUnique({
      where: { id: clientPageId },
      select: { ownerId: true, slug: true },
    });
    if (!page) return { ok: false, error: "Página não encontrada" };
    if (page.ownerId !== userId) return { ok: false, error: "Sem permissão" };

    await prisma.clientPage.delete({ where: { id: clientPageId } });
    revalidatePath("/dashboard");
    revalidatePath(`/p/${page.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}

// ============================================================
// SocialLinks
// ============================================================

export async function addSocialLink(
  clientPageId: string,
  input: { platform: string; url: string },
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await assertOwner(clientPageId, userId);

    const parsed = socialLinkSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido" };
    }

    const count = await prisma.socialLink.count({ where: { clientPageId } });
    await prisma.socialLink.create({
      data: {
        clientPageId,
        platform: parsed.data.platform,
        url: parsed.data.url,
        order: count,
      },
    });

    const page = await prisma.clientPage.findUnique({
      where: { id: clientPageId },
      select: { slug: true },
    });
    revalidatePath(`/dashboard/clients/${clientPageId}`);
    if (page) revalidatePath(`/p/${page.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}

export async function removeSocialLink(
  socialLinkId: string,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const link = await prisma.socialLink.findUnique({
      where: { id: socialLinkId },
      select: { clientPageId: true, clientPage: { select: { ownerId: true, slug: true } } },
    });
    if (!link) return { ok: false, error: "Não encontrado" };
    if (link.clientPage.ownerId !== userId)
      return { ok: false, error: "Sem permissão" };

    await prisma.socialLink.delete({ where: { id: socialLinkId } });
    revalidatePath(`/dashboard/clients/${link.clientPageId}`);
    revalidatePath(`/p/${link.clientPage.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}

// ============================================================
// CustomButtons
// ============================================================

export async function addCustomButton(
  clientPageId: string,
  input: { label: string; url: string },
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await assertOwner(clientPageId, userId);

    const parsed = customButtonSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido" };
    }

    const count = await prisma.customButton.count({ where: { clientPageId } });
    await prisma.customButton.create({
      data: {
        clientPageId,
        label: parsed.data.label,
        url: parsed.data.url,
        order: count,
      },
    });

    const page = await prisma.clientPage.findUnique({
      where: { id: clientPageId },
      select: { slug: true },
    });
    revalidatePath(`/dashboard/clients/${clientPageId}`);
    if (page) revalidatePath(`/p/${page.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}

export async function removeCustomButton(
  buttonId: string,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const btn = await prisma.customButton.findUnique({
      where: { id: buttonId },
      select: { clientPageId: true, clientPage: { select: { ownerId: true, slug: true } } },
    });
    if (!btn) return { ok: false, error: "Não encontrado" };
    if (btn.clientPage.ownerId !== userId)
      return { ok: false, error: "Sem permissão" };

    await prisma.customButton.delete({ where: { id: buttonId } });
    revalidatePath(`/dashboard/clients/${btn.clientPageId}`);
    revalidatePath(`/p/${btn.clientPage.slug}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}
