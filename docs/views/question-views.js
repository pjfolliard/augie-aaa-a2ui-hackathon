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
      },
      2: {
        layout: "inverted-pyramid",
        alertSeverity: "info",
        alertIcon: "",
        alertTitle: "Projected Graduation Date: May 2028 (92 of 124 Credits Completed — 32 Credits / 8 Courses Remaining)",
        alertMsg: "You are on track to graduate in May 2028 in 3 standard semesters. Because only 16 of your remaining 32 credits are required Major, Minor, or SOPHIA courses, you have 16 open credits of flexibility to either accelerate your graduation or explore another minor, double major, certificate, or internship.",
        tableTitle: "Reference: Multi-Term Graduation Audit & Credit Breakdown [J1 /students/me/graduation-audit]",
        priorityCols: ["course_code", "pillar", "credits", "meeting_window", "downstream_tradeoff"]
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

  function buildStudentQ2Payload(basePayload) {
    const baseData = basePayload?.dataModelUpdate?.contents || {};
    const courseCatalogDetails = baseData.courseCatalogDetails || {};

    return {
      surfaceId: "augie-aaa-student-q2-surface",
      beginRendering: {
        surfaceId: "augie-aaa-student-q2-surface",
        root: "root-layout",
        catalogId: "augie-aaa-a2ui-v1"
      },
      surfaceUpdate: {
        surfaceId: "augie-aaa-student-q2-surface",
        components: [
          {
            id: "root-layout",
            component: {
              Column: {
                children: {
                  explicitList: [
                    "student-q2-alert",
                    "student-q2-kpis",
                    "student-q2-explorer",
                    "student-q2-progress",
                    "student-q2-export"
                  ]
                }
              }
            }
          },
          {
            id: "student-q2-alert",
            component: {
              AlertBanner: {
                severity: "info",
                icon: "",
                title: "Projected Graduation Date: May 2028 (92 of 124 Credits Completed — 32 Credits / 8 Courses Remaining)",
                message:
                  "You are on track to graduate in May 2028 in 3 standard semesters. Because only 16 of your remaining 32 credits are required for your Data Science Major, Mathematics Minor, and SOPHIA Core, you have 16 open credits of flexibility. Choose a guided question below to see how you can accelerate your graduation to December 2027 (via J-Term and Summer) or use those 16 open credits to add another minor, certificate, or internship.",
                jargonTerms: ["SOPHIA", "Residency Requirement", "F-1 Full-Time Load"]
              }
            }
          },
          {
            id: "student-q2-kpis",
            component: {
              KPIStatRow: {
                items: [
                  {
                    label: "Projected Graduation Term",
                    value: "May 2028",
                    trend: "3 Semesters Left · Can Accelerate to Dec 2027",
                    status: "success",
                    zionField: "J1: /students/me/graduation-audit"
                  },
                  {
                    label: "Credits Completed vs. Required",
                    value: "92 / 124 Cr",
                    trend: "32 Credits Left (16 Required + 16 Open)",
                    status: "success",
                    zionField: "J1: degree_rules.degree.credits_earned"
                  },
                  {
                    label: "Augustana Residency Rule",
                    value: "32 / 32 Cr Met",
                    trend: "Final 40 Credits On-Campus Rule Satisfied",
                    status: "success",
                    zionField: "J1: degree_rules.residency",
                    jargon: "Residency Requirement"
                  },
                  {
                    label: "F-1 Full-Time Pace",
                    value: "12+ Cr / Term",
                    trend: "Full-Time Status Verified Through Graduation",
                    status: "success",
                    zionField: "J1: registered_credits >= 12",
                    jargon: "F-1 Full-Time Load"
                  }
                ]
              }
            }
          },
          {
            id: "student-q2-explorer",
            component: {
              GraduationPathwayExplorer: {
                title: "Step 1: Guide Your Graduation Timeline — What Would You Like to Do Next?",
                subtitle:
                  "Click any follow-up option below to see how maximizing J-Term and Summer classes can accelerate your graduation, or how your 16 open credits can unlock an additional minor, double major, certificate, or internship.",
                activePathwayPath: "/activeGradPathwayId",
                pathwaysPath: "/gradPathways",
                explorationOptionsPath: "/explorationOptions"
              }
            }
          },
          {
            id: "student-q2-progress",
            component: {
              DegreeProgressCard: {
                title: "How Your 124 Credits Break Down Under This Graduation Pathway",
                subtitle: "Real-time comparison of your completed credits (92 cr) and your remaining 32 credits",
                itemsPath: "/progressItems"
              }
            }
          },
          {
            id: "student-q2-export",
            component: {
              ScheduleExportCard: {
                title: "Step 2: Export Your Graduation Roadmap to Google Sheets or Send to Your Advisor",
                description:
                  "Export your multi-term graduation timeline to Google Sheets (.csv) or open directly in a new Google Sheet (sheets.new) for your advising session, or email it to Dr. Matthewulat.",
                advisorName: "Dr. Matthewulat",
                advisorEmail: "m.matthewulat@augie.edu",
                exportButtonLabel: "Export Graduation Timeline to Google Sheets (.csv)",
                emailButtonLabel: "Email Graduation Plan to Dr. Matthewulat"
              }
            }
          },
          {
            id: "student-q2-table",
            component: {
              DataTable: {
                title: "Reference: Multi-Term Graduation Audit & Credit Breakdown [J1 /students/me/graduation-audit]",
                a11yCaption:
                  "Student Question 2 Graduation Audit Table showing remaining degree requirements, credits needed, target term, and downstream graduation impact.",
                a11ySummary:
                  "Lists the 8 remaining courses (32 credits) required to reach 124 credits for graduation.",
                rowHeaderKey: "course_code",
                rowsPath: "/rows",
                columns: [
                  {
                    key: "course_code",
                    label: "Course / Requirement",
                    zionField: "J1: /students/me/graduation-audit",
                    type: "string",
                    sortable: true
                  },
                  {
                    key: "pillar",
                    label: "Curriculum Pillar",
                    zionField: "J1: audit.programs[] + audit.gen_ed",
                    type: "string",
                    sortable: true
                  },
                  {
                    key: "credits",
                    label: "Credits",
                    zionField: "J1: credit_hrs",
                    type: "number",
                    sortable: true
                  },
                  {
                    key: "target_term",
                    label: "Planned Term",
                    zionField: "J1: term_code",
                    type: "string",
                    sortable: true
                  },
                  {
                    key: "downstream_tradeoff",
                    label: "Graduation Impact",
                    zionField: "J1: blocks_milestone",
                    type: "string",
                    sortable: false
                  }
                ],
                rowActions: []
              }
            }
          }
        ]
      },
      dataModelUpdate: {
        surfaceId: "augie-aaa-student-q2-surface",
        contents: {
          activeGradPathwayId: "baseline_may_2028",
          gradPathways: [
            {
              id: "baseline_may_2028",
              buttonLabel: "Keep My May 2028 Graduation Pace (Standard 3 Semesters)",
              shortHook: "10–14 credits per semester · No summer tuition required · 16 open credits for electives & exploration",
              graduationDate: "May 2028 (3 Semesters Remaining)",
              jtermSummerSummary: "J-Term Included in Spring Tuition · No Summer Required",
              guidanceSummary:
                "You graduate on schedule in May 2028 without needing summer classes. Because you only have 4 required courses (16 credits) left across your Data Science Major, Mathematics Minor, and SOPHIA Core, the remaining 16 credits (4 courses) are completely open for studio electives, a second minor, or research.",
              terms: [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Completes Senior Capstone, SOPHIA Religion requirement, and 1 Major Core + 1 Elective",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Open Elective)"
                  ]
                },
                {
                  termName: "Fall 2027 (Senior Fall)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Completes Mathematics Minor and leaves 8 credits open for minors, certificates, or electives",
                  courses: [
                    "MATH 310 — Linear Algebra (4 Cr · Completes Mathematics Minor)",
                    "ART 140 — Studio Ceramics (4 Cr · Creative Arts Exploration)",
                    "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · Open Elective / Certificate Option)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Graduation)",
                  creditsLabel: "6–12 Credits (118 -> 124+ of 124 Credits)",
                  milestoneNote: "Only 6 credits required to reach 124 (Eligible for Final-Term F-1 Reduced Course Load or 12-Cr Full Load)",
                  courses: [
                    "COSC 495 — Sioux Falls Industry Data Science Internship (4 Cr · Experiential Capstone)",
                    "MUSI 118 — History of Jazz (2 Cr · Reaches 124-Credit Graduation Threshold)"
                  ]
                }
              ]
            },
            {
              id: "accelerate_dec_2027",
              buttonLabel: "Accelerate My Graduation (Finish December 2027 — 1 Semester Early)",
              shortHook: "Maximize J-Term 2027 (4 cr) + Summer 2027 (4 cr) + 12-cr Fall 2027 · Save Spring 2028 semester",
              graduationDate: "December 2027 (Graduates 1 Full Semester Early)",
              jtermSummerSummary: "Maximizes J-Term 2027 (4 Cr) + Summer 2027 (4 Cr)",
              guidanceSummary:
                "By taking 1 intensive course during January J-Term 2027 (4 credits, included in full-time tuition) and 1 Summer 2027 course or internship (4 credits), you complete all 124 credits by December 2027—graduating a full semester early and saving Spring 2028 living and tuition expenses.",
              terms: [
                {
                  termName: "J-Term 2027 (January Intensive — Acceleration Step 1)",
                  creditsLabel: "4 Credits (92 -> 96 of 124 Credits)",
                  milestoneNote: "Maximizes January J-Term (included in full-time tuition) to knock out 4 credits before Spring starts",
                  isAcceleratedTerm: true,
                  courses: [
                    "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · J-Term Daily Intensive)"
                  ]
                },
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "12 Credits (96 -> 108 of 124 Credits)",
                  milestoneNote: "Completes Data Science Senior Capstone, Applied ML, and Final SOPHIA Requirement",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)"
                  ]
                },
                {
                  termName: "Summer 2027 (Summer Acceleration Step 2)",
                  creditsLabel: "4 Credits (108 -> 112 of 124 Credits)",
                  milestoneNote: "Uses Summer Session (or Sioux Falls CPT Internship) to stay ahead of the 124-credit curve",
                  isAcceleratedTerm: true,
                  courses: [
                    "COSC 495 — Sioux Falls Industry Data Science Internship (4 Cr · Summer Session)"
                  ]
                },
                {
                  termName: "Fall 2027 (Final Semester — Graduate December 2027!)",
                  creditsLabel: "12 Credits (112 -> 124 of 124 Credits)",
                  milestoneNote: "Completes Mathematics Minor + Final 8 Credits -> Confer Degree in December 2027",
                  isAcceleratedTerm: true,
                  courses: [
                    "MATH 310 — Linear Algebra (4 Cr · Completes Mathematics Minor)",
                    "ART 140 — Studio Ceramics (4 Cr · Upper-Level Elective)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Career Elective)",
                    "MUSI 118 — History of Jazz (2 Cr · Reaches 124.0 Credits in December 2027)"
                  ]
                }
              ]
            },
            {
              id: "explore_majors_minors",
              buttonLabel: "Explore Adding Another Minor, Double Major, or Certificate (May 2028)",
              shortHook: "Use your 16 open credits to add a Studio Art Minor, AI Ethics Certificate, or Math Double Major",
              graduationDate: "May 2028 (With Added Minor / Double Major Credential)",
              jtermSummerSummary: "Standard Semesters · Zero Extra Tuition Required",
              highlightedExplorationId: "math_double_major",
              guidanceSummary:
                "Because you only need 16 credits to finish your Data Science Major, Mathematics Minor, and SOPHIA Core, your remaining 16 credits (out of 32 needed for 124) can be bundled into a formal second credential—such as upgrading your Math Minor to a Double Major, or adding a Studio Art Minor—while still graduating on time in May 2028.",
              terms: [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Advances Data Science Major + SOPHIA + First Exploration Course",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Counts toward AI Ethics Certificate)"
                  ]
                },
                {
                  termName: "Fall 2027 (Credential Expansion Semester)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Uses open credits toward Second Minor / Double Major Courses",
                  courses: [
                    "MATH 310 — Linear Algebra (4 Cr · Math Minor / Double Major Core)",
                    "MATH 320 — Probability & Mathematical Statistics (4 Cr · Upgrades toward Math Double Major)",
                    "ART 140 — Studio Ceramics (4 Cr · Or swap for PHIL 230 to complete AI Ethics Certificate)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Graduate With Added Credential)",
                  creditsLabel: "8–12 Credits (118 -> 126 of 124 Credits)",
                  milestoneNote: "Completes Second Credential + 124-Credit Graduation Requirement on Time",
                  courses: [
                    "MATH 410 — Real Analysis (4 Cr · Completes Mathematics Double Major Track)",
                    "ART 180 — Digital Design & Visual Communication (4 Cr · Studio Art & Design Minor Track)"
                  ]
                }
              ]
            },
            {
              id: "experiential_internship_abroad",
              buttonLabel: "Add Study Abroad or a Sioux Falls Industry Internship (May 2028)",
              shortHook: "Fit a J-Term Study Abroad or 4-credit Sanford/Avera/Citibank Data Science Internship into your plan",
              graduationDate: "May 2028 (Includes J-Term Study Abroad + Industry Internship)",
              jtermSummerSummary: "J-Term Study Abroad + Fall/Spring Sioux Falls Practicum",
              guidanceSummary:
                "Your 16 open credits give you the breathing room to participate in an off-campus J-Term study abroad course AND complete a 4-credit supervised Data Science internship in Sioux Falls (F-1 CPT eligible) without delaying your May 2028 graduation.",
              terms: [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Completes Data Science Capstone & Machine Learning Prereq for Industry Internship",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Unlocks Industry Internship Eligibility)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Career Elective)"
                  ]
                },
                {
                  termName: "Fall 2027 (Sioux Falls Industry Internship Term)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Pairs 150-hour Sioux Falls Data Science Practicum (F-1 CPT eligible) with Linear Algebra",
                  courses: [
                    "COSC 495 — Sioux Falls Industry Data Science Internship (4 Cr · Sanford / Avera / Citibank Partner)",
                    "MATH 310 — Linear Algebra (4 Cr · Completes Mathematics Minor)",
                    "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · Ethical AI Seminar)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Studio & Creative Finish)",
                  creditsLabel: "6–12 Credits (118 -> 124 of 124 Credits)",
                  milestoneNote: "Light final semester focused on creative exploration and career transition",
                  courses: [
                    "ART 140 — Studio Ceramics (4 Cr · Creative Arts Elective)",
                    "MUSI 118 — History of Jazz (2 Cr · Completes 124 Credits for May 2028 Commencement)"
                  ]
                }
              ]
            }
          ],
          explorationOptions: [
            {
              id: "math_double_major",
              credentialType: "Upgrade Minor -> Double Major",
              creditsRequired: "12 Open Credits Needed",
              title: "Mathematics Double Major (Add to Data Science)",
              shortButtonLabel: "Math Double Major",
              fitExplanation:
                "You already completed 16 of 20 credits for the Mathematics Minor. Because Data Science and Mathematics share foundational courses, adding 3 upper-level MATH courses uses 12 of your 16 open credits and upgrades your minor to a full second major by May 2028.",
              sampleCourses: [
                "MATH 310 — Linear Algebra (4 Cr · Already in Your Plan)",
                "MATH 320 — Probability & Mathematical Statistics (4 Cr · Fall 2027)",
                "MATH 410 — Real Analysis (4 Cr · Spring 2028)"
              ]
            },
            {
              id: "studio_art_minor",
              credentialType: "New Liberal Arts Minor",
              creditsRequired: "12 Open Credits Needed",
              title: "Studio Art & Visual Design Minor",
              shortButtonLabel: "Studio Art Minor",
              fitExplanation:
                "Combine technical Data Science with creative visual design. Taking 3 studio art courses fits completely inside your 16 open elective credits with 4 credits still to spare.",
              sampleCourses: [
                "ART 140 — Studio Ceramics (4 Cr · Spring 2027 or Fall 2027)",
                "ART 180 — Digital Design & Visual Communication (4 Cr · Fall 2027)",
                "ART 240 — Intermediate Ceramic Sculpture (4 Cr · Spring 2028)"
              ]
            },
            {
              id: "ai_ethics_cert",
              credentialType: "Interdisciplinary Certificate + Internship",
              creditsRequired: "10 Open Credits Needed",
              title: "AI Ethics Certificate + Sioux Falls Internship",
              shortButtonLabel: "AI Ethics + Internship",
              fitExplanation:
                "Pair human-centered computing and AI ethics with a supervised 4-credit Data Science internship at a Sioux Falls employer—leaving 6 open credits for music or studio art.",
              sampleCourses: [
                "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Spring 2027)",
                "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · J-Term or Fall 2027)",
                "COSC 495 — Sioux Falls Industry Data Science Internship (4 Cr · Summer or Fall 2027)"
              ]
            }
          ],
          progressItems: [
            {
              label: "Total Graduation Credits (92 Earned + 32 Planned = 124 Cr)",
              current: 92,
              target: 124,
              unit: "cr",
              ZionField: "J1: degree_rules.degree.credits_earned"
            },
            {
              label: "Data Science Major Core (36 Earned + 8 Required = 44 Cr)",
              current: 36,
              target: 44,
              unit: "cr",
              ZionField: "J1: audit.programs[major]"
            },
            {
              label: "Mathematics Minor (16 Earned + 4 Required = 20 Cr)",
              current: 16,
              target: 20,
              unit: "cr",
              ZionField: "J1: audit.programs[minor]"
            },
            {
              label: "SOPHIA Liberal Arts Core (10 Earned + 1 Required = 11 Courses)",
              current: 10,
              target: 11,
              unit: "courses",
              ZionField: "J1: audit.gen_ed.remaining_count"
            },
            {
              label: "Open Exploration Credits (16 of 32 Remaining Credits Available for Minors / J-Term / Electives)",
              current: 16,
              target: 16,
              unit: "open cr",
              ZionField: "J1: 124 - required_remaining"
            }
          ],
          rows: [
            {
              course_code: "COSC 450 — Data Science Senior Capstone",
              pillar: "Major Core (Required)",
              credits: 4,
              target_term: "Spring 2027",
              downstream_tradeoff: "Spring-only senior sequence; required for May 2028 or Dec 2027 graduation"
            },
            {
              course_code: "DATA 340 — Applied Machine Learning",
              pillar: "Major Core (Required)",
              credits: 4,
              target_term: "Spring 2027",
              downstream_tradeoff: "Completes Data Science major core and unlocks COSC 495 Internship"
            },
            {
              course_code: "RELI 218 — Global Christianities",
              pillar: "SOPHIA Core (Final Requirement)",
              credits: 4,
              target_term: "Spring 2027",
              downstream_tradeoff: "Satisfies final SOPHIA Learning Outcome (11 of 11 complete)"
            },
            {
              course_code: "MATH 310 — Linear Algebra",
              pillar: "Mathematics Minor (Final Requirement)",
              credits: 4,
              target_term: "Fall 2027 (or Spring 2027)",
              downstream_tradeoff: "Completes 20-credit Mathematics Minor (or counts toward Math Double Major)"
            },
            {
              course_code: "Open Exploration Slot 1 (e.g., PHIL 230 or MATH 320)",
              pillar: "Open Credit (Accelerate via J-Term or Add Minor)",
              credits: 4,
              target_term: "J-Term 2027 or Fall 2027",
              downstream_tradeoff: "Take in J-Term 2027 to accelerate graduation to Dec 2027, or apply toward a 2nd Minor"
            },
            {
              course_code: "Open Exploration Slot 2 (e.g., COSC 495 Internship or ART 140)",
              pillar: "Open Credit (Accelerate via Summer or Add Minor)",
              credits: 4,
              target_term: "Summer 2027 or Fall 2027",
              downstream_tradeoff: "Take in Summer 2027 to graduate in Dec 2027, or use for Studio Art Minor / Internship"
            },
            {
              course_code: "Open Exploration Slot 3 (e.g., ART 180 or MATH 410)",
              pillar: "Open Credit (Minor / Double Major / Elective)",
              credits: 4,
              target_term: "Fall 2027 or Spring 2028",
              downstream_tradeoff: "Completes added Minor/Double Major or advances toward 124 total credits"
            },
            {
              course_code: "Open Exploration Slot 4 (e.g., COSC 315 + MUSI 118)",
              pillar: "Open Credit (Career & Liberal Arts Electives)",
              credits: 4,
              target_term: "Spring 2027 / Spring 2028",
              downstream_tradeoff: "Brings cumulative earned credits from 120 to 124.0 for degree conferral"
            }
          ],
          courseCatalogDetails
        }
      }
    };
  }

  function adaptPayloadForQuestion(basePayload, persona, question) {
    if (!basePayload || !question) return { payload: basePayload, recommendedLayout: "inverted-pyramid" };

    if (persona?.id === "student" && question?.number === 2) {
      return {
        payload: buildStudentQ2Payload(basePayload),
        recommendedLayout: "inverted-pyramid"
      };
    }

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
