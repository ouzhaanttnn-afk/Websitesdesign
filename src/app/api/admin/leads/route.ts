import { NextResponse, type NextRequest } from "next/server";
import { listLeads } from "@/domains/leads/repository";
import type { LeadStatus } from "@/domains/leads/types";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") as LeadStatus | null;
  const leads = listLeads({ status: status ?? undefined });
  return NextResponse.json({ leads });
}
