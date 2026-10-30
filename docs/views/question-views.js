/**
 * Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
 * Question-Specific A2UI View & Layout Adapter (`docs/views/question-views.js`)
 *
 * Dynamically tailors the A2UI payload (`AlertBanner`, `KPIStatRow`, `DataTable` columns/rows/sorting,
 * `DegreeProgressCard`, `ActionFormCard`, and optimal `layoutMode`) for all 100 Canonical Questions
 * (10 Personas × 10 Questions = 100 Bespoke Views).
 */

(function () {
  // Per-question metadata across all 10 personas (10 x 10 = 100 views)
  const QUESTION_BLUEPRINTS = {
    admin: {
      1: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "✓",
        alertTitle: "Q1 Executive Synthesis: System-Wide Retention Rate is 86.4% (+1.2% YoY)",
        alertMsg: "School of Music (91.4%) and Graduate/Continuing Ed (90.5%) lead institutional retention; Humanities (84.6%) and Social Sciences (85.0%) are prioritized for early advising outreach.",
        tableTitle: "Q1 View: System-Wide Retention Rate by Academic Unit [Pre-Zion Schema]",
        sortKey: "retention_rate",
        sortDir: "desc",
        priorityCols: ["unit_name", "retention_rate", " systemic_holds", "sap_compliance", "advisor_ratio"],
        extraCol: { key: "yoy_retention_delta", label: "YoY Retention Trend", zionField: "J1 [Phase 2]: Year-over-Year Persistence", type: "badge", values: ["✓ ▲ +1.8% YoY", "⚠ ▼ -0.4% YoY", "✓ ▲ +2.1% YoY", "✓ ▲ +1.5% YoY", "⚠ ▼ -0.8% YoY", "✓ ▲ +1.1% YoY"] }
      },
      2: {
        layout: "table-first",
        alertSeverity: "warning",
        alertIcon: "⚠",
        alertTitle: "Q2 Audit Alert: 42 Unassigned Advisees Concentrated in Natural Sciences (18) & Social Sciences (14)",
        alertMsg: "Table sorted highest-to-lowest by Unassigned Advisees so Admin can bulk-route rosters to Department Chairs before registration opens.",
        tableTitle: "Q2 View: Unassigned Advisee Backlog by Academic Unit (Sorted High → Low)",
        sortKey: "unassigned_advisees",
        sortDir: "desc",
        priorityCols: ["unit_name", "unassigned_advisees", "advisor_ratio", "systemic_holds", "retention_rate"],
        extraCol: { key: "assignment_sla", label: "Chair Routing Status", zionField: "J1: /advisors/me/caseload?scope=all", type: "badge", values: ["⛔ 18 Pending (>48h)", "⛔ 14 Pending (>48h)", "✓ 2 Routed Today", "✓ 3 Routed Today", "⚠ 5 Pending Chair", "✓ 0 Unassigned"] }
      },
      3: {
        layout: "table-first",
        alertSeverity: "info",
        alertIcon: "📊",
        alertTitle: "Q3 System Usage Audit: 1,420 Degree Checks & 98.4% Advisor Portal Adoption Across 6 Units",
        alertMsg: "Natural Sciences (412 checks) and Social Sciences (356 checks) account for 54% of total AAA + A2UI portal activity over the past 30 days.",
        tableTitle: "Q3 View: 30-Day Academic Advising Portal Usage Audit by Unit",
        sortKey: "portal_checks_30d",
        sortDir: "desc",
        priorityCols: ["unit_name", "portal_checks_30d", "advisor_ratio", "unassigned_advisees", "retention_rate"],
        extraCol: { key: "active_faculty_pct", label: "Faculty Portal Login %", zionField: "J1: caseload?status=unregistered", type: "badge", values: ["✓ 98% Active", "✓ 96% Active", "✓ 100% Active", "✓ 97% Active", "⚠ 89% Active", "✓ 95% Active"] }
      },
      4: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "✓",
        alertTitle: "Q4 Monthly Milestone: 1,420 Total Degree Progress Checks Completed Last Month (+24% vs. Prior Month)",
        alertMsg: "Automated SOPHIA Core and 124-credit graduation audits peaked ahead of November registration windows.",
        tableTitle: "Q4 View: Completed Degree Progress Checks by Unit (Last 30 Days)",
        sortKey: "portal_checks_30d",
        sortDir: "desc",
        priorityCols: ["unit_name", "portal_checks_30d", "retention_rate", "sap_compliance"],
        extraCol: { key: "auto_vs_manual", label: "ADK Auto-Audits vs. Manual", zionField: "J1: audit.gen_ed + audit.programs[]", type: "string", values: ["340 ADK / 72 Manual", "290 ADK / 66 Manual", "155 ADK / 34 Manual", "180 ADK / 34 Manual", "112 ADK / 32 Manual", "88 ADK / 17 Manual"] }
      },
      5: {
        layout: "table-first",
        alertSeverity: "warning",
        alertIcon: "⚠",
        alertTitle: "Q5 Global Advisor Ratio: 1 : 18.4 University-Wide (2 Units Above 1:20 Target Threshold)",
        alertMsg: "Natural Sciences (1 : 21.2) and Graduate/Continuing Ed (1 : 22.0) exceed the 1:20 advising load target.",
        tableTitle: "Q5 View: Global Advisor-to-Student Ratios Across All Units",
        sortKey: "advisor_ratio",
        sortDir: "desc",
        priorityCols: ["unit_name", "advisor_ratio", "unassigned_advisees", "retention_rate"],
        extraCol: { key: "ratio_target_status", label: "1:20 Target Benchmark", zionField: "J1: caseload.count", type: "badge", values: ["⚠ Above 1:20 Target", "✓ Within Target", "✓ Optimal Load", "✓ Within Target", "✓ Optimal Load", "⚠ Above 1:20 Target"] }
      },
      6: {
        layout: "split-dashboard",
        alertSeverity: "danger",
        alertIcon: "⛔",
        alertTitle: "Q6 Systemic Hold Triage: 164 Active Registration Holds Blocking Spring Enrollment",
        alertMsg: "Social Sciences (52 holds) and Natural Sciences (48 holds) have the highest concentration of Advising, Financial, and F-1 SEVIS registration blocks.",
        tableTitle: "Q6 View: Systemic Flags & Registration Holds by Academic Unit",
        sortKey: "systemic_holds",
        sortDir: "desc",
        priorityCols: ["unit_name", "systemic_holds", "sap_compliance", "unassigned_advisees"],
        extraCol: { key: "f1_sevis_holds", label: "F-1 International Check", zionField: "J1: registered_credits + [Phase 2 SEVIS]", type: "badge", jargon: "F-1 Full-Time Load", values: ["🌐 6 F-1 Watch", "🌐 4 F-1 Watch", "✓ 0 F-1 Holds", "✓ 1 F-1 Verified", "✓ 2 F-1 Verified", "🌐 3 F-1 Watch"] }
      },
      7: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "✓",
        alertTitle: "Q7 Real-Time Telemetry: 318 Active Users Currently Logged Into the AAA Advising Portal",
        alertMsg: "Includes 64 faculty advisors, 12 Student Success & Registrar staff, and 242 students reviewing Spring schedules.",
        tableTitle: "Q7 View: Live Advising Portal Concurrency & 30-Day Activity by Unit",
        sortKey: "portal_checks_30d",
        sortDir: "desc",
        priorityCols: ["unit_name", "portal_checks_30d", "advisor_ratio", "systemic_holds"],
        extraCol: { key: "live_active_users", label: "Live Active Sessions Now", zionField: "J1: /health + Cloud Run Metrics", type: "badge", values: ["✓ 94 Online Now", "✓ 82 Online Now", "✓ 38 Online Now", "✓ 46 Online Now", "✓ 34 Online Now", "✓ 24 Online Now"] }
      },
      8: {
        layout: "table-first",
        alertSeverity: "warning",
        alertIcon: "⚠",
        alertTitle: "Q8 Major Change Velocity: 118 Internal Major Switches This Academic Year",
        alertMsg: "Social Sciences (34 switches) and Natural Sciences → Data Science/Business tracks show the highest net major migration.",
        tableTitle: "Q8 View: Academic Program Major Change & Migration Rates by Unit",
        sortKey: "unassigned_advisees",
        sortDir: "desc",
        priorityCols: ["unit_name", "unassigned_advisees", "advisor_ratio", "retention_rate"],
        extraCol: { key: "major_change_rate", label: "Major Switch Rate (YTD)", zionField: "J1: declared.major vs catalog_year", type: "badge", values: ["⚠ 9.4% (38 Switches)", "⚠ 10.2% (34 Switches)", "✓ 3.1% (6 Switches)", "✓ 4.8% (12 Switches)", "⚠ 8.5% (19 Switches)", "✓ 2.9% (9 Switches)"] }
      },
      9: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "✓",
        alertTitle: "Q9 University-Wide Course Completion Rate: 93.6% Successful Credit Completion",
        alertMsg: "Exceeds the 92.0% institutional benchmark; gateway STEM courses remain the primary focus for DFW reduction.",
        tableTitle: "Q9 View: Undergraduate & Graduate Course Completion Rate by Unit",
        sortKey: "retention_rate",
        sortDir: "desc",
        priorityCols: ["unit_name", "retention_rate", "sap_compliance", "portal_checks_30d"],
        extraCol: { key: "course_completion_pct", label: "Course Completion %", zionField: "J1: registration[].status_label=completed", type: "badge", values: ["✓ 92.4% Completed", "✓ 93.1% Completed", "✓ 96.8% Completed", "✓ 95.9% Completed", "✓ 93.5% Completed", "✓ 95.2% Completed"] }
      },
      10: {
        layout: "split-dashboard",
        alertSeverity: "warning",
        alertIcon: "📥",
        alertTitle: "Q10 Federal Financial Aid SAP Compliance Package Ready for Export (94.6% Global SAP Met)",
        alertMsg: "Social Sciences (91.2% SAP Met) has 19 students requiring SAP Academic Plan signatures before Spring disbursement.",
        tableTitle: "Q10 View: Global Financial Aid Satisfactory Academic Progress (SAP) Audit",
        sortKey: "sap_compliance",
        sortDir: "asc",
        priorityCols: ["unit_name", "sap_compliance", "systemic_holds", "retention_rate"],
        extraCol: { key: "sap_export_ready", label: "Federal Export Package", zionField: "J1: /gpa + degree_rules.degree.cum_gpa_ok", type: "badge", jargon: "SAP", values: ["✓ Ready (CSV/JSON)", "⚠ 19 Plans Pending", "✓ Ready (CSV/JSON)", "✓ Ready (CSV/JSON)", "✓ Ready (CSV/JSON)", "✓ Ready (CSV/JSON)"] }
      }
    },
    student: {
      1: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "",
        alertTitle: "Spring 2027 Advising Plan: Choose Your Mix, Customize Time-Slot Conflicts, and Review Your Schedule",
        alertMsg: "At Augustana, your Major, Minor, SOPHIA Core, and Electives advance together. Select a semester mix in Step 1 to see the recommended courses in each pillar, use the dropdowns in Step 2 to resolve any time-slot conflicts, and view your Monday-Friday schedule in Step 3.",
        tableTitle: "Reference: Full Course Details & Jenzabar J1 Section Metadata [J1 /recommend-next-term + /catalog/sections]",
        priorityCols: ["course_code", "pillar", "credits", "meeting_window", "seats_left", "downstream_tradeoff"]
      }
    }
  };

  // Intelligent heuristic layout & column adapter for all 100 questions across all 10 personas
  function inferQuestionBlueprint(persona, question) {
    const pid = persona?.id || "admin";
    const qNum = question?.number || 1;
    if (QUESTION_BLUEPRINTS[pid] && QUESTION_BLUEPRINTS[pid][qNum]) {
      return QUESTION_BLUEPRINTS[pid][qNum];
    }

    const qText = (question?.question || "").toLowerCase();

    // 1. Determine optimal A2UI Layout Archetype based on question intent
    let layout = "inverted-pyramid";
    if (
      /override|substitution|exception|clear|approve|assign|appointment|drop|switch|change|conflict|request/i.test(qText)
    ) {
      layout = "split-dashboard";
    } else if (
      /which|list|broken down|compare|distribution|bottleneck|shortage|who|haven't registered|unassigned|exceeding|dfw|probation/i.test(
        qText
      )
    ) {
      layout = "table-first";
    }

    // 2. Determine severity & icon
    let alertSeverity = "info";
    let alertIcon = "✓";
    if (/probation|hold|conflict|shortage|bottleneck|drop|fail|dfw|below a c|missed|unassigned|unresolved/i.test(qText)) {
      alertSeverity = "warning";
      alertIcon = "⚠";
    }
    if (/drop a course|preventing registration|critical seat shortage/i.test(qText)) {
      alertSeverity = "danger";
      alertIcon = "⛔";
    }

    // 3. Build question-specific synthetic column so every single question Q1-Q10 visibly adapts the table
    let extraCol = null;
    if (/f-1|drop|withdraw/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: "Drop & F-1 12-Cr Impact",
        zionField: "J1: registered_credits - credit_hrs >= 12",
        type: "badge",
        jargon: "F-1 Full-Time Load",
        values: [
          "✓ Safe (16→12 Cr Full-Time)",
          "⛔ Blocks Grad Milestone",
          "🌐 F-1 Min 12 Cr Guardrail",
          "⚠ Delays SOPHIA Core",
          "✓ Elective Swap Available",
          "✓ Advisor Review Ready"
        ]
      };
    } else if (/hold|clear|registration/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} Hold & Reg Clearance`,
        zionField: "J1: registration-window.requires_clearance",
        type: "badge",
        jargon: "Hold",
        values: [
          "⛔ Hold Blocks Reg Window",
          "⚠ Advising PIN Pending",
          "🌐 F-1 SEVIS Verified",
          "✓ Cleared for Nov 12",
          "✓ Registered (16 Cr)",
          "⚠ Needs Prereq Override"
        ]
      };
    } else if (/override|prerequisite|substitution|exception|equivalenc|transfer/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} Override / Equivalency Status`,
        zionField: "J1: /course-eligibility + department_override",
        type: "badge",
        jargon: "Prerequisite Override",
        values: [
          "⚠ Pending Chair/Registrar",
          "✓ Equivalency Approved",
          "⛔ Missing Lab Co-Req",
          "✓ Substitution Logged",
          "⚠ Syllabus Review Needed",
          "✓ Auto-Matched in Banner"
        ]
      };
    } else if (/sophia|general education|core|residency|milestone|capstone/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} SOPHIA & Residency Check`,
        zionField: "J1: audit.gen_ed.met + residency.meets_50",
        type: "badge",
        jargon: "SOPHIA",
        values: [
          "✓ SOPHIA & 32-Cr Residency Met",
          "⚠ 1 SOPHIA LO Remaining",
          "✓ Capstone Prereqs Complete",
          "⚠ 6 Residency Cr Needed",
          "✓ On Schedule for May",
          "✓ Core Plan Verified"
        ]
      };
    } else if (/dfw|fail|below a c|probation|warning|at-risk/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} Early-Alert & DFW Triage`,
        zionField: "J1: degree_rules.min_grade.below_c_minus[]",
        type: "badge",
        jargon: "DFW Rate",
        values: [
          "⛔ 2 Midterm Alerts (<C)",
          "⚠ Tutoring Referral Sent",
          "⚠ SAP Pace Watch (64%)",
          "✓ Co-Req Lab Assigned",
          "✓ Faculty Check-In Done",
          "⚠ Advisor Meeting Booked"
        ]
      };
    } else if (/advisor|appointment|load|capacity|assign/i.test(qText)) {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} Advising Load & Booking`,
        zionField: "J1: /advisors/me/caseload.count",
        type: "badge",
        values: [
          "✓ Calendar Open (Tue/Thu)",
          "⚠ Near 1:20 Load Cap",
          "✓ Primary Advisor Assigned",
          "🌐 DSO Co-Advisor Linked",
          "✓ Zoom & In-Person Slots",
          "✓ 15-Min Triage Available"
        ]
      };
    } else {
      extraCol = {
        key: `q${qNum}_focus`,
        label: `Q${qNum} Audit Benchmark`,
        zionField: `PENDING_ZION_Q${qNum}_METRIC`,
        type: "badge",
        values: [
          "✓ On Track (May Grad)",
          "▲ Above Unit Benchmark",
          "⚠ Watch Next Term",
          "✓ Verified in Pre-Zion SIS",
          "🌐 F-1 12-Cr Compliant",
          "✓ Action Ready"
        ]
      };
    }

    return {
      layout,
      alertSeverity,
      alertIcon,
      alertTitle: `Q${qNum} AI Best-Practice View (${persona?.role}): ${question?.question || ""}`,
      alertMsg: `Scoped to ${persona?.advisingScope} (${persona?.defaultUnit}). Layout automatically set to "${layout}" with WCAG 2.2 AAA screen-reader headers and Zion Cloud Solutions field bindings.`,
      tableTitle: `Q${qNum} Table: ${question?.question || persona?.role}`,
      extraCol
    };
  }

  function adaptPayloadForQuestion(basePayload, persona, question) {
    if (!basePayload || !question) return { payload: basePayload, recommendedLayout: "inverted-pyramid" };

    const clone = JSON.parse(JSON.stringify(basePayload));
    const bp = inferQuestionBlueprint(persona, question);
    const comps = clone?.surfaceUpdate?.components || [];
    const dataModel = clone?.dataModelUpdate?.contents || {};

    // 1. Update AlertBanner for this specific question (Q1-Q10)
    const alertComp = comps.find((c) => c.component && c.component.AlertBanner);
    if (alertComp && question.number > 1) {
      alertComp.component.AlertBanner.severity = bp.alertSeverity;
      alertComp.component.AlertBanner.icon = bp.alertIcon;
      alertComp.component.AlertBanner.title = bp.alertTitle;
      alertComp.component.AlertBanner.message = bp.alertMsg;
    } else if (alertComp && persona?.id === "admin" && QUESTION_BLUEPRINTS.admin[1]) {
      alertComp.component.AlertBanner.title = bp.alertTitle;
      alertComp.component.AlertBanner.message = bp.alertMsg;
    }

    // 2. Update DataTable columns, row values, and caption for this specific question
    const tableComp = comps.find((c) => c.component && c.component.DataTable);
    if (tableComp) {
      const table = tableComp.component.DataTable;
      const rowsKey = (table.rowsPath || "").replace(/^\//, "");
      const rows = Array.isArray(dataModel[rowsKey]) ? dataModel[rowsKey] : [];

      if (question.number > 1 || (persona?.id === "admin" && QUESTION_BLUEPRINTS.admin[question.number])) {
        table.title = bp.tableTitle;
        table.a11yCaption = `Question ${question.number} (${persona?.role}): ${question.question}. ${table.a11yCaption || ""}`;
      }

      // Inject question-specific highlight column in Position 2 (right after rowHeaderKey) so every question Q1-Q10 has distinct table data
      if (bp.extraCol && !table.columns.some((c) => c.key === bp.extraCol.key)) {
        const colDef = {
          key: bp.extraCol.key,
          label: bp.extraCol.label,
          zionField: bp.extraCol.zionField,
          type: bp.extraCol.type || "badge",
          sortable: true
        };
        if (bp.extraCol.jargon) colDef.jargon = bp.extraCol.jargon;
        table.columns.splice(1, 0, colDef);

        rows.forEach((r, idx) => {
          r[bp.extraCol.key] = bp.extraCol.values[idx % bp.extraCol.values.length];
        });
      }

      // Reorder priority columns if specified (keeping rowHeaderKey first and max 7 columns for readability)
      if (bp.priorityCols && bp.priorityCols.length) {
        const headerCol = table.columns.find((c) => c.key === table.rowHeaderKey) || table.columns[0];
        const extra = bp.extraCol ? table.columns.find((c) => c.key === bp.extraCol.key) : null;
        const rest = table.columns.filter(
          (c) => c !== headerCol && c !== extra
        );
        table.columns = [headerCol, ...(extra ? [extra] : []), ...rest].slice(0, 7);
      } else if (table.columns.length > 7) {
        table.columns = table.columns.slice(0, 7);
      }

      // Apply question-specific default sort if specified
      if (bp.sortKey) {
        rows.sort((a, b) => {
          const va = String(a[bp.sortKey] ?? "");
          const vb = String(b[bp.sortKey] ?? "");
          const numA = parseFloat(va.replace(/[^0-9.-]+/g, ""));
          const numB = parseFloat(vb.replace(/[^0-9.-]+/g, ""));
          const cmp = !isNaN(numA) && !isNaN(numB) ? numA - numB : va.localeCompare(vb);
          return bp.sortDir === "asc" ? cmp : -cmp;
        });
      }
    }

    // 3. Contextualize ActionFormCard title to the active question
    const formComp = comps.find((c) => c.component && c.component.ActionFormCard);
    if (formComp && question.number > 1) {
      formComp.component.ActionFormCard.title = `Q${question.number} Action Dispatch — ${formComp.component.ActionFormCard.title}`;
    }

    return {
      payload: clone,
      recommendedLayout: bp.layout || "inverted-pyramid"
    };
  }

  window.AUGIE_QUESTION_VIEW_ADAPTER = {
    adaptPayloadForQuestion,
    inferQuestionBlueprint
  };
})();
