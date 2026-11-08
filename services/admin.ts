import { db } from "@/lib/db";
import { contractsTable, customersTable, washesTable, carsTable, staffsTable, packagesTable } from "@/lib/db/schema";
import { eq, desc, count, gte, sql } from "drizzle-orm";

export async function getAdminStats() {
  const [totalCustomers] = await db.select({ count: count() }).from(customersTable);
  const [activeContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "active"));
  const [completedWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "acknowledged"));
  const [pendingWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "pending"));

  return {
    totalCustomers: totalCustomers.count,
    activeContracts: activeContracts.count,
    completedWashes: completedWashes.count,
    pendingWashes: pendingWashes.count,
  };
}

export async function getAllContracts() {
  return await db.query.contractsTable.findMany({
    orderBy: [desc(contractsTable.createdAt)],
    with: {
      customer: {
        with: { user: true },
      },
      car: true,
      washes: true,
    },
  });
}

export async function getAllCustomers() {
  return await db.query.customersTable.findMany({
    with: {
      user: true,
      cars: true,
      contracts: true,
    },
  });
}

export async function getAllCars() {
  return await db.query.carsTable.findMany({
    orderBy: [desc(carsTable.createdAt)],
    with: {
      customer: {
        with: { user: true },
      },
    },
  });
}

/* ── Read-only aggregates used by the redesigned dashboard & reports ────── */

export async function getDashboardOverview() {
  const [totalCustomers] = await db.select({ count: count() }).from(customersTable);
  const [totalCars] = await db.select({ count: count() }).from(carsTable);
  const [totalStaff] = await db.select({ count: count() }).from(staffsTable);
  const [activeContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "active"));
  const [completedContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "completed"));
  const [cancelledContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "cancelled"));
  const [totalPackages] = await db.select({ count: count() }).from(packagesTable);

  const [pendingWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "pending"));
  const [doneWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "done"));
  const [acknowledgedWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "acknowledged"));

  // Washes per month over the last 6 months
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const monthlyRows = await db
    .select({
      key: sql<string>`to_char(${washesTable.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(washesTable)
    .where(gte(washesTable.createdAt, since))
    .groupBy(sql`1`);

  const monthlyWashes = buildLastMonths(6).map(({ key, label }) => ({
    label,
    value: monthlyRows.find((row) => row.key === key)?.count ?? 0,
  }));

  return {
    totalCustomers: totalCustomers.count,
    totalCars: totalCars.count,
    totalStaff: totalStaff.count,
    totalPackages: totalPackages.count,
    activeContracts: activeContracts.count,
    completedContracts: completedContracts.count,
    cancelledContracts: cancelledContracts.count,
    pendingWashes: pendingWashes.count,
    doneWashes: doneWashes.count,
    acknowledgedWashes: acknowledgedWashes.count,
    monthlyWashes,
  };
}

function buildLastMonths(months: number) {
  const result: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" }),
    });
  }
  return result;
}

export async function getReportsData() {
  const [activeContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "active"));
  const [completedContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "completed"));
  const [cancelledContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "cancelled"));
  const [pendingWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "pending"));
  const [doneWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "done"));
  const [acknowledgedWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "acknowledged"));
  const [insideWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.type, "inside"));
  const [outsideWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.type, "outside"));

  // Most popular packages by number of contracts
  const packageRows = await db
    .select({
      name: contractsTable.packageType,
      count: count(),
    })
    .from(contractsTable)
    .groupBy(contractsTable.packageType)
    .orderBy(desc(count()))
    .limit(5);

  // Washes per month over the last 6 months
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const monthlyRows = await db
    .select({
      key: sql<string>`to_char(${washesTable.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(washesTable)
    .where(gte(washesTable.createdAt, since))
    .groupBy(sql`1`);

  const monthlyWashes = buildLastMonths(6).map(({ key, label }) => ({
    label,
    value: monthlyRows.find((row) => row.key === key)?.count ?? 0,
  }));

  return {
    contracts: {
      activeContracts: activeContracts.count,
      completedContracts: completedContracts.count,
      cancelledContracts: cancelledContracts.count,
    },
    washes: {
      pendingWashes: pendingWashes.count,
      doneWashes: doneWashes.count,
      acknowledgedWashes: acknowledgedWashes.count,
      insideWashes: insideWashes.count,
      outsideWashes: outsideWashes.count,
    },
    monthlyWashes,
    topPackages: packageRows,
  };
}
