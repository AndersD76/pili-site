import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  BarChart3,
  Target,
} from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { startOfCurrentMonth, formatDate } from "@/lib/datetime";
import { logError } from "@/lib/prisma-errors";
import { db } from "@/lib/db";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getDashboardData() {
  try {
    // Leads excluídos (soft delete) não podem contar em métrica nenhuma.
    const active = { deletedAt: null };
    const startOfMonth = startOfCurrentMonth();

    const [leadsThisMonth, totalLeads, leadsByStatus, recentLeads] =
      await Promise.all([
        db.lead.count({
          where: { ...active, createdAt: { gte: startOfMonth } },
        }),
        db.lead.count({ where: active }),
        db.lead.groupBy({
          by: ["status"],
          where: active,
          _count: { id: true },
        }),
        db.lead.findMany({
          where: active,
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    const wonCount =
      leadsByStatus.find((s) => s.status === "GANHO")?._count.id ?? 0;
    const conversionRate =
      totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) : "0";

    const newCount =
      leadsByStatus.find((s) => s.status === "NOVO")?._count.id ?? 0;

    return {
      failed: false,
      leadsThisMonth,
      totalLeads,
      conversionRate,
      newCount,
      recentLeads,
    };
  } catch (err) {
    logError("ADMIN_DASHBOARD", err);
    return {
      failed: true,
      leadsThisMonth: 0,
      totalLeads: 0,
      conversionRate: "0",
      newCount: 0,
      recentLeads: [],
    };
  }
}

export default async function AdminDashboardPage() {
  await requireRole("ADMIN", "COMERCIAL", "TECNICO");
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-pili-black">
        Dashboard
      </h1>

      {data.failed && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Não foi possível carregar os indicadores agora. Os números abaixo não
          refletem a base — tente recarregar em instantes.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Leads este mês"
          value={data.leadsThisMonth}
          description="Novos contatos no periodo"
          icon={Users}
        />
        <StatsCard
          title="Leads novos"
          value={data.newCount}
          description="Aguardando qualificação"
          icon={BarChart3}
        />
        <StatsCard
          title="Total de leads"
          value={data.totalLeads}
          description="Desde o início"
          icon={TrendingUp}
        />
        <StatsCard
          title="Taxa de conversão"
          value={`${data.conversionRate}%`}
          description="Leads ganhos / total"
          icon={Target}
        />
      </div>

      <Card className="border-pili-mist shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pili-black">
            Leads recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentLeads.length === 0 ? (
            <p className="py-8 text-center text-sm text-pili-concrete">
              Nenhum lead encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">
                    E-mail
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Origem
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentLeads.map((lead) => (
                  <TableRow key={lead.id} className="group">
                    <TableCell>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-medium text-pili-black hover:text-pili-safety-deep underline-offset-4 hover:underline"
                      >
                        {lead.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-pili-concrete md:table-cell">
                      {lead.email}
                    </TableCell>
                    <TableCell className="hidden text-xs uppercase text-pili-concrete sm:table-cell">
                      {lead.source}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="hidden text-sm text-pili-concrete lg:table-cell">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
