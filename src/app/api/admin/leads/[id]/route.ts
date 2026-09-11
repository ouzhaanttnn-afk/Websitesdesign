import { NextResponse, type NextRequest } from "next/server";
import { getLeadById, updateLeadStatus } from "@/domains/leads/repository";
import type { LeadStatus } from "@/domains/leads/types";

const VALID: LeadStatus[] = ["NEW", "CONTACTED", "WON", "LOST"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getLeadById(id)) return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !VALID.includes(body.status as LeadStatus)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const lead = updateLeadStatus(id, body.status as LeadStatus);
  return NextResponse.json({ lead });
}
