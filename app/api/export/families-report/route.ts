import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const monthNames: Record<number, string> = {
  1: "كانون الثاني",
  2: "شباط",
  3: "آذار",
  4: "نيسان",
  5: "أيار",
  6: "حزيران",
  7: "تموز",
  8: "آب",
  9: "أيلول",
  10: "تشرين الأول",
  11: "تشرين الثاني",
  12: "كانون الأول",
};

type FamilyRelation =
  | {
      id?: string | null;
      family_code?: string | null;
      family_name?: string | null;
      area?: string | null;
      phone?: string | null;
      members_count?: number | null;
      is_active?: boolean | null;
    }
  | Array<{
      id?: string | null;
      family_code?: string | null;
      family_name?: string | null;
      area?: string | null;
      phone?: string | null;
      members_count?: number | null;
      is_active?: boolean | null;
    }>
  | null
  | undefined;

function safeSheetName(name: string) {
  return name.replace(/[\\/*?:[\]]/g, "").slice(0, 31) || "تقرير";
}

function formatTime(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleTimeString("ar-IQ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}/${month}/${day}`;
}

function getFamilyObject(families: FamilyRelation) {
  if (Array.isArray(families)) {
    return families[0] ?? null;
  }
  return families ?? null;
}

export async function GET() {
  const userClient = await createClient();
  const { data: userData } = await userClient.auth.getUser();

  if (!userData.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("monthly_distributions")
    .select(`
      id,
      month,
      year,
      members_count_at_delivery,
      notes,
      created_at,
      families (
        id,
        family_code,
        family_name,
        area,
        phone,
        members_count,
        is_active
      ),
      monthly_distribution_items (*)
    `)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  const grouped = new Map<string, any[]>();

  for (const record of data ?? []) {
    const family = getFamilyObject(record.families);
    const familyId = family?.id;

    if (!familyId) continue;

    if (!grouped.has(familyId)) grouped.set(familyId, []);

    grouped.get(familyId)!.push({
      ...record,
      family,
    });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ration Distribution Admin";
  workbook.created = new Date();

  for (const [, records] of grouped) {
    const family = records[0]?.family;

    if (!family) continue;

    const familyName = family.family_name ?? "عائلة";
    const familyCode = family.family_code ?? "بدون رمز";

    const sheet = workbook.addWorksheet(
      safeSheetName(`${familyName} - ${familyCode}`)
    );

    sheet.views = [{ rightToLeft: true, state: "frozen", ySplit: 5 }];
    sheet.properties.defaultRowHeight = 24;

    sheet.columns = [
      { key: "a", width: 18 },
      { key: "b", width: 12 },
      { key: "c", width: 20 },
      { key: "d", width: 16 },
      { key: "e", width: 20 },
      { key: "f", width: 28 },
    ];

    sheet.mergeCells("A1:F1");
    sheet.getCell("A1").value = `سجل العائلة - ${familyName}`;
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEDE7F6" },
    };
    sheet.getRow(1).height = 28;

    sheet.getCell("A2").value = "اسم العائلة";
    sheet.getCell("B2").value = "المنطقة";
    sheet.getCell("C2").value = "عدد الأفراد";
    sheet.getCell("E2").value = "رمز العائلة";
    sheet.getCell("F2").value = "الهاتف";

    sheet.getCell("A3").value = family.family_name ?? "";
    sheet.getCell("B3").value = family.area ?? "";
    sheet.getCell("C3").value = family.members_count ?? "";
    sheet.getCell("E3").value = family.family_code ?? "";
    sheet.getCell("F3").value = family.phone ?? "";

    ["A2", "B2", "C2", "E2", "F2"].forEach((addr) => {
      const cell = sheet.getCell(addr);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF808080" } },
        bottom: { style: "thin", color: { argb: "FF808080" } },
        left: { style: "thin", color: { argb: "FF808080" } },
        right: { style: "thin", color: { argb: "FF808080" } },
      };
    });

    ["A3", "B3", "C3", "E3", "F3"].forEach((addr) => {
      const cell = sheet.getCell(addr);
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF999999" } },
        bottom: { style: "thin", color: { argb: "FF999999" } },
        left: { style: "thin", color: { argb: "FF999999" } },
        right: { style: "thin", color: { argb: "FF999999" } },
      };
    });

    const headerRowIndex = 5;
    const headers = [
      "الشهر",
      "السنة",
      "تاريخ الاستلام",
      "وقت الاستلام",
      "عدد الأفراد وقت التسليم",
      "ملاحظات",
    ];

    headers.forEach((header, index) => {
      const cell = sheet.getCell(headerRowIndex, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF9E9E9E" } },
        bottom: { style: "thin", color: { argb: "FF9E9E9E" } },
        left: { style: "thin", color: { argb: "FF9E9E9E" } },
        right: { style: "thin", color: { argb: "FF9E9E9E" } },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: index === 5 ? "FFF3E5AB" : "FFE2F0D9",
        },
      };
    });

    let rowIndex = 6;

    for (const record of records) {
      const row = sheet.getRow(rowIndex);

      row.getCell(1).value = monthNames[record.month] ?? record.month;
      row.getCell(2).value = record.year;
      row.getCell(3).value = formatDate(record.created_at);
      row.getCell(4).value = formatTime(record.created_at);
      row.getCell(5).value = record.members_count_at_delivery ?? "";
      row.getCell(6).value = record.notes ?? "";

      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD0D0D0" } },
          bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
          left: { style: "thin", color: { argb: "FFD0D0D0" } },
          right: { style: "thin", color: { argb: "FFD0D0D0" } },
        };
      });

      row.getCell(6).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      rowIndex++;
    }

    sheet.autoFilter = {
      from: { row: 5, column: 1 },
      to: { row: 5, column: 6 },
    };
  }

  if (workbook.worksheets.length === 0) {
    const emptySheet = workbook.addWorksheet("تقرير العوائل");
    emptySheet.getCell("A1").value = "لا توجد بيانات متاحة";
    emptySheet.getCell("A1").font = { bold: true, size: 14 };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="family-report-all.xlsx"',
    },
  });
}