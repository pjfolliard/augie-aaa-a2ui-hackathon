/**
 * Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
 * Default A2UI (Agent-to-UI) Surface Payloads for all 10 Personas.
 *
 * Protocol: A2UI v0.9 / v0.8 compatible declarative JSON structure:
 *   - surfaceUpdate (declares component hierarchy: KPIStatRow, AlertBanner, DataTable, DegreeProgressCard, ActionFormCard)
 *   - dataModelUpdate (declares scoped advising data bound to component paths)
 *   - beginRendering (binds root component and Augustana Accessible Advising Catalog)
 *
 * NOTE: All fields are marked [HYPOTHETICAL PRE-ZION SCHEMA] until Zion Cloud Solutions
 * delivers the official field dictionary.
 */

window.AUGIE_DEFAULT_A2UI_VIEWS = {
  admin: {
    version: "v0.9",
    surfaceId: "augie-aaa-admin-surface",
    createSurface: {
      surfaceId: "augie-aaa-admin-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-admin-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-admin-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Agent Admin University-Wide Advising Command Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "warning",
              icon: "⚠",
              title: "System-Wide Audit Alert: 42 Unassigned Advisees & 164 Active Registration Holds",
              message: "Natural Sciences (18) and Social Sciences (14) have newly declared or transfer students awaiting primary advisor assignment prior to the November registration window.",
              jargonTerms: ["Hold", "SAP"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "University-Wide Advising & Retention Key Performance Indicators",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "University-Wide Academic Unit Advising & Compliance Audit [Zion J1PRD Connector API v1.0]",
              a11yCaption: "University-wide audit table comparing academic units by retention rate, unassigned advisees, advisor-to-student ratio, active holds, and SAP compliance.",
              a11ySummary: "Use arrow keys or Tab to navigate columns. Click any column header or press Enter to sort. Status cells include both icons and text labels for screen readers and color-blind accessibility.",
              rowHeaderKey: "unit_name",
              rowsPath: "/unitAuditRows",
              columns: [
                { key: "unit_name", label: "Academic Unit / Area", zionField: "J1: courses[].school", sortable: true },
                { key: "retention_rate", label: "Retention Rate (Yr 1→2)", zionField: "J1 [Phase 2]: Cohort Retention Rollup", sortable: true },
                { key: "unassigned_advisees", label: "Unassigned Advisees", zionField: "J1 [Phase 2]: Unassigned ID_NUM Count", sortable: true },
                { key: "advisor_ratio", label: "Advisor : Student Ratio", zionField: "J1: caseload?scope=all.total", sortable: true },
                { key: "systemic_holds", label: "Active Registration Holds", zionField: "J1: advisees[].active_holds", type: "badge", jargon: "Hold", sortable: true },
                { key: "sap_compliance", label: "Financial Aid SAP Status", zionField: "J1: degree_rules.degree.cum_gpa_ok", type: "badge", jargon: "SAP", sortable: true },
                { key: "portal_checks_30d", label: "Degree Checks (30d)", zionField: "J1: audit.as_of (live J1PRD query)", sortable: true }
              ],
              rowActions: [
                { id: "audit-unit", label: "Inspect Unit Roster", icon: "🔍" },
                { id: "export-sap", label: "Export Compliance CSV", icon: "📥" }
              ]
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Systemic Admin Action: Bulk Unassigned Advisee Routing & SAP Export",
              description: "Trigger an automated notification to Department Chairs with unassigned advisees or export the federal Financial Aid SAP audit package.",
              fields: [
                { id: "targetUnit", label: "Target Academic Unit", type: "select", options: ["All University Units", "Natural Sciences Area", "Social Sciences Area", "Humanities Area", "School of Music", "Lust School of Education", "Nursing"] },
                { id: "actionType", label: "Admin Operation", type: "select", options: ["Notify Chairs of Unassigned Advisees", "Export Financial Aid SAP Compliance Report", "Generate 30-Day Portal Usage Audit"] }
              ],
              submitLabel: "Execute Admin Operation",
              actionName: "executeAdminAudit"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-admin-surface",
      contents: {
        kpis: [
          { label: "System-Wide Retention", value: "86.4%", delta: "▲ +1.2% vs Last Yr", status: "success", icon: "✓" },
          { label: "Unassigned Advisees", value: "42 Students", delta: "⚠ Action Needed in 3 Units", status: "warning", icon: "⚠" },
          { label: "Global Advisor Ratio", value: "1 : 18.4", delta: "✓ Within 1:20 Target", status: "success", icon: "✓" },
          { label: "Degree Checks (Last Mo)", value: "1,420", delta: "▲ 318 Active Portal Users", status: "info", icon: "📊" }
        ],
        unitAuditRows: [
          { unit_name: "Natural Sciences Area", retention_rate: "88.1%", unassigned_advisees: 18, advisor_ratio: "1 : 21.2", systemic_holds: "⚠ 48 Holds (19 Advising)", sap_compliance: "✓ 94.8% SAP Met", portal_checks_30d: 412 },
          { unit_name: "Social Sciences Area", retention_rate: "85.0%", unassigned_advisees: 14, advisor_ratio: "1 : 19.5", systemic_holds: "⚠ 52 Holds (24 Financial)", sap_compliance: "⚠ 91.2% SAP Met", portal_checks_30d: 356 },
          { unit_name: "School of Music", retention_rate: "91.4%", unassigned_advisees: 2, advisor_ratio: "1 : 14.1", systemic_holds: "✓ 11 Holds", sap_compliance: "✓ 97.1% SAP Met", portal_checks_30d: 189 },
          { unit_name: "Sharon Lust School of Education", retention_rate: "89.2%", unassigned_advisees: 3, advisor_ratio: "1 : 16.8", systemic_holds: "✓ 15 Holds", sap_compliance: "✓ 96.4% SAP Met", portal_checks_30d: 214 },
          { unit_name: "Humanities Area", retention_rate: "84.6%", unassigned_advisees: 5, advisor_ratio: "1 : 15.2", systemic_holds: "✓ 19 Holds", sap_compliance: "✓ 93.9% SAP Met", portal_checks_30d: 144 },
          { unit_name: "Graduate & Continuing Education", retention_rate: "90.5%", unassigned_advisees: 0, advisor_ratio: "1 : 22.0", systemic_holds: "✓ 19 Holds", sap_compliance: "✓ 96.0% SAP Met", portal_checks_30d: 105 }
        ]
      }
    }
  },

  provost: {
    version: "v0.9",
    surfaceId: "augie-aaa-provost-surface",
    createSurface: {
      surfaceId: "augie-aaa-provost-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-provost-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-provost-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Provost Academic Affairs Executive Overview Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "degree-progress"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "info",
              icon: "🏛️",
              title: "Provost Curriculum & Seat Capacity Brief: 4 High-Demand SOPHIA & STEM Gateway Courses Near 98% Capacity",
              message: "BIOL 120, CHEM 121, COSC 210, and NURS 310 require section capacity review to protect 4-year graduation trajectories for first-year and sophomore cohorts.",
              jargonTerms: ["SOPHIA", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Provost Academic Outcome Metrics",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Academic Division Outcomes, Advising Load & Seat Bottleneck Matrix [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Provost comparison table of Augustana academic divisions showing 4-year graduation rate, 3-year enrollment trend, SOPHIA fulfillment, probation rate, and critical seat shortages.",
              a11ySummary: "Compares academic divisions across graduation, enrollment trend, advising load, and seat shortages.",
              rowHeaderKey: "division",
              rowsPath: "/divisionRows",
              columns: [
                { key: "division", label: "Academic Division / School", zionField: "J1: courses[].division", sortable: true },
                { key: "grad_rate_4yr", label: "4-Yr Graduation Rate", zionField: "J1: declared.expected_grad_year", sortable: true },
                { key: "trend_3yr", label: "3-Yr Enrollment Trend", zionField: "J1: /terms + /catalog/sections", type: "badge", sortable: true },
                { key: "faculty_load", label: "Median Faculty Advising Load", zionField: "J1: caseload.count (by advisor)", sortable: true },
                { key: "sophia_pace", label: "SOPHIA On-Pace (Sophomores)", zionField: "J1: audit.gen_ed.hrs_earned / 45", jargon: "SOPHIA", sortable: true },
                { key: "probation_rate", label: "Academic Probation %", zionField: "J1: cum_gpa_ok=false %", type: "badge", sortable: true },
                { key: "critical_shortages", label: "Critical Seat Shortages", zionField: "J1: sections[].seats_left + waitlisted", type: "badge", sortable: true }
              ],
              rowActions: [
                { id: "drill-division", label: "View Division Programs", icon: "📂" },
                { id: "request-sections", label: "Flag Seat Bottleneck", icon: "➕" }
              ]
            }
          }
        },
        {
          id: "degree-progress",
          component: {
            DegreeProgressCard: {
              title: "University-Wide SOPHIA Core Fulfillment Pace (First-Year & Sophomore Cohort)",
              subtitle: "Percentage of cohort completing foundational SOPHIA requirements on schedule for 4-year graduation",
              itemsPath: "/sophiaProgress"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-provost-surface",
      contents: {
        kpis: [
          { label: "4-Year Graduation Track", value: "78.4%", delta: "▲ +2.1% First-Year Pace", status: "success", icon: "✓" },
          { label: "STEM vs Non-STEM Persistence", value: "87.2% / 85.9%", delta: "✓ +1.3% Gap Narrowed", status: "success", icon: "⚖️" },
          { label: "SOPHIA Core On-Schedule", value: "84.6%", delta: "⚠ R2 & Q1 Need 3 Sections", status: "warning", icon: "⚠" },
          { label: "High-Demand Seat Shortages", value: "4 Courses", delta: "⛔ 62 Waitlisted Students", status: "danger", icon: "⛔" }
        ],
        divisionRows: [
          { division: "Natural Sciences & Nursing", grad_rate_4yr: "76.5%", trend_3yr: "▲ +9.4% Growth", faculty_load: "21 Advisees / Faculty", sophia_pace: "88.0%", probation_rate: "⚠ 4.8%", critical_shortages: "⛔ BIOL 120, CHEM 121, NURS 310" },
          { division: "Social Sciences & Business", grad_rate_4yr: "74.2%", trend_3yr: "▲ +6.1% Growth", faculty_load: "20 Advisees / Faculty", sophia_pace: "83.5%", probation_rate: "⚠ 5.4%", critical_shortages: "⚠ ACCT 210, ECON 120" },
          { division: "School of Music", grad_rate_4yr: "82.1%", trend_3yr: "✓ +3.8% Stable Growth", faculty_load: "14 Advisees / Faculty", sophia_pace: "89.2%", probation_rate: "✓ 2.1%", critical_shortages: "✓ Capacity Balanced" },
          { division: "Sharon Lust School of Education", grad_rate_4yr: "80.9%", trend_3yr: "▲ +4.5% Growth", faculty_load: "17 Advisees / Faculty", sophia_pace: "86.7%", probation_rate: "✓ 2.6%", critical_shortages: "✓ Capacity Balanced" },
          { division: "Humanities & Fine Arts", grad_rate_4yr: "75.8%", trend_3yr: "⚠ -2.3% Shift to Double Majors", faculty_load: "13 Advisees / Faculty", sophia_pace: "81.4%", probation_rate: "✓ 3.5%", critical_shortages: "⚠ SPAN 111 (SOPHIA L1)" }
        ],
        sophiaProgress: [
          { category: "FYS 110 First-Year Seminar", percent: 98, status: "✓ 98% Complete in Yr 1" },
          { category: "Quantitative Reasoning (Q)", percent: 84, status: "✓ 84% Complete by Sem 3" },
          { category: "Christian Tradition & Religion (R1/R2)", percent: 76, status: "⚠ 76% — Add 2 Spring R2 Sections" },
          { category: "World Languages & Intercultural (L1/L2)", percent: 79, status: "✓ 79% On Track (incl. Int'l Multilingual Waiver)" }
        ]
      }
    }
  },

  registrar: {
    version: "v0.9",
    surfaceId: "augie-aaa-registrar-surface",
    createSurface: {
      surfaceId: "augie-aaa-registrar-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-registrar-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-registrar-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Registrar Records, Degree Clearance & Compliance Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "warning",
              icon: "📋",
              title: "Registrar Compliance Queue: 19 Seniors Pending Final Degree Clearance & 11 Core Substitutions Awaiting Sign-Off",
              message: "Includes 3 transfer residency credit reviews and 4 F-1 international student full-time enrollment verifications ahead of next term registration.",
              jargonTerms: ["Residency Requirement", "Prerequisite Override", "SOPHIA"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Registrar Operations & Clearance Indicators",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Degree Clearance, Substitutions & Policy Override Queue [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Registrar compliance queue showing student ID, name, clearance item type, SOPHIA or major rule affected, residency credits, and approval status.",
              a11ySummary: "Registrar operational queue for degree clearance, transfer equivalencies, credit overloads, and policy overrides.",
              rowHeaderKey: "student_name",
              rowsPath: "/clearanceRows",
              columns: [
                { key: "student_id", label: "Student ID", zionField: "J1: id_num / advisee_id", sortable: true },
                { key: "student_name", label: "Student Name", zionField: "J1: name / advisee_name", sortable: true },
                { key: "request_type", label: "Compliance / Exception Type", zionField: "J1: audit.programs[].error_code", type: "badge", jargon: "Prerequisite Override", sortable: true },
                { key: "course_or_rule", label: "Course / Catalog Rule", zionField: "J1: declared.catalog_year + degree_rules", sortable: true },
                { key: "earned_residency", label: "Earned / Residency Credits", zionField: "J1: degree_rules.residency.meets_50", jargon: "Residency Requirement", sortable: true },
                { key: "submitted_by", label: "Endorsed By (Chair/Advisor)", zionField: "J1: requires_clearance / advisor", sortable: true },
                { key: "clearance_status", label: "Registrar Status", zionField: "J1: registration[].status_label", type: "badge", sortable: true }
              ],
              rowActions: [
                { id: "approve-record", label: "Approve & Post to Audit", icon: "✓" },
                { id: "return-chair", label: "Request Chair Clarification", icon: "↩" }
              ]
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Registrar System-Level Override & Catalog Sync",
              description: "Post approved core curriculum substitutions, credit overload authorizations (>18 cr), or grade change records.",
              fields: [
                { id: "recordId", label: "Student ID / Queue Item", type: "text", placeholder: "e.g., AUG-2026-0881 (Priya Gurung)" },
                { id: "decision", label: "Registrar Determination", type: "select", options: ["Approve Core Substitution", "Approve Credit Overload (>18 Credits)", "Verify Residency Requirement Met", "Place on Pending Catalog Review"] }
              ],
              submitLabel: "Post Official Record Update",
              actionName: "postRegistrarUpdate"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-registrar-surface",
      contents: {
        kpis: [
          { label: "Pending Degree Clearance", value: "19 Seniors", delta: "⚠ 6 Missing Final SOPHIA Tag", status: "warning", icon: "🎓" },
          { label: "Core Substitutions Queue", value: "11 Requests", delta: "✓ 8 Chair-Endorsed", status: "info", icon: "📋" },
          { label: "Transfer Equivalencies", value: "148 Processed", delta: "▲ 96% Within 5 Business Days", status: "success", icon: "✓" },
          { label: "Credit Overloads (>18 cr)", value: "23 Students", delta: "✓ GPA ≥ 3.25 Verified", status: "success", icon: "⚡" }
        ],
        clearanceRows: [
          { student_id: "AUG-2026-0881", student_name: "Priya Gurung", request_type: "✓ Degree Clearance (B.S.N.)", course_or_rule: "All Nursing + SOPHIA Complete", earned_residency: "112 Total / 94 Augie Cr", submitted_by: "Prof. Lindstrom (Nursing)", clearance_status: "✓ Ready to Confer" },
          { student_id: "AUG-2026-0419", student_name: "Marcus Lindqvist", request_type: "⚠ Core Substitution", course_or_rule: "Transfer STAT 205 → MATH 140 (SOPHIA Q)", earned_residency: "118 Total / 64 Augie Cr", submitted_by: "Chair, Math & CS", clearance_status: "⚠ Needs Registrar Sign-Off" },
          { student_id: "AUG-2027-1042", student_name: "Amina Tesfaye", request_type: "⚠ Prereq Override", course_or_rule: "COSC 450 Data Science Capstone", earned_residency: "78 Total / 78 Augie Cr", submitted_by: "Dr. Matthewulat", clearance_status: "⚠ Pending System Override" },
          { student_id: "AUG-2026-0912", student_name: "Elena Rostova", request_type: "⛔ Residency Credit Alert", course_or_rule: "Needs 4 Upper-Level Augie Credits", earned_residency: "120 Total / 26 Last-30 Augie Cr", submitted_by: "Chris Assmus (Audit Flag)", clearance_status: "⛔ Action Required for May Grad" },
          { student_id: "AUG-2027-1580", student_name: "Devon Keefe", request_type: "⚠ Credit Overload (19 cr)", course_or_rule: "Music Ed + Ensemble Overload", earned_residency: "68 Total / 68 Augie Cr", submitted_by: "Dr. Folliard (Music)", clearance_status: "✓ Approved (3.62 GPA)" }
        ]
      }
    }
  },

  student_success: {
    version: "v0.9",
    surfaceId: "augie-aaa-student-success-surface",
    createSurface: {
      surfaceId: "augie-aaa-student-success-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-student-success-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-student-success-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Student Success Early Warning, Retention & Holistic Care Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "danger",
              icon: "🧭",
              title: "Holistic Care Priority: 14 Cohort Students Have 2+ Early Warning Flags & Unresolved Registration Holds",
              message: "Includes 3 F-1 international students who cannot drop below 12 credits without SEVIS authorization and 4 students with ADA/accessibility accommodation follow-ups.",
              jargonTerms: ["Hold", "F-1 Full-Time Load", "SAP", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Student Success Cohort Health Metrics",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Student Success Early Warning, Holds & Accessibility Support Roster [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Student Success care roster listing students with early warning flags, academic standing, registration holds, international F-1 or accommodation notes, and outreach status.",
              a11ySummary: "Prioritized student support table with non-color risk indicators and accessibility/international student safeguards.",
              rowHeaderKey: "student_name",
              rowsPath: "/cohortRows",
              columns: [
                { key: "student_name", label: "Student Name & Cohort", zionField: "J1: name / advisee_name", sortable: true },
                { key: "early_warnings", label: "Early Warning Flags", zionField: "J1: min_grade.below_c_minus[]", type: "badge", sortable: true },
                { key: "standing_sap", label: "Standing & SAP", zionField: "J1: cumulative_gpa + cum_gpa_ok", type: "badge", jargon: "SAP", sortable: true },
                { key: "active_holds", label: "Active Holds", zionField: "J1: holds[].hold_cde + blocks_registration", type: "badge", jargon: "Hold", sortable: true },
                { key: "intl_a11y_context", label: "International / Accessibility Context", zionField: "J1: registered_credits>=12 + [Phase 2 BIOGRAPH]", jargon: "F-1 Full-Time Load", sortable: true },
                { key: "next_term_reg", label: "Next Term Registered?", zionField: "J1: registration-window.add_open_now", type: "badge", sortable: true },
                { key: "success_advisor", label: "Success Lead", zionField: "J1: ADVISING_ACCESS (X-User-Id)", sortable: true }
              ],
              rowActions: [
                { id: "log-outreach", label: "Schedule Care Check-In", icon: "📅" },
                { id: "coord-hold", label: "Coordinate Hold Resolution", icon: "🤝" }
              ]
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Student Success Coordinated Intervention & Referral",
              description: "Launch a coordinated support plan across Faculty Advisor, Tutoring/Writing Center, Financial Aid, International Programs, or Accessibility Services.",
              fields: [
                { id: "studentTarget", label: "Student", type: "select", options: ["Jordan Rivera (First-Year — 2 Early Warnings + Financial Hold)", "Lucas Sorenson (Sophomore — Aural Skills Alert + Advising Hold)", "Priya Gurung (Senior — F-1 12-Credit Threshold Check)", "Amina Tesfaye (Junior — Capstone Prereq Check)"] },
                { id: "intervention", label: "Support Pathway", type: "select", options: ["1-on-1 Success Coaching + Hold Resolution Plan", "Peer Tutoring & Accessible Study Materials Referral", "International Programs (IPO) SEVIS 12-Credit Consult", "Financial Aid SAP Appeal Workshop"] }
              ],
              submitLabel: "Send Accessible Care Plan",
              actionName: "triggerSuccessIntervention"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-student-success-surface",
      contents: {
        kpis: [
          { label: "Multiple Early Warnings", value: "14 Students", delta: "⛔ Outreach Within 24h", status: "danger", icon: "⛔" },
          { label: "Warning / Probation Cohort", value: "38 Students", delta: "✓ 82% Connected to Coaching", status: "warning", icon: "⚠" },
          { label: "Unregistered for Next Term", value: "64 Students", delta: "⚠ 29 Blocked by Holds", status: "warning", icon: "📅" },
          { label: "Avg Referral Resolution", value: "2.4 Days", delta: "▲ -1.1 Days Faster vs Fall", status: "success", icon: "✓" }
        ],
        cohortRows: [
          { student_name: "Jordan Rivera (First-Year)", early_warnings: "⛔ 2 Flags (ECON 120, ACCT 210)", standing_sap: "⚠ Academic Warning (2.10)", active_holds: "⛔ Financial Hold ($420)", intl_a11y_context: "👁️ Low Vision (150% Zoom / High Contrast)", next_term_reg: "⛔ Not Registered", success_advisor: "Charlotte Snyder" },
          { student_name: "Lucas Sorenson (Sophomore)", early_warnings: "⚠ 1 Flag (MUSI 214 Midterm C-)", standing_sap: "✓ Good Standing (3.18)", active_holds: "⚠ Advising Pin Hold", intl_a11y_context: "🦻 Deaf/HoH — Captioned Coaching & Visual Alerts", next_term_reg: "⚠ Cart Ready, Needs Pin", success_advisor: "Tim Homan" },
          { student_name: "Kofi Mensah (First-Year)", early_warnings: "⛔ 2 Flags (CHEM 121 Lab, Calc)", standing_sap: "⚠ SAP Watch (13 Enrolled Cr)", active_holds: "✓ Clear", intl_a11y_context: "🌐 F-1 International — Cannot Drop Below 12 Cr!", next_term_reg: "⚠ Needs Alt 3-Cr Course if Dropping CHEM", success_advisor: "Jessica Carlson" },
          { student_name: "Amina Tesfaye (Junior)", early_warnings: "✓ 0 Flags", standing_sap: "✓ Good Standing (3.74)", active_holds: "✓ Clear", intl_a11y_context: "🌐 F-1 Int'l + 🎧 Screen Reader (NVDA) User", next_term_reg: "⚠ Awaiting COSC 450 Prereq Override", success_advisor: "Haley Maday" }
        ]
      }
    }
  },

  deans: {
    version: "v0.9",
    surfaceId: "augie-aaa-deans-surface",
    createSurface: {
      surfaceId: "augie-aaa-deans-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-deans-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-deans-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Dean School & College Leadership Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "info",
              icon: "🎓",
              title: "School/College Dean Brief: 91.4% Retention & 100% Graduation Audit Completion Across Departments",
              message: "Review credit hour production, course bottlenecks, and degree plan exceptions across your School or College.",
              jargonTerms: ["SOPHIA", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "School and College Key Performance Indicators",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "School / College Departmental Credit Production, Retention & Bottlenecks [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Dean's summary table comparing departments within the school by credit hour production, retention rate, eligible graduates, average time to degree, and course bottlenecks.",
              a11ySummary: "Provides school-level leadership view across departments.",
              rowHeaderKey: "department_program",
              rowsPath: "/schoolRows",
              columns: [
                { key: "department_program", label: "Department / Major Program", zionField: "J1: subject / department_override", sortable: true },
                { key: "credit_hours", label: "Term Credit Hour Production", zionField: "J1: sum(sections[].enrolled * credit_hrs)", sortable: true },
                { key: "retention_rate", label: "Major Retention Rate", zionField: "J1 [Phase 2]: Unit Retention Rollup", type: "badge", sortable: true },
                { key: "grad_candidates", label: "Eligible Graduation Candidates", zionField: "J1: total_credits.requirements_complete", sortable: true },
                { key: "avg_time_degree", label: "Avg Time-to-Degree", zionField: "J1: expected_grad_year - catalog_year", sortable: true },
                { key: "bottleneck_status", label: "Required Course Bottlenecks", zionField: "J1: sections[].seats_left <= 1", type: "badge", sortable: true },
                { key: "exceptions_approved", label: "Degree Exceptions (Term)", zionField: "J1: audit.programs[].incomplete_requirements", sortable: true }
              ],
              rowActions: [
                { id: "inspect-dept", label: "Review Department Plan", icon: "📊" }
              ]
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-deans-surface",
      contents: {
        kpis: [
          { label: "Total Credit Hour Production", value: "14,820 SCH", delta: "▲ +4.2% vs Last Fall", status: "success", icon: "📈" },
          { label: "Unit Retention vs Univ Avg", value: "89.6% vs 86.4%", delta: "✓ +3.2% Above Univ Avg", status: "success", icon: "✓" },
          { label: "Full-Time Course Load (12+ cr)", value: "96.2%", delta: "✓ 100% F-1 Int'l Compliant", status: "success", icon: "🌐" },
          { label: "Avg Time-to-Degree", value: "3.92 Years", delta: "✓ On 4-Year Benchmark", status: "info", icon: "🎓" }
        ],
        schoolRows: [
          { department_program: "Music Education (B.A.)", credit_hours: "3,410 SCH", retention_rate: "✓ 92.4%", grad_candidates: "28 Seniors", avg_time_degree: "3.95 Yrs", bottleneck_status: "✓ Ensemble & Methods Balanced", exceptions_approved: 4 },
          { department_program: "Vocal & Instrumental Performance", credit_hours: "2,890 SCH", retention_rate: "✓ 90.8%", grad_candidates: "19 Seniors", avg_time_degree: "3.88 Yrs", bottleneck_status: "⚠ Studio Accompaniment Slots Tight", exceptions_approved: 2 },
          { department_program: "Elementary & Special Education", credit_hours: "4,620 SCH", retention_rate: "✓ 90.1%", grad_candidates: "44 Seniors", avg_time_degree: "3.91 Yrs", bottleneck_status: "✓ Student Teaching Placements Set", exceptions_approved: 5 },
          { department_program: "Secondary & K-12 Licensure", credit_hours: "3,900 SCH", retention_rate: "✓ 87.9%", grad_candidates: "31 Seniors", avg_time_degree: "3.96 Yrs", bottleneck_status: "⚠ 1 Methods Section at 96% Cap", exceptions_approved: 3 }
        ]
      }
    }
  },

  area_chair: {
    version: "v0.9",
    surfaceId: "augie-aaa-area-chair-surface",
    createSurface: {
      surfaceId: "augie-aaa-area-chair-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-area-chair-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-area-chair-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Area Chair Arts and Sciences Divisional Oversight Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "warning",
              icon: "🗂️",
              title: "Divisional Area Chair Notice: Cross-Departmental Lab & Quantitative Prerequisite Bottleneck Detected",
              message: "Biology, Chemistry, and Data Science majors share high demand for BIOL 120, CHEM 121, and STAT 210. Coordinating 2 cross-departmental sections clears 34 waitlisted students.",
              jargonTerms: ["SOPHIA", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Divisional Area Metrics",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Arts & Sciences Divisional Area Department Comparison [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Area Chair table comparing departments in the divisional area by major enrollment, withdrawal rate, foundational completion, advising load, and course substitutions.",
              a11ySummary: "Supports cross-departmental coordination for Area Chairs.",
              rowHeaderKey: "dept_name",
              rowsPath: "/areaRows",
              columns: [
                { key: "dept_name", label: "Area Department", zionField: "J1: subject (courses[])", sortable: true },
                { key: "active_majors", label: "Declared Majors (Growth)", zionField: "J1: caseload?scope=all (by major)", sortable: true },
                { key: "withdrawal_rate", label: "Course Withdrawal Rate", zionField: "J1: status_label=withdrawn", type: "badge", jargon: "DFW Rate", sortable: true },
                { key: "foundational_completion", label: "Foundational Req Completion", zionField: "J1: audit.gen_ed.hrs_earned", sortable: true },
                { key: "advising_load", label: "Avg Advising Load / Faculty", zionField: "J1: caseload.count / total_students", sortable: true },
                { key: "cross_bottleneck", label: "Cross-Dept Bottleneck Course", zionField: "J1: catalog/sections (min_seats=0)", type: "badge", sortable: true },
                { key: "substitutions_yr", label: "Grad Substitutions Needed", zionField: "J1: degree_rules.department_override", sortable: true }
              ],
              rowActions: [
                { id: "coord-chair", label: "Coordinate with Dept Chair", icon: "💬" }
              ]
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-area-chair-surface",
      contents: {
        kpis: [
          { label: "Area Declared Majors", value: "842 Students", delta: "▲ +11.4% in Data Science & Bio", status: "success", icon: "📊" },
          { label: "Foundational Completion", value: "87.5%", delta: "✓ First-Year Milestone Met", status: "success", icon: "✓" },
          { label: "Cross-Dept Bottlenecks", value: "3 Courses", delta: "⚠ CHEM 121, BIOL 120, STAT 210", status: "warning", icon: "⚠" },
          { label: "4-Yr Divisional Grad Rate", value: "77.2%", delta: "▲ +1.8% vs Prior Cohort", status: "success", icon: "🎓" }
        ],
        areaRows: [
          { dept_name: "Biology", active_majors: "264 Majors (▲ +8%)", withdrawal_rate: "⚠ 6.2% W Rate", foundational_completion: "88.4%", advising_load: "22.0 Advisees", cross_bottleneck: "⛔ CHEM 121 Co-Req Lab Full", substitutions_yr: 6 },
          { dept_name: "Computer Science & Mathematics", active_majors: "198 Majors (▲ +16%)", withdrawal_rate: "✓ 4.1% W Rate", foundational_completion: "90.2%", advising_load: "23.5 Advisees", cross_bottleneck: "⚠ COSC 210 / STAT 210 Seats", substitutions_yr: 4 },
          { dept_name: "Chemistry & Biochemistry", active_majors: "112 Majors (▲ +5%)", withdrawal_rate: "⚠ 7.4% W Rate", foundational_completion: "84.0%", advising_load: "16.0 Advisees", cross_bottleneck: "⛔ CHEM 121 Lab Sections", substitutions_yr: 2 },
          { dept_name: "Physics & Engineering", active_majors: "86 Majors (▲ +9%)", withdrawal_rate: "✓ 3.8% W Rate", foundational_completion: "89.5%", advising_load: "14.3 Advisees", cross_bottleneck: "✓ Calc II Co-Req Aligned", substitutions_yr: 3 },
          { dept_name: "Exercise & Sport Sciences", active_majors: "182 Majors (▲ +11%)", withdrawal_rate: "✓ 3.2% W Rate", foundational_completion: "86.8%", advising_load: "20.2 Advisees", cross_bottleneck: "⚠ BIOL 150 Anatomy Lab", substitutions_yr: 5 }
        ]
      }
    }
  },

  program_director: {
    version: "v0.9",
    surfaceId: "augie-aaa-program-director-surface",
    createSurface: {
      surfaceId: "augie-aaa-program-director-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-program-director-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-program-director-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Program Director Plan-of-Study & Substitution Authority Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "info",
              icon: "🔬",
              title: "Program Director Queue: 5 Course Substitution & Transfer Equivalency Requests Awaiting Program Decision",
              message: "92.6% of program majors are on track with their plan of study. 1 senior capstone prerequisite override (Amina Tesfaye) is ready for your sign-off.",
              jargonTerms: ["Prerequisite Override", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Program Health and Progression Indicators",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Program Curriculum, Capstone Readiness & Substitution Queue [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Program Director table showing program courses and student exception requests with enrollment, DFW rate, capstone status, and substitution actions.",
              a11ySummary: "Enables Program Directors to monitor core courses, elective tracks, and approve substitutions.",
              rowHeaderKey: "item_title",
              rowsPath: "/programRows",
              columns: [
                { key: "item_title", label: "Course / Student Request", zionField: "J1: audit.programs[].description", sortable: true },
                { key: "category_track", label: "Program Requirement / Track", zionField: "J1: audit.programs[].code (CONC)", sortable: true },
                { key: "enrollment_cap", label: "Next Term Enrollment / Cap", zionField: "J1: sections[].enrolled / capacity", type: "badge", sortable: true },
                { key: "dfw_rate", label: "Historical DFW Rate", zionField: "J1: below_c_minus[] + [Phase 2 DFW %]", jargon: "DFW Rate", sortable: true },
                { key: "capstone_impact", label: "Capstone / Graduation Impact", zionField: "J1: course-eligibility (4000-level)", sortable: true },
                { key: "director_action", label: "Program Director Status", zionField: "J1: requires_advisor_approval", type: "badge", sortable: true }
              ],
              rowActions: [
                { id: "approve-sub", label: "Approve Exception", icon: "✓" },
                { id: "view-plan", label: "Inspect Plan of Study", icon: "📄" }
              ]
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Program Director Authoritative Sign-Off (Substitutions & Transfer Credits)",
              description: "Approve or reject course substitutions, transfer credit mappings, or capstone prerequisite waivers for program majors.",
              fields: [
                { id: "studentCase", label: "Pending Program Case", type: "select", options: ["Amina Tesfaye — COSC 450 Capstone Concurrent Prereq Waiver", "Transfer Admit (SDSU) — CIS 275 → COSC 210 Equivalency", "Senior Track Switch — AI & Machine Learning Elective Substitution"] },
                { id: "determination", label: "Decision", type: "select", options: ["Approve & Route to Registrar", "Approve with Advising Condition", "Request Syllabus / Portfolio Review"] }
              ],
              submitLabel: "Submit Program Director Decision",
              actionName: "approveProgramException"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-program-director-surface",
      contents: {
        kpis: [
          { label: "Enrolled in Program Plan", value: "134 Majors", delta: "▲ +14 Transfer & New Admits", status: "success", icon: "👥" },
          { label: "On Track with Plan of Study", value: "92.6%", delta: "✓ 100% Assigned Active Advisor", status: "success", icon: "✓" },
          { label: "Capstone On-Schedule", value: "96.8%", delta: "⚠ 1 Prereq Override Pending", status: "info", icon: "🎓" },
          { label: "Top Elective Track", value: "Applied AI & Analytics", delta: "▲ 58% of Upperclass Majors", status: "info", icon: "🔬" }
        ],
        programRows: [
          { item_title: "COSC 210 Object-Oriented Design", category_track: "Core Foundational Requirement", enrollment_cap: "⛔ 30 / 30 (6 Waitlisted)", dfw_rate: "⚠ 9.4% DFW", capstone_impact: "Gateway for Junior Core", director_action: "⚠ Request +1 Lab Section" },
          { item_title: "DATA 320 Machine Learning & Ethics", category_track: "AI & Analytics Track", enrollment_cap: "✓ 24 / 28 Enrolled", dfw_rate: "✓ 3.1% DFW", capstone_impact: "Satisfies Upper-Level Track", director_action: "✓ Healthy Enrollment" },
          { item_title: "DATA 360 Bioinformatics Seminar", category_track: "Computational Bio Track", enrollment_cap: "⚠ 7 / 20 (Under-Enrolled)", dfw_rate: "✓ 2.0% DFW", capstone_impact: "Cross-List with BIOL 360", director_action: "⚠ Promote to Bio/CS Majors" },
          { item_title: "Sub Request: Amina Tesfaye (AUG-2027-1042)", category_track: "COSC 450 Senior Capstone", enrollment_cap: "14 Cr Enrolled (F-1 Int'l)", dfw_rate: "3.74 Major GPA", capstone_impact: "Keeps Spring 2027 Grad on Track", director_action: "⚠ Ready for Director Approval" }
        ]
      }
    }
  },

  department_chair: {
    version: "v0.9",
    surfaceId: "augie-aaa-department-chair-surface",
    createSurface: {
      surfaceId: "augie-aaa-department-chair-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-department-chair-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-department-chair-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Department Chair Advising Supervision & Section Capacity Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "warning",
              icon: "🏫",
              title: "Department Chair Action Items: 6 Newly Declared Majors Need Advisor Assignment & 2 Gateway Sections Need Capacity",
              message: "Rebalance faculty advising loads before new major assignments and review 3 pending department prerequisite overrides.",
              jargonTerms: ["Prerequisite Override", "DFW Rate"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Department Advising and Course Capacity Metrics",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Department Faculty Advising Load & Gateway Course Capacity [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Department Chair table listing faculty advisors, current advisee count, capacity status, pending prerequisite overrides, and advisees needing registration outreach.",
              a11ySummary: "Helps Department Chairs balance faculty advising rosters and manage course sections.",
              rowHeaderKey: "faculty_advisor",
              rowsPath: "/facultyLoadRows",
              columns: [
                { key: "faculty_advisor", label: "Department Faculty Advisor", zionField: "J1: sections[].instructor", sortable: true },
                { key: "assigned_advisees", label: "Assigned Advisees", zionField: "J1: caseload.count", sortable: true },
                { key: "load_status", label: "Advising Capacity Status", zionField: "J1: sections[].status + seats_left", type: "badge", sortable: true },
                { key: "unregistered_count", label: "Advisees Not Yet Registered", zionField: "J1: caseload?status=unregistered", sortable: true },
                { key: "probation_advisees", label: "Advisees on Probation/Warning", zionField: "J1: cum_gpa < 2.0 (cum_gpa_ok=false)", type: "badge", sortable: true },
                { key: "pending_overrides", label: "Pending Prereq Overrides", zionField: "J1: degree_rules.department_override", jargon: "Prerequisite Override", sortable: true }
              ],
              rowActions: [
                { id: "assign-majors", label: "Assign New Majors", icon: "➕" },
                { id: "view-roster", label: "View Faculty Roster", icon: "📋" }
              ]
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Department Chair Assignment & Section Request Tool",
              description: "Assign newly declared majors to faculty with available advising capacity or submit a section addition request to the Registrar.",
              fields: [
                { id: "facultyMember", label: "Assign To Faculty Advisor", type: "select", options: ["Dr. Emily Chen (14 Advisees — Has Capacity for +6)", "Dr. Anders Lindholm (16 Advisees — Has Capacity for +4)", "Dr. Matthewulat (24 Advisees — At Capacity)"] },
                { id: "chairOperation", label: "Department Action", type: "select", options: ["Assign 6 Newly Declared Majors", "Approve Department Prerequisite Override", "Request +1 Section of Gateway Course for Spring"] }
              ],
              submitLabel: "Apply Department Chair Action",
              actionName: "executeChairAction"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-department-chair-surface",
      contents: {
        kpis: [
          { label: "Declared Majors On-Track", value: "91.8%", delta: "▲ +18 Declared This Term", status: "success", icon: "✓" },
          { label: "Unassigned New Majors", value: "6 Students", delta: "⚠ Ready for Faculty Assignment", status: "warning", icon: "👤" },
          { label: "Pending Prereq Overrides", value: "3 Requests", delta: "⚠ Window Opens in 5 Days", status: "warning", icon: "🔑" },
          { label: "Undergrad Completion Rate", value: "94.1%", delta: "✓ Above 92% Dept Target", status: "success", icon: "📈" }
        ],
        facultyLoadRows: [
          { faculty_advisor: "Dr. Emily Chen (Assoc. Prof)", assigned_advisees: "14 Advisees", load_status: "✓ Open Capacity (+6 Slots)", unregistered_count: "2 Unregistered", probation_advisees: "✓ 0 on Probation", pending_overrides: "1 Override Pending" },
          { faculty_advisor: "Dr. Anders Lindholm (Asst. Prof)", assigned_advisees: "16 Advisees", load_status: "✓ Open Capacity (+4 Slots)", unregistered_count: "3 Unregistered", probation_advisees: "⚠ 1 on Warning", pending_overrides: "0 Pending" },
          { faculty_advisor: "Dr. Matthewulat (Prof)", assigned_advisees: "24 Advisees", load_status: "⚠ At Target Cap (24/24)", unregistered_count: "4 Unregistered", probation_advisees: "⚠ 1 on Probation", pending_overrides: "2 Overrides Pending" },
          { faculty_advisor: "Prof. Sarah Lindstrom", assigned_advisees: "26 Advisees", load_status: "⛔ Over Capacity (Rebalance 2)", unregistered_count: "5 Unregistered", probation_advisees: "⚠ 2 on Probation", pending_overrides: "0 Pending" }
        ]
      }
    }
  },

  advisor: {
    version: "v0.9",
    surfaceId: "augie-aaa-advisor-surface",
    createSurface: {
      surfaceId: "augie-aaa-advisor-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-advisor-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-advisor-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Academic Advisor Assigned Roster & 1-on-1 Mentoring Surface",
              children: { explicitList: ["alert-banner", "kpi-row", "main-table", "degree-progress", "action-card"] }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "warning",
              icon: "🤝",
              title: "Advisor Roster Priority: 3 Assigned Advisees Not Yet Registered & 1 F-1 International Credit-Load Guardrail",
              message: "Scope restricted to your Assigned Advisees Only. Remember: Priya Gurung and Amina Tesfaye hold F-1 international status (must maintain ≥ 12 credits each semester).",
              jargonTerms: ["Hold", "F-1 Full-Time Load", "SOPHIA", "SAP", "Prerequisite Override"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "Assigned Advisee Roster Summary",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "My Assigned Advisees Roster (Scoped: Assigned Advisees Only) [Zion J1PRD Connector API v1.0]",
              a11yCaption: "Academic Advisor roster showing your assigned advisees, remaining credits to 124, SOPHIA Gen-Ed status, registration holds, midterm alerts, F-1/accessibility context, and next-term registration status.",
              a11ySummary: "1-on-1 advising table with screen-reader descriptions, non-color status badges, and international/accessibility indicators.",
              rowHeaderKey: "student_name",
              rowsPath: "/adviseeRows",
              columns: [
                { key: "student_name", label: "Advisee Name & Class", zionField: "J1: name / advisee_name", sortable: true },
                { key: "major_program", label: "Major & Career Track", zionField: "J1: declared.major / concentration", sortable: true },
                { key: "credits_remaining", label: "Earned / Remaining (of 124)", zionField: "J1: audit.total_credits.earned", sortable: true },
                { key: "sophia_remaining", label: "Remaining SOPHIA Gen-Ed", zionField: "J1: audit.gen_ed.met (Sophia Core)", jargon: "SOPHIA", sortable: true },
                { key: "holds_and_sap", label: "Holds & Financial Aid SAP", zionField: "J1: holds[].hold_cde + blocks_registration", type: "badge", jargon: "Hold", sortable: true },
                { key: "midterm_and_visa", label: "Midterm < C / F-1 / Access Notes", zionField: "J1: registered_credits>=12 + [Phase 2 BIOGRAPH]", type: "badge", jargon: "F-1 Full-Time Load", sortable: true },
                { key: "spring_reg_status", label: "Next Term Registration", zionField: "J1: registration-window.add_open_now", type: "badge", sortable: true }
              ],
              rowActions: [
                { id: "open-1on1", label: "Open 1-on-1 Degree Plan", icon: "🧭" },
                { id: "release-pin", label: "Release Advising Pin / Override", icon: "🔓" }
              ]
            }
          }
        },
        {
          id: "degree-progress",
          component: {
            DegreeProgressCard: {
              title: "Selected Advisee Spotlight: Amina Tesfaye (AUG-2027-1042) — B.A. Data Science & CS",
              subtitle: "78 Earned Credits · 14 Current Credits (F-1 International Compliant) · Screen Reader (NVDA) Accessible Plan",
              itemsPath: "/spotlightProgress"
            }
          }
        },
        {
          id: "action-card",
          component: {
            ActionFormCard: {
              title: "Advisor Quick Action: Release Advising Pin, Submit Prereq Override, or Run Major-Change What-If",
              description: "Partner with your advisee during your 1-on-1 meeting to clear registration hurdles or submit a course substitution.",
              fields: [
                { id: "adviseeSelect", label: "Select Assigned Advisee", type: "select", options: ["Amina Tesfaye (AUG-2027-1042) — Needs COSC 450 Prereq Override", "Lucas Sorenson (AUG-2028-2198) — Release Advising Hold Pin + Aural Skills Support", "Priya Gurung (AUG-2026-0881) — Verify Spring 12-Cr F-1 Graduation Load", "Jordan Rivera (AUG-2029-3310) — Major What-If + Financial Hold Referral"] },
                { id: "advisorAction", label: "Advising Action", type: "select", options: ["Release Advising Registration Pin", "Submit Prerequisite Override to Department Chair", "Simulate Major Change Impact on Graduation Date", "Send Accessible Meeting Summary (Text + Screen-Reader HTML)"] }
              ],
              submitLabel: "Complete Advising Action",
              actionName: "submitAdvisorAction"
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-advisor-surface",
      contents: {
        kpis: [
          { label: "Assigned Advisees", value: "18 Students", delta: "15 Registered / 3 Pending", status: "info", icon: "👥" },
          { label: "Active Registration Holds", value: "2 Advisees", delta: "⚠ 1 Advising Pin, 1 Financial", status: "warning", icon: "⛔" },
          { label: "Midterm Grade < C Alerts", value: "2 Advisees", delta: "⚠ MUSI 214 & ACCT 210", status: "warning", icon: "📉" },
          { label: "F-1 / ADA Support Active", value: "4 Advisees", delta: "✓ 100% Accommodations Synced", status: "success", icon: "♿" }
        ],
        adviseeRows: [
          { student_name: "Amina Tesfaye (Junior)", major_program: "Data Science & CS (AI Track)", credits_remaining: "78 Earned / 46 Left", sophia_remaining: "Needs 1 Course: Religion R2", holds_and_sap: "✓ Clear · SAP Met (3.74)", midterm_and_visa: "🌐 F-1 Int'l (14 cr) · 🎧 Screen Reader", spring_reg_status: "⚠ Needs COSC 450 Prereq Override" },
          { student_name: "Lucas Sorenson (Sophomore)", major_program: "Music Education (K-12)", credits_remaining: "44 Earned / 80 Left", sophia_remaining: "Needs Q, R2, L2, Social Sci", holds_and_sap: "⛔ Advising Hold · SAP Met", midterm_and_visa: "⚠ MUSI 214 (C-) · 🦻 Deaf/Captioned", spring_reg_status: "⛔ Hold Blocking Cart" },
          { student_name: "Priya Gurung (Senior)", major_program: "Nursing (B.S.N.)", credits_remaining: "112 Earned / 12 Left", sophia_remaining: "✓ All SOPHIA Complete", holds_and_sap: "✓ Clear · SAP Met (3.88)", midterm_and_visa: "🌐 F-1 Int'l (⚠ Must Stay ≥12 Cr)", spring_reg_status: "✓ Registered (Spring Grad)" },
          { student_name: "Jordan Rivera (First-Year)", major_program: "Exploring Business / Accounting", credits_remaining: "13 Earned / 111 Left", sophia_remaining: "8 SOPHIA Categories Left", holds_and_sap: "⛔ $420 Financial Hold · SAP Watch", midterm_and_visa: "⛔ ACCT 210 (D+) · 👁️ 150% Zoom", spring_reg_status: "⛔ Blocked by Financial Hold" }
        ],
        spotlightProgress: [
          { category: "Total Degree Credits (78 / 124 Earned + 14 Enrolled)", percent: 74, status: "✓ On Track for May 2027" },
          { category: "Data Science & CS Major Core (32 / 44 Credits)", percent: 73, status: "✓ Needs COSC 450 + 2 Electives" },
          { category: "SOPHIA General Education Plan (9 / 10 Complete)", percent: 90, status: "⚠ Needs 1 Religion (R2) Course" },
          { category: "F-1 International Full-Time Enrollment Check", percent: 100, status: "✓ 14 Credits Enrolled (Min 12 Cr Required)" }
        ]
      }
    }
  },

  student: {
    version: "v0.9",
    surfaceId: "augie-aaa-student-surface",
    createSurface: {
      surfaceId: "augie-aaa-student-surface",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json",
      sendDataModel: true
    },
    beginRendering: {
      surfaceId: "augie-aaa-student-surface",
      root: "root-layout",
      catalogId: "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
    },
    surfaceUpdate: {
      surfaceId: "augie-aaa-student-surface",
      components: [
        {
          id: "root-layout",
          component: {
            Column: {
              a11yLabel: "Student Self-Service Liberal Arts Priority Funnel, Dropdown Conflict Selector & Mon-Fri Schedule Builder",
              children: {
                explicitList: [
                  "alert-banner",
                  "kpi-row",
                  "priority-explorer",
                  "conflict-configurator",
                  "weekly-calendar",
                  "degree-progress",
                  "action-card",
                  "main-table"
                ]
              }
            }
          }
        },
        {
          id: "alert-banner",
          component: {
            AlertBanner: {
              severity: "info",
              icon: "",
              title: "Spring 2027 Advising Plan: Choose Your Mix, Customize Time-Slot Conflicts, and Review Your Schedule",
              message: "At Augustana, your Major, Minor, SOPHIA Core, and Electives advance together. Select a semester mix in Step 1 to see the recommended courses in each pillar, use the dropdowns in Step 2 to resolve any time-slot conflicts, and view your Monday-Friday schedule in Step 3.",
              jargonTerms: ["SOPHIA", "F-1 Full-Time Load", "Prerequisite Override", "Hold"]
            }
          }
        },
        {
          id: "kpi-row",
          component: {
            KPIStatRow: {
              a11yLabel: "My Spring 2027 Schedule & Degree Trajectory Snapshot",
              itemsPath: "/kpis"
            }
          }
        },
        {
          id: "priority-explorer",
          component: {
            PriorityTradeoffExplorer: {
              title: "Step 1: Choose Your 'Both/And' Semester Mix",
              subtitle: "Every mix advances your Major, SOPHIA Core, and Liberal Arts goals together. Click any option below to see the exact courses recommended in each pillar.",
              activeModePath: "/activePriorityMode",
              modesPath: "/priorityModes",
              bucketsPath: "/degreeBuckets"
            }
          }
        },
        {
          id: "conflict-configurator",
          component: {
            CourseConflictConfigurator: {
              title: "Step 2: Customize Contested Time Slots & Review Trade-Offs",
              subtitle: "Two time slots have competing courses across your Major, Minor, and Electives. Use the dropdown menus to choose which course you want in each slot and see the downstream impact.",
              slotsPath: "/contestableSlots"
            }
          }
        },
        {
          id: "weekly-calendar",
          component: {
            WeeklyScheduleCalendar: {
              title: "Step 3: Your Monday–Friday Class Schedule",
              subtitle: "Your converged Monday–Friday schedule showing Course Number and Course Name.",
              eventsPath: "/calendarEvents",
              summaryPath: "/scheduleSummary"
            }
          }
        },
        {
          id: "degree-progress",
          component: {
            DegreeProgressCard: {
              title: "How This Mix Advances All Your Goals in Parallel",
              subtitle: "Projected Progress After Spring 2027 · Assigned Advisor: Dr. Matthewulat (Madsen Center 214)",
              itemsPath: "/myProgress"
            }
          }
        },
        {
          id: "action-card",
          component: {
            ScheduleExportCard: {
              title: "Export Advising Plan or Email Advisor for Registration Approval",
              description: "Download a clean soft copy of your Spring 2027 schedule and trade-off summary to bring to your advising session, or email it directly to Dr. Matthewulat to request registration approval.",
              advisorName: "Dr. Matthewulat",
              advisorEmail: "m.matthewulat@augie.edu",
              exportButtonLabel: "Export Advising Plan (Soft Copy for Advising Session)",
              emailButtonLabel: "Email Plan to Dr. Matthewulat for Registration Approval"
            }
          }
        },
        {
          id: "main-table",
          component: {
            DataTable: {
              title: "Reference: Full Course Details & Jenzabar J1 Section Metadata [J1 /recommend-next-term + /catalog/sections]",
              a11yCaption: "Complete reference list of candidate courses for Spring 2027 showing course number, curriculum pillar, meeting time, open seats, and graduation impact.",
              a11ySummary: "Reference table of all candidate courses considered in Steps 1, 2, and 3.",
              rowHeaderKey: "course_code",
              rowsPath: "/recommendedCourses",
              columns: [
                { key: "course_code", label: "Course Number & Name", zionField: "J1: items[].code + title", sortable: true },
                { key: "pillar", label: "Curriculum Pillar", zionField: "J1: items[].satisfies", sortable: true },
                { key: "credits", label: "Credits", zionField: "J1: credit_hrs", sortable: true },
                { key: "meeting_window", label: "Meeting Days & Time", zionField: "J1: meetings[].days/begin", sortable: true },
                { key: "seats_left", label: "Open Seats", zionField: "J1: sections[].seats_left", sortable: true },
                { key: "downstream_tradeoff", label: "Downstream Note", zionField: "J1: open_requirements[].reason", sortable: true }
              ]
            }
          }
        }
      ]
    },
    dataModelUpdate: {
      surfaceId: "augie-aaa-student-surface",
      contents: {
        activePriorityMode: "balanced_mix",
        kpis: [
          { label: "Selected Semester Load", value: "14 Credits (4 Courses)", delta: "Meets 12-Credit Full-Time & F-1 Minimum", status: "success", icon: "" },
          { label: "Contested Time Slots", value: "2 Time Slots", delta: "MWF 1:00 PM & TR 9:30 AM (Customizable Below)", status: "warning", icon: "" },
          { label: "Parallel SOPHIA Pace", value: "100% SOPHIA Complete", delta: "Finishes Final R2 Requirement This Spring", status: "success", icon: "" },
          { label: "Registration Window", value: "Nov 12 · 8:00 AM", delta: "0 Active Holds · 1 Prereq Override Ready", status: "info", icon: "" }
        ],
        priorityModes: [
          {
            id: "balanced_mix",
            label: "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective (Recommended — 14 Credits)",
            summary: "Advances 2 Major Core courses, finishes your final SOPHIA requirement, and includes 1 Career Elective.",
            severity: "info",
            tradeoffTitle: "Option 1 Trade-Off Summary:",
            tradeoffBanner: "Zero schedule conflicts. Keeps you on pace for 400-level AI courses in the Fall while finishing 100% of SOPHIA and adding COSC 315 Accessible HCI."
          },
          {
            id: "heavy_major_minor",
            label: "Option 2: Heavy Major & Minor Push + Parallel SOPHIA (15 Credits)",
            summary: "Advances 2 Major Core courses, 1 Mathematics Minor requirement, and finishes your final SOPHIA course.",
            severity: "info",
            tradeoffTitle: "Option 2 Trade-Off Summary:",
            tradeoffBanner: "Completes your Mathematics Minor requirement (MATH 310) a semester early alongside your Major Core and SOPHIA R2, shifting general electives to Senior Year."
          },
          {
            id: "sophia_electives_mix",
            label: "Option 3: Finish Remaining SOPHIA + Studio & Career Electives (14 Credits)",
            summary: "Locks your mandatory Spring-only Major Capstone, finishes SOPHIA, and opens room for 2 Electives.",
            severity: "warning",
            tradeoffTitle: "Option 3 Trade-Off Summary:",
            tradeoffBanner: "Lets you take both ART 140 Studio Ceramics and COSC 315 Accessible HCI this spring alongside your Capstone and SOPHIA R2. Downstream effect: DATA 340 shifts to Fall Senior Year."
          }
        ],
        degreeBuckets: [
          {
            title: "Pillar 1: Major & Minor Courses",
            subtitle: "Recommended in Selected Option",
            coursesByMode: {
              balanced_mix: [
                "COSC 450 — Data Science Senior Capstone (4 Credits · MWF 10:00 AM)",
                "DATA 340 — Applied Machine Learning (4 Credits · MWF 1:00 PM)"
              ],
              heavy_major_minor: [
                "COSC 450 — Data Science Senior Capstone (4 Credits · MWF 10:00 AM)",
                "DATA 340 — Applied Machine Learning (4 Credits · MWF 1:00 PM)",
                "MATH 310 — Linear Algebra (4 Credits · TR 9:30 AM · Math Minor)"
              ],
              sophia_electives_mix: [
                "COSC 450 — Data Science Senior Capstone (4 Credits · MWF 10:00 AM)",
                "(DATA 340 — Applied Machine Learning shifts to Fall 2026)"
              ]
            }
          },
          {
            title: "Pillar 2: Parallel SOPHIA Gen-Ed",
            subtitle: "Recommended in Selected Option",
            coursesByMode: {
              balanced_mix: [
                "RELI 218 — Global Christianities (3 Credits · TR 1:30 PM · Completes Final R2 Requirement)"
              ],
              heavy_major_minor: [
                "RELI 218 — Global Christianities (3 Credits · TR 1:30 PM · Completes Final R2 Requirement)"
              ],
              sophia_electives_mix: [
                "RELI 218 — Global Christianities (3 Credits · TR 1:30 PM · Completes Final R2 Requirement)"
              ]
            }
          },
          {
            title: "Pillar 3: Liberal Arts & Career Electives",
            subtitle: "Recommended in Selected Option",
            coursesByMode: {
              balanced_mix: [
                "COSC 315 — Accessible Human-Computer Interaction (3 Credits · TR 9:30 AM)"
              ],
              heavy_major_minor: [
                "(No general elective this term — TR 9:30 AM slot used for MATH 310 Minor course)"
              ],
              sophia_electives_mix: [
                "ART 140 — Studio Ceramics (4 Credits · MWF 1:00 PM)",
                "COSC 315 — Accessible Human-Computer Interaction (3 Credits · TR 9:30 AM)"
              ]
            }
          }
        ],
        contestableSlots: [
          {
            slotId: "13:00",
            timeLabel: "Mon / Wed / Fri · 1:00 – 1:50 PM (or 2:50 PM Studio)",
            slotType: "Time Conflict: Major Core vs. Studio Art Elective",
            pickerLabel: "Choose Course for Mon/Wed/Fri 1:00 PM:",
            selectedValue: "DATA 340",
            options: [
              {
                value: "DATA 340",
                course: "DATA 340",
                title: "Applied Machine Learning",
                bucket: "Major Core",
                days: "MWF",
                label: "DATA 340 — Applied Machine Learning (Major Core · 4 Credits)",
                tradeoff: "Keeps your AI Major sequence on schedule to unlock 400-level AI electives in Fall 2026. ART 140 Studio Ceramics waits until Senior Year."
              },
              {
                value: "ART 140",
                course: "ART 140",
                title: "Studio Ceramics",
                bucket: "Elective",
                days: "MWF",
                label: "ART 140 — Studio Ceramics (Liberal Arts Elective · 4 Credits)",
                tradeoff: "Prioritizes your Studio Art elective this spring. Downstream effect: DATA 340 moves to Fall 2026 (delays 400-level AI electives by 1 term, but May 2027 graduation stays on track)."
              }
            ]
          },
          {
            slotId: "09:30",
            timeLabel: "Tue / Thu · 9:30 – 10:45 AM",
            slotType: "Time Conflict: Career Elective vs. Math Minor vs. Music Elective",
            pickerLabel: "Choose Course for Tue/Thu 9:30 AM:",
            selectedValue: "COSC 315",
            options: [
              {
                value: "COSC 315",
                course: "COSC 315",
                title: "Accessible Human-Computer Interaction",
                bucket: "Elective",
                days: "TR",
                label: "COSC 315 — Accessible Human-Computer Interaction (Elective · 3 Credits)",
                tradeoff: "Brings your semester load to a balanced 14 credits (above the 12-credit F-1 & full-time minimum) with zero schedule conflicts."
              },
              {
                value: "MATH 310",
                course: "MATH 310",
                title: "Linear Algebra",
                bucket: "Major Core",
                days: "TR",
                label: "MATH 310 — Linear Algebra (Mathematics Minor · 4 Credits)",
                tradeoff: "Completes your Mathematics Minor requirement early and brings your semester load to 15 credits (higher quantitative workload)."
              },
              {
                value: "MUSI 118",
                course: "MUSI 118",
                title: "History of Jazz",
                bucket: "Elective",
                days: "TR",
                label: "MUSI 118 — History of Jazz (Liberal Arts Elective · 2 Credits)",
                tradeoff: "Lighter 2-credit liberal arts elective that keeps your total semester load at 13 credits (still above the 12-credit full-time minimum)."
              }
            ]
          },
          {
            slotId: "10:00",
            timeLabel: "Mon / Wed / Fri · 10:00 – 10:50 AM",
            slotType: "No Conflict — Mandatory Spring-Only Anchor",
            pickerLabel: "Locked Anchor Course:",
            selectedValue: "COSC 450",
            options: [
              {
                value: "COSC 450",
                course: "COSC 450",
                title: "Data Science Senior Capstone",
                bucket: "Major Core",
                days: "MWF",
                label: "COSC 450 — Data Science Senior Capstone (Major Capstone · 4 Credits)",
                tradeoff: "Offered in Spring semesters only. Keeping this course in your schedule protects your May 2027 graduation date."
              }
            ]
          },
          {
            slotId: "13:30",
            timeLabel: "Tue / Thu · 1:30 – 2:45 PM",
            slotType: "No Conflict — Parallel SOPHIA Requirement",
            pickerLabel: "Locked SOPHIA Course:",
            selectedValue: "RELI 218",
            options: [
              {
                value: "RELI 218",
                course: "RELI 218",
                title: "Global Christianities",
                bucket: "SOPHIA",
                days: "TR",
                label: "RELI 218 — Global Christianities (SOPHIA R2 · 3 Credits)",
                tradeoff: "Completes 100% of your 45-credit SOPHIA Core curriculum in parallel with your Major."
              }
            ]
          }
        ],
        recommendedCourses: [
          {
            course_code: "COSC 450 — Data Science Senior Capstone",
            pillar: "Major Core (Capstone)",
            credits: "4 Credits",
            meeting_window: "MWF 10:00 – 10:50 AM",
            seats_left: "2 of 20 Open",
            downstream_tradeoff: "Spring-only capstone required for May 2027 graduation"
          },
          {
            course_code: "DATA 340 — Applied Machine Learning",
            pillar: "Major Core",
            credits: "4 Credits",
            meeting_window: "MWF 1:00 – 1:50 PM",
            seats_left: "6 of 25 Open",
            downstream_tradeoff: "Competes with ART 140 at MWF 1:00 PM; unlocks Fall 400-level AI track"
          },
          {
            course_code: "MATH 310 — Linear Algebra",
            pillar: "Mathematics Minor",
            credits: "4 Credits",
            meeting_window: "TR 9:30 – 10:45 AM",
            seats_left: "8 of 24 Open",
            downstream_tradeoff: "Competes with COSC 315 at TR 9:30 AM; finishes Math Minor"
          },
          {
            course_code: "RELI 218 — Global Christianities",
            pillar: "Parallel SOPHIA (R2)",
            credits: "3 Credits",
            meeting_window: "TR 1:30 – 2:45 PM",
            seats_left: "9 of 25 Open",
            downstream_tradeoff: "Completes final 3 credits of 45-credit SOPHIA Core"
          },
          {
            course_code: "COSC 315 — Accessible Human-Computer Interaction",
            pillar: "Career Elective",
            credits: "3 Credits",
            meeting_window: "TR 9:30 – 10:45 AM",
            seats_left: "11 of 25 Open",
            downstream_tradeoff: "Fits TR 9:30 AM slot; brings total load to 14 credits"
          },
          {
            course_code: "ART 140 — Studio Ceramics",
            pillar: "Liberal Arts Elective",
            credits: "4 Credits",
            meeting_window: "MWF 1:00 – 2:50 PM",
            seats_left: "4 of 16 Open",
            downstream_tradeoff: "Competes with DATA 340 at MWF 1:00 PM; shifts DATA 340 to Fall if chosen"
          }
        ],
        scheduleSummary: {
          sliceLabel: "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective",
          totalCredits: "14 Credits (4 Courses)",
          f1Status: "14 Credits (Meets 12-Credit Full-Time Minimum)"
        },
        calendarEvents: [
          {
            slotId: "09:30",
            days: "TR",
            course: "COSC 315",
            title: "Accessible Human-Computer Interaction",
            bucket: "Elective"
          },
          {
            slotId: "10:00",
            days: "MWF",
            course: "COSC 450",
            title: "Data Science Senior Capstone",
            bucket: "Major Core"
          },
          {
            slotId: "13:00",
            days: "MWF",
            course: "DATA 340",
            title: "Applied Machine Learning",
            bucket: "Major Core"
          },
          {
            slotId: "13:30",
            days: "TR",
            course: "RELI 218",
            title: "Global Christianities",
            bucket: "SOPHIA"
          }
        ],
        myProgress: [
          { category: "Overall 124-Credit Bachelor's Degree (78 Earned + 14 Current + 14 Planned = 106/124)", percent: 85, status: "Leaves Only 18 Credits for Senior Year" },
          { category: "Data Science & CS Major Core (After COSC 450 + DATA 340)", percent: 91, status: "Only 1 Senior Elective Remaining" },
          { category: "SOPHIA General Education Plan (After RELI 218 R2)", percent: 100, status: "100% Complete (45 of 45 Credits)" },
          { category: "F-1 International Full-Time Enrollment Guardrail", percent: 100, status: "14 Credits Planned (Min 12 Cr Required)" }
        ],
        courseCatalogDetails: {
          "COSC 450": {
            code: "COSC 450",
            title: "Data Science Senior Capstone",
            credits: "4 Credits",
            pillar: "Major Core (Spring-Only Capstone)",
            instructor: "Dr. Matthewulat",
            schedule: "Mon / Wed / Fri · 10:00 – 10:50 AM",
            location: "Froiland Science Complex 114",
            seats: "2 of 20 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "COSC 320 & DATA 310 (Prerequisite Override Ready for Advisor Approval)",
            shortHover: "COSC 450 (4 Cr · MWF 10:00 AM): Culminating project in Data Science & AI. Click for full description & syllabus.",
            description: "Culminating team and individual capstone experience in Data Science and Computer Science. Students partner with a Sioux Falls community or research sponsor to design, build, audit, and present an end-to-end machine learning or data engineering system with ethical and accessibility evaluation.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/cosc-450-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Weeks 1–4: Problem Scoping, Data Governance & Partner Charter",
              "Weeks 5–10: Model Development, WCAG Accessibility & Bias Audit",
              "Weeks 11–15: Final Deployment, Technical Paper & Oral Defense"
            ]
          },
          "DATA 340": {
            code: "DATA 340",
            title: "Applied Machine Learning",
            credits: "4 Credits",
            pillar: "Major Core (AI Track)",
            instructor: "Dr. Danielson",
            schedule: "Mon / Wed / Fri · 1:00 – 1:50 PM",
            location: "Froiland Science Complex 208",
            seats: "6 of 25 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "MATH 220 & COSC 210 (All Prerequisites Met)",
            shortHover: "DATA 340 (4 Cr · MWF 1:00 PM): Supervised/unsupervised ML & neural networks. Unlocks Fall 400-level AI.",
            description: "Hands-on exploration of supervised and unsupervised learning, feature engineering, ensemble methods, neural network architectures, and responsible AI evaluation using Python and cloud notebooks. Serves as the direct prerequisite for 400-level AI electives.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/data-340-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Module 1: Regression, Regularization & Cross-Validation",
              "Module 2: Tree Ensembles, Gradient Boosting & Explainability",
              "Module 3: Deep Learning Foundations & Model Evaluation"
            ]
          },
          "RELI 218": {
            code: "RELI 218",
            title: "Global Christianities",
            credits: "3 Credits",
            pillar: "Parallel SOPHIA Core (Religion R2)",
            instructor: "Dr. Haar",
            schedule: "Tue / Thu · 1:30 – 2:45 PM",
            location: "Humanities Center 104",
            seats: "9 of 25 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "RELI 110 (All Prerequisites Met)",
            shortHover: "RELI 218 (3 Cr · TR 1:30 PM): Completes your final SOPHIA R2 requirement. Click for description & syllabus.",
            description: "Examines the historical development, theological diversity, and contemporary lived practices of Christian communities across Africa, Asia, Latin America, and the global diaspora. Fulfills the SOPHIA Core Religion (R2) requirement.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/reli-218-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Unit 1: Early African & Asian Christian Traditions (Axum, Alexandria, Kerala)",
              "Unit 2: Colonial Encounters, Translation & Indigenous Theologies",
              "Unit 3: Global Migration & Contemporary World Christianity"
            ]
          },
          "COSC 315": {
            code: "COSC 315",
            title: "Accessible Human-Computer Interaction",
            credits: "3 Credits",
            pillar: "Liberal Arts & Career Elective",
            instructor: "Prof. Lindqvist",
            schedule: "Tue / Thu · 9:30 – 10:45 AM",
            location: "Madsen Center 210",
            seats: "11 of 25 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "COSC 210 (All Prerequisites Met)",
            shortHover: "COSC 315 (3 Cr · TR 9:30 AM): Universal design, WCAG 2.2 AAA & assistive tech studio. Click for syllabus.",
            description: "Studio-based course in human-centered computing, universal design, and WCAG 2.2 AA/AAA accessibility. Students design and test interfaces with screen readers (NVDA/VoiceOver), switch navigation, and high-contrast visual systems.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/cosc-315-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Part 1: Cognitive Walkthroughs, Usability Testing & Inclusive Design",
              "Part 2: Screen-Reader Semantics, ARIA & Non-Visual Interaction",
              "Part 3: Semester Design Portfolio & Accessibility Audit Project"
            ]
          },
          "MATH 310": {
            code: "MATH 310",
            title: "Linear Algebra",
            credits: "4 Credits",
            pillar: "Mathematics Minor Requirement",
            instructor: "Dr. Sorensen",
            schedule: "Tue / Thu · 9:30 – 10:45 AM",
            location: "Froiland Science Complex 220",
            seats: "8 of 24 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "MATH 152 Calculus II (All Prerequisites Met)",
            shortHover: "MATH 310 (4 Cr · TR 9:30 AM): Vector spaces, eigenvalues & matrix decompositions. Completes Math Minor.",
            description: "Rigorous study of systems of linear equations, matrix algebra, determinants, vector spaces, linear transformations, eigenvalues and eigenvectors, orthogonality, and singular value decomposition with applications to data science.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/math-310-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Chapters 1–3: Matrix Operations, Subspaces & Basis",
              "Chapters 4–5: Eigenvalues, Diagonalization & Dynamical Systems",
              "Chapters 6–7: Orthogonality, Least Squares & SVD"
            ]
          },
          "ART 140": {
            code: "ART 140",
            title: "Studio Ceramics",
            credits: "4 Credits",
            pillar: "Liberal Arts Elective (Creative Arts)",
            instructor: "Prof. Peters",
            schedule: "Mon / Wed / Fri · 1:00 – 2:50 PM",
            location: "Center for Visual Arts 102",
            seats: "4 of 16 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "None — Open to All Undergraduates",
            shortHover: "ART 140 (4 Cr · MWF 1:00–2:50 PM): Hand-building, wheel-throwing & glaze chemistry. Click for syllabus.",
            description: "Introduction to ceramic studio processes including hand-building, wheel-throwing, surface design, glaze formulation, and kiln firing. Emphasizes sculptural and functional form within the liberal arts tradition.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/art-140-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Studio Block 1: Pinch, Coil & Slab Architectural Forms",
              "Studio Block 2: Wheel-Throwing Fundamentals & Trimming",
              "Studio Block 3: Glaze Chemistry, Firing & Critique Exhibition"
            ]
          },
          "MUSI 118": {
            code: "MUSI 118",
            title: "History of Jazz",
            credits: "2 Credits",
            pillar: "Liberal Arts Elective",
            instructor: "Dr. Unger",
            schedule: "Tue / Thu · 9:30 – 10:20 AM",
            location: "Fryxell Humanities Center 112",
            seats: "14 of 30 Seats Remaining (Jenzabar J1 Live)",
            prerequisites: "None — Open to All Undergraduates",
            shortHover: "MUSI 118 (2 Cr · TR 9:30 AM): Evolution of jazz from New Orleans to contemporary improvisation.",
            description: "Traces the cultural and musical history of jazz from its West African and New Orleans roots through Swing, Bebop, Cool Jazz, Hard Bop, Free Jazz, and contemporary global fusion.",
            syllabusUrl: "https://www.augie.edu/academics/catalog/musi-118-syllabus-spring-2027.pdf",
            syllabusHighlights: [
              "Era 1: Blues, Ragtime & Early New Orleans Polyphony",
              "Era 2: Duke Ellington, Swing Big Bands & the Bebop Revolution",
              "Era 3: Modal Jazz, Miles Davis, John Coltrane & Modern Voices"
            ]
          }
        }
      }
    }
  }
};
