#!/usr/bin/env python3
"""
Builds structured JSON and JS data assets for the Augustana University (Sioux Falls, SD)
Academic Advising Agent (AAA) A2UI + ADK 2-Hour Design Hackathon.

Reads `data/personas.csv` (exported from Google Sheet 1V_U0lXWP40WdDWyacq8QM_emvrwOKWCsPOZzZnWLooo)
and generates:
  - data/personas.json
  - data/zion_schema_mapping.json (Hypothetical fields -> incoming Zion Cloud Solutions dictionary)
  - data/mock_augie_data.json (Synthetic Augustana University Sioux Falls advising dataset)
  - docs/views/personas-data.js (Zero-CORS bundle for local file:// and GitHub Pages)
"""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DOCS_VIEWS_DIR = ROOT / "docs" / "views"


def parse_associated_users(raw_text: str):
    users = []
    if not raw_text or not raw_text.strip():
        return users
    for line in raw_text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        if ":" in line:
            name, email = line.split(":", 1)
            users.append({"name": name.strip(), "email": email.strip()})
        else:
            users.append({"name": line, "email": ""})
    return users


PERSONA_META = {
    "Admin": {
        "id": "admin",
        "icon": "🛡️",
        "tier": "Institutional Leadership & Systems",
        "rbacLevel": 100,
        "defaultUnit": "Augustana University (Sioux Falls, SD — All Units)",
        "primaryFocus": "System-wide retention, unassigned advisee audits, portal usage, global advisor ratios, systemic holds, and financial aid SAP compliance.",
        "a11yConsiderations": "High-density institutional tables require clear screen-reader table summaries, keyboard-sortable columns, and non-color systemic risk flags."
    },
    "Provost": {
        "id": "provost",
        "icon": "🏛️",
        "tier": "Institutional Leadership & Systems",
        "rbacLevel": 95,
        "defaultUnit": "Academic Affairs (All Colleges & Schools)",
        "primaryFocus": "Graduation rates by academic unit, 3-year enrollment trends, faculty advising load distribution, SOPHIA Gen-Ed fulfillment, STEM vs. non-STEM persistence, and critical seat shortages.",
        "a11yConsiderations": "Multi-unit trend comparisons pair visual sparklines/bars with explicit numeric deltas and screen-reader-accessible summary captions."
    },
    "Registrar": {
        "id": "registrar",
        "icon": "📋",
        "tier": "Systems & Compliance",
        "rbacLevel": 90,
        "defaultUnit": "Office of the Registrar",
        "primaryFocus": "Degree clearance, core curriculum substitutions, academic policy overrides, transfer equivalencies, credit-hour overload monitoring, prerequisite conflicts, grade changes, and residency credit compliance.",
        "a11yConsiderations": "Actionable approval queues include explicit keyboard focus targets (48x48px), accessible confirmation dialogs, and clear status badges."
    },
    "Student Success": {
        "id": "student_success",
        "icon": "🧭",
        "tier": "Systems & Compliance",
        "rbacLevel": 85,
        "defaultUnit": "Student Success Center",
        "primaryFocus": "Early warning indicators, academic warning/probation cohorts, unregistered student outreach, active registration holds, DFW gateway courses, transfer retention, and F-1 international / accommodation support.",
        "a11yConsiderations": "Holistic student alerts highlight accommodation & international visa (F-1 12-credit minimum) flags with plain-language explanations."
    },
    "Deans": {
        "id": "deans",
        "icon": "🎓",
        "tier": "Academic Unit Leadership",
        "rbacLevel": 75,
        "defaultUnit": "School / College (e.g., School of Music, Lust School of Education, Nursing, Business)",
        "primaryFocus": "Credit hour production, major retention rates, graduation eligibility, average time-to-degree, course bottlenecks, probation counts, full-time load rates, and degree plan exceptions.",
        "a11yConsiderations": "School-level rollups provide structured drill-downs with semantic region landmarks and downloadable CSV/Sheets views."
    },
    "Area Chair": {
        "id": "area_chair",
        "icon": "🗂️",
        "tier": "Academic Unit Leadership",
        "rbacLevel": 65,
        "defaultUnit": "Divisional Area (Natural Sciences, Social Sciences, Humanities, Fine & Performing Arts)",
        "primaryFocus": "Enrollment distribution across area departments, course withdrawal rates, cross-departmental bottlenecks, foundational course completion, advising load balance, and 4-year graduation rates.",
        "a11yConsiderations": "Cross-departmental matrices use both row and column headers (<th scope='row'> and <th scope='col'>) for JAWS/NVDA/VoiceOver navigation."
    },
    "Program Director": {
        "id": "program_director",
        "icon": "🔬",
        "tier": "Department & Program Leadership",
        "rbacLevel": 55,
        "defaultUnit": "Interdisciplinary / Specialized Program (e.g., Data Science, Nursing, Pre-Medicine)",
        "primaryFocus": "Program plan-of-study enrollment, under-enrolled core courses, capstone completion, course substitution approvals, transfer admits, and elective track popularity.",
        "a11yConsiderations": "Substitution approval workflows pair clear before/after course equivalencies with plain-language rationale fields."
    },
    "Department Chair": {
        "id": "department_chair",
        "icon": "🏫",
        "tier": "Department & Program Leadership",
        "rbacLevel": 50,
        "defaultUnit": "Academic Department (e.g., Computer Science & Mathematics, Biology, Music, Religion)",
        "primaryFocus": "Faculty advising capacity & assignment load, adding course sections for next term, departmental probation, prerequisite overrides, gateway course failure rates, and new major declarations.",
        "a11yConsiderations": "Faculty load and section capacity tables include non-color threshold badges (e.g., Over Capacity, Balanced, Needs Section)."
    },
    "Advisor": {
        "id": "advisor",
        "icon": "🤝",
        "tier": "Direct Advising & Student Experience",
        "rbacLevel": 30,
        "defaultUnit": "Assigned Advisee Roster Only",
        "primaryFocus": "Advisee registration status, prerequisite overrides, remaining credits to graduate, SOPHIA Gen-Ed checklist, registration holds, financial aid SAP status, major-change simulations, midterm grades below C, and career-aligned electives.",
        "a11yConsiderations": "1-on-1 advising views include a screen-share / student-friendly toggle with plain-language definitions and F-1 visa credit-load guardrails."
    },
    "Student": {
        "id": "student",
        "icon": "⚡",
        "tier": "Direct Advising & Student Experience",
        "rbacLevel": 10,
        "defaultUnit": "Self Only (Individual Student Record)",
        "primaryFocus": "Next-semester course recommendations, expected graduation date, major-change what-if explorer, remaining degree & SOPHIA Gen-Ed credits, transfer credit coverage, capstone prerequisites, drop-course impact (including F-1 12-credit check), and booking advisor appointments.",
        "a11yConsiderations": "Designed for blind, deaf, visually impaired, and international students: WCAG AAA contrast option, screen-reader narration, 100% visual parity (zero audio-only cues), higher-ed jargon glossary, and multilingual labels."
    }
}

DEFAULT_STUDENT_SYSTEM_PROMPT = (
    "You are the Student's personal Academic Advising Companion at Augustana University in Sioux Falls, South Dakota. "
    "You only have access to this individual student's record (Self Only scope). "
    "Your goal is to empower the student with clear, accessible, jargon-free guidance on their SOPHIA general education plan, "
    "major requirements, transfer credits, graduation timeline, F-1 international enrollment rules (if applicable), and direct connection to their assigned Augustana advisor."
)


def build_personas():
    csv_path = DATA_DIR / "personas.csv"
    personas = []
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=1):
            role = (row.get("Role") or "").strip()
            if not role:
                continue
            meta = PERSONA_META.get(role, {
                "id": role.lower().replace(" ", "_"),
                "icon": "👤",
                "tier": "Campus Role",
                "rbacLevel": 10,
                "defaultUnit": "Augustana University",
                "primaryFocus": "",
                "a11yConsiderations": ""
            })
            raw_prompt = (row.get("Companion System Message / Prompt") or "").strip().strip('"').strip()
            if not raw_prompt and role == "Student":
                raw_prompt = DEFAULT_STUDENT_SYSTEM_PROMPT

            questions = []
            for q_idx in range(1, 11):
                q_text = (row.get(f"Question {q_idx}") or "").strip()
                if q_text:
                    questions.append({
                        "id": f"q{q_idx}",
                        "number": q_idx,
                        "question": q_text
                    })

            personas.append({
                "order": idx,
                "id": meta["id"],
                "role": role,
                "icon": meta["icon"],
                "tier": meta["tier"],
                "rbacLevel": meta["rbacLevel"],
                "advisingScope": (row.get("Advising Scope") or "").strip(),
                "defaultUnit": meta["defaultUnit"],
                "systemPrompt": raw_prompt,
                "FromSheetPrompt": (row.get("Companion System Message / Prompt") or "").strip(),
                "associatedUsers": parse_associated_users(row.get("Associated Email Addresses", "")),
                "googleGroupId": (row.get("Google Group ID") or "").strip() or f"aaa-{meta['id']}@augie.edu (Pending Provisioning)",
                "primaryFocus": meta["primaryFocus"],
                "a11yConsiderations": meta["a11yConsiderations"],
                "questions": questions
            })
    return personas


def build_zion_schema_mapping():
    """
    Creates the Hypothetical -> Zion Cloud Solutions Field Dictionary Adapter.
    Since the official field list from Zion Cloud Solutions arrives tonight/tomorrow,
    every field in the A2UI workbench references this dictionary so fields can be
    remapped in one place.
    """
    return {
        "schemaStatus": "HYPOTHETICAL_PRE_ZION_CLOUD_SOLUTIONS",
        "partner": "Zion Cloud Solutions",
        "institution": "Augustana University (Sioux Falls, SD)",
        "lastUpdated": "2026-10-29",
        "instructionsForTomorrow": (
            "When Zion Cloud Solutions delivers the official SIS/CRM data dictionary, "
            "update the `zionOfficialField` and `zionTable` properties below (or paste the CSV/JSON "
            "into the Workbench 'Zion Field Mapper' modal) to automatically re-label all 10 persona A2UI tables."
        ),
        "jargonGlossary": {
            "SOPHIA": {
                "term": "SOPHIA Plan (Core General Education)",
                "plainLanguage": "Augustana University's general education curriculum required of all undergraduates (Exploring the Liberal Arts).",
                "i18n": {
                    "es": "Plan SOPHIA (Educación General Básica)",
                    "zh": "SOPHIA 核心通识教育计划",
                    "ne": "SOPHIA सामान्य शिक्षा योजना",
                    "am": "SOPHIA አጠቃላይ ትምህርት ዕቅድ"
                }
            },
            "DFW Rate": {
                "term": "DFW Rate (Drop / Fail / Withdraw %)",
                "plainLanguage": "Percentage of enrolled students who earn a D, earn an F, or withdraw (W) from a course rather than completing it with C- or better.",
                "i18n": {
                    "es": "Tasa DFW (% de Baja, Reprobación o Retiro)",
                    "zh": "DFW 率（低分/不及格/退课比例）",
                    "ne": "DFW दर (ड्रप / फेल / फिर्ता प्रतिशत)",
                    "am": "DFW ምጣኔ (ያቋረጡ/የወደቁ ተማሪዎች መቶኛ)"
                }
            },
            "SAP": {
                "term": "SAP (Satisfactory Academic Progress)",
                "plainLanguage": "Federal and institutional requirement (minimum GPA and credit completion pace) needed to keep financial aid and scholarships.",
                "i18n": {
                    "es": "Progreso Académico Satisfactorio (Requisito de Ayuda Financiera)",
                    "zh": "学业进展合格标准（维持奖助学金要求）",
                    "ne": "सन्तोषजनक शैक्षिक प्रगति (छात्रवृत्ति कायम राख्ने नियम)",
                    "am": "አጥጋቢ የትምህርት እድገት (የገንዘብ ድጋፍ መስፈርት)"
                }
            },
            "Hold": {
                "term": "Registration Hold",
                "plainLanguage": "A block on your account (such as an unpaid balance, missing immunization form, or required advisor check-in) that must be cleared before you can register for classes.",
                "i18n": {
                    "es": "Retención de Matrícula (Bloqueo temporal para inscribir clases)",
                    "zh": "选课限制/冻结（需先解除才能选课）",
                    "ne": "दर्ता रोक्का (कक्षा दर्ता गर्नुअघि हटाउनुपर्ने अवरोध)",
                    "am": "የምዝገባ እገዳ (ኮርስ ከመመዝገብዎ በፊት መፈታት ያለበት)"
                }
            },
            "F-1 Full-Time Load": {
                "term": "F-1 International Full-Time Enrollment (12+ Credits)",
                "plainLanguage": "US SEVIS immigration rule requiring F-1 international undergraduate students to stay enrolled in at least 12 credits each fall/spring semester unless authorized by the International Programs Office (IPO).",
                "i18n": {
                    "es": "Carga Completa F-1 (Mínimo 12 créditos para visa internacional)",
                    "zh": "F-1 国际学生全职学分要求（每学期至少 12 学分）",
                    "ne": "F-1 अन्तर्राष्ट्रिय पूर्ण-समय क्रेडिट (कम्तीमा १२ क्रेडिट आवश्यक)",
                    "am": "የF-1 ዓለም አቀፍ ተማሪ ሙሉ ጊዜ ትምህርት (ቢያንስ 12 ክሬዲት)"
                }
            },
            "Prerequisite Override": {
                "term": "Prerequisite Override",
                "plainLanguage": "Official permission from a faculty member or department chair allowing a student to enroll in a class without having completed the standard prior course.",
                "i18n": {
                    "es": "Exención de Prerrequisito (Permiso especial para inscribir un curso)",
                    "zh": "先修课豁免许可（系主任/教师特批选课）",
                    "ne": "पूर्वशर्त छुट अनुमति (विशेष अनुमतिले कक्षा लिने)",
                    "am": "የቅድመ-ሁኔታ ይሁንታ (ያለ ቅድመ ኮርስ ለመመዝገብ የሚሰጥ ፈቃድ)"
                }
            },
            "Residency Requirement": {
                "term": "Institutional Residency Credit Requirement",
                "plainLanguage": "The minimum number of credit hours (particularly upper-level credits) that must be taken directly at Augustana University rather than transferred from another college.",
                "i18n": {
                    "es": "Requisito de Créditos en Residencia (Créditos cursados en Augustana)",
                    "zh": "本校修读学分要求（必须在奥古斯塔纳大学修满的学分）",
                    "ne": "संस्थागत रेसिडेन्सी क्रेडिट (अगस्टानामा नै पढ्नुपर्ने क्रेडिट)",
                    "am": "በዩኒቨርሲቲው ውስጥ መወሰድ ያለባቸው ክሬዲቶች"
                }
            }
        },
        "fields": [
            {
                "hypotheticalField": "student_id",
                "zionOfficialField": "PENDING_ZION_STU_ID",
                "zionTable": "PENDING_ZION_STUDENT_MASTER",
                "label": "Student ID",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Unique Augustana University student identifier."
            },
            {
                "hypotheticalField": "student_name",
                "zionOfficialField": "PENDING_ZION_FULL_NAME",
                "zionTable": "PENDING_ZION_STUDENT_MASTER",
                "label": "Student Name",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Student's preferred display name and pronouns."
            },
            {
                "hypotheticalField": "academic_unit",
                "zionOfficialField": "PENDING_ZION_COLLEGE_CODE",
                "zionTable": "PENDING_ZION_ACADEMIC_PROGRAMS",
                "label": "School / Divisional Area",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Augustana School, College, or Arts & Sciences Divisional Area."
            },
            {
                "hypotheticalField": "department",
                "zionOfficialField": "PENDING_ZION_DEPT_CODE",
                "zionTable": "PENDING_ZION_ACADEMIC_PROGRAMS",
                "label": "Department",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Home academic department at Augustana University."
            },
            {
                "hypotheticalField": "major_program",
                "zionOfficialField": "PENDING_ZION_MAJOR_CIP_CODE",
                "zionTable": "PENDING_ZION_ACADEMIC_PROGRAMS",
                "label": "Declared Major / Program",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Primary undergraduate or graduate degree program."
            },
            {
                "hypotheticalField": "assigned_advisor",
                "zionOfficialField": "PENDING_ZION_ADVISOR_ID",
                "zionTable": "PENDING_ZION_ADVISING_ROSTER",
                "label": "Primary Faculty / Success Advisor",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Assigned Augustana mentor who guides course planning and degree progress."
            },
            {
                "hypotheticalField": "credits_completed",
                "zionOfficialField": "PENDING_ZION_EARNED_CREDITS",
                "zionTable": "PENDING_ZION_DEGREE_AUDIT",
                "label": "Earned Credits (of 124)",
                "dataType": "number",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Total credit hours earned toward the 124-credit Augustana bachelor's degree."
            },
            {
                "hypotheticalField": "current_term_credits",
                "zionOfficialField": "PENDING_ZION_TERM_ENROLLED_CREDITS",
                "zionTable": "PENDING_ZION_ENROLLMENT_TERM",
                "label": "Current Term Credits",
                "dataType": "number",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Credits enrolled this semester (12+ required for full-time aid & F-1 international status)."
            },
            {
                "hypotheticalField": "sophia_gen_ed_status",
                "zionOfficialField": "PENDING_ZION_CORE_AUDIT_STATUS",
                "zionTable": "PENDING_ZION_DEGREE_AUDIT",
                "label": "SOPHIA Gen-Ed Fulfillment",
                "dataType": "badge",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Progress on Augustana's SOPHIA Core general education categories."
            },
            {
                "hypotheticalField": "registration_holds",
                "zionOfficialField": "PENDING_ZION_HOLD_CODES",
                "zionTable": "PENDING_ZION_STUDENT_HOLDS",
                "label": "Active Holds",
                "dataType": "badge",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Account flags (Advising, Financial, Immunization) that block course registration."
            },
            {
                "hypotheticalField": "academic_standing",
                "zionOfficialField": "PENDING_ZION_ACAD_STANDING",
                "zionTable": "PENDING_ZION_DEGREE_AUDIT",
                "label": "Academic Standing & SAP",
                "dataType": "badge",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Good Standing, Academic Warning, or Probation + Financial Aid Satisfactory Academic Progress."
            },
            {
                "hypotheticalField": "early_warning_flags",
                "zionOfficialField": "PENDING_ZION_ALERT_COUNT",
                "zionTable": "PENDING_ZION_STUDENT_ALERTS",
                "label": "Early Warning Indicators",
                "dataType": "badge",
                "minRbacLevel": 30,
                "plainLanguageDescription": "Attendance, midterm grade < C, or LMS engagement alerts raised by faculty."
            },
            {
                "hypotheticalField": "visa_international_status",
                "zionOfficialField": "PENDING_ZION_VISA_SEVIS_FLAG",
                "zionTable": "PENDING_ZION_INTERNATIONAL",
                "label": "International / F-1 Credit Guardrail",
                "dataType": "badge",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Monitors 12-credit SEVIS full-time requirement and reduced course load (RCL) authorization."
            },
            {
                "hypotheticalField": "accessibility_accommodations",
                "zionOfficialField": "PENDING_ZION_ADA_PREF_FORMAT",
                "zionTable": "PENDING_ZION_STUDENT_SUPPORT",
                "label": "Accessibility & Modality Prefs",
                "dataType": "string",
                "minRbacLevel": 10,
                "plainLanguageDescription": "Screen-reader compatibility, ASL/captioning, Braille/large-print materials, or testing accommodations."
            }
        ]
    }


def build_mock_augie_data():
    """
    Synthetic Augustana University (Sioux Falls, SD) advising dataset.
    Zero real student PII. Built to illustrate all 10 personas and 100 questions.
    """
    return {
        "disclaimer": "HYPOTHETICAL SYNTHETIC DATASET FOR A2UI DESIGN HACKATHON — Awaiting official Zion Cloud Solutions field list.",
        "institution": {
            "name": "Augustana University",
            "location": "Sioux Falls, South Dakota",
            "domain": "augie.edu",
            "mascot": "Vikings",
            "colors": {
                "augieNavy": "#081E3F",
                "augieGold": "#FED102",
                "augieLightBlue": "#8D9EBC",
                "augieGreen": "#789D4A"
            }
        },
        "universityMetrics": {
            "firstToSecondYearRetention": "86.4%",
            "fourYearGraduationRate": "71.8%",
            "overallCourseCompletionRate": "93.2%",
            "globalAdvisorToStudentRatio": "1 : 18.4",
            "unassignedAdviseesCount": 42,
            "activePortalUsersNow": 318,
            "degreeProgressChecksLastMonth": 1420,
            "studentsWithSystemicHolds": 164
        },
        "sampleAdvisees": [
            {
                "student_id": "AUG-2027-1042",
                "student_name": "Amina Tesfaye",
                "cohort": "Junior (Class of 2027)",
                "academic_unit": "Natural Sciences Area",
                "department": "Computer Science & Mathematics",
                "major_program": "Data Science & Computer Science (B.A.)",
                "assigned_advisor": "Dr. Matthewulat / CS Faculty Advisor",
                "credits_completed": 78,
                "current_term_credits": 14,
                "sophia_gen_ed_status": "✓ 9 of 10 SOPHIA Categories Complete (Needs Religion R2)",
                "registration_holds": "✓ Clear (Eligible for Nov 12 Window)",
                "academic_standing": "✓ Good Standing (SAP Met — 3.74 GPA)",
                "early_warning_flags": "✓ 0 Active Alerts",
                "visa_international_status": "🌐 F-1 International (14 cr — Above 12 cr SEVIS Min)",
                "accessibility_accommodations": "Screen Reader (NVDA) + Multilingual Glossary (English / Amharic)",
                "next_semester_registered": "No — Waiting on Data Science Capstone Prereq Check"
            },
            {
                "student_id": "AUG-2028-2198",
                "student_name": "Lucas Sorenson",
                "cohort": "Sophomore (Class of 2028)",
                "academic_unit": "School of Music",
                "department": "Music",
                "major_program": "Music Education (B.A.)",
                "assigned_advisor": "Dr. Folliard / Music Faculty Advisor",
                "credits_completed": 44,
                "current_term_credits": 16,
                "sophia_gen_ed_status": "⚠ 5 of 10 SOPHIA Categories Complete",
                "registration_holds": "⛔ Advising Hold (Pin Required)",
                "academic_standing": "✓ Good Standing (SAP Met — 3.18 GPA)",
                "early_warning_flags": "⚠ 1 Alert: MUSI 214 Aural Skills II Midterm C-",
                "visa_international_status": "Domestic Student",
                "accessibility_accommodations": "Deaf / Hard-of-Hearing — Real-Time Captioning & Visual Alerts Enabled",
                "next_semester_registered": "No — Advising Hold Active"
            },
            {
                "student_id": "AUG-2026-0881",
                "student_name": "Priya Gurung",
                "cohort": "Senior (Class of 2026)",
                "academic_unit": "Natural Sciences Area",
                "department": "Nursing",
                "major_program": "Nursing (B.S.N.)",
                "assigned_advisor": "Prof. Sarah Lindstrom",
                "credits_completed": 112,
                "current_term_credits": 12,
                "sophia_gen_ed_status": "✓ 10 of 10 SOPHIA Complete",
                "registration_holds": "✓ Clear",
                "academic_standing": "✓ Good Standing (3.88 GPA — Graduation Candidate)",
                "early_warning_flags": "✓ 0 Active Alerts",
                "visa_international_status": "🌐 F-1 International (⚠ Dropping 1 course would drop below 12 cr limit!)",
                "accessibility_accommodations": "Plain-Language Clinical & Licensing Terminology Enabled (Nepali/English)",
                "next_semester_registered": "Yes — Registered (12 cr Spring Capstone)"
            },
            {
                "student_id": "AUG-2029-3310",
                "student_name": "Jordanchnik Rivera",
                "cohort": "First-Year (Class of 2029)",
                "academic_unit": "Social Sciences Area",
                "department": "Business Administration",
                "major_program": "Accounting & Finance (Exploring)",
                "assigned_advisor": "Charlotte Snyder (Student Success)",
                "credits_completed": 13,
                "current_term_credits": 13,
                "sophia_gen_ed_status": "⚠ 2 of 10 SOPHIA Complete (Enrolled in FYS 110)",
                "registration_holds": "⛔ Financial Balance Hold ($420)",
                "academic_standing": "⚠ Academic Warning (2.10 Midterm Est. — SAP Watch)",
                "early_warning_flags": "⛔ 2 Alerts: Missed 3 classes in ECON 120; Midterm D+ in ACCT 210",
                "visa_international_status": "Domestic First-Gen Transfer-Credit Student",
                "accessibility_accommodations": "Low Vision — High-Contrast AAA & 150% Text Zoom Preferred",
                "next_semester_registered": "No — Blocked by Financial Hold"
            }
        ]
    }


def main():
    personas = build_personas()
    zion_schema = build_zion_schema_mapping()
    mock_data = build_mock_augie_data()

    (DATA_DIR / "personas.json").write_text(
        json.dumps(personas, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    (DATA_DIR / "zion_schema_mapping.json").write_text(
        json.dumps(zion_schema, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    (DATA_DIR / "mock_augie_data.json").write_text(
        json.dumps(mock_data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )

    DOCS_VIEWS_DIR.mkdir(parents=True, exist_ok=True)
    js_bundle = (
        "// Auto-generated from data/personas.csv, data/zion_schema_mapping.json, and data/mock_augie_data.json\n"
        f"window.AUGIE_AAA_PERSONAS = {json.dumps(personas, indent=2, ensure_ascii=False)};\n\n"
        f"window.AUGIE_ZION_SCHEMA = {json.dumps(zion_schema, indent=2, ensure_ascii=False)};\n\n"
        f"window.AUGIE_MOCK_DATA = {json.dumps(mock_data, indent=2, ensure_ascii=False)};\n"
    )
    (DOCS_VIEWS_DIR / "personas-data.js").write_text(js_bundle, encoding="utf-8")
    print(f"Built {len(personas)} personas, {sum(len(p['questions']) for p in personas)} questions, and Zion schema adapter.")


if __name__ == "__main__":
    main()
