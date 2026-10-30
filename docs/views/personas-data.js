// Auto-generated from data/personas.csv, data/zion_schema_mapping.json, and data/mock_augie_data.json
window.AUGIE_AAA_PERSONAS = [
  {
    "order": 1,
    "id": "admin",
    "role": "Admin",
    "icon": "🛡️",
    "tier": "Institutional Leadership & Systems",
    "rbacLevel": 100,
    "advisingScope": "All (University-Wide)",
    "defaultUnit": "Augustana University (Sioux Falls, SD — All Units)",
    "systemPrompt": "You are an agent admin. You have the highest level permissions with global read-access. You have the ability to deep-dive into any student, faculty, or advisor-level data to ensure institutional alignment and academic excellence with this advisor.",
    "FromSheetPrompt": "\"You are an agent admin. You have the highest level permissions with global read-access. You have the ability to deep-dive into any student, faculty, or advisor-level data to ensure institutional alignment and academic excellence with this advisor.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-admin@augie.edu (Pending Provisioning)",
    "primaryFocus": "System-wide retention, unassigned advisee audits, portal usage, global advisor ratios, systemic holds, and financial aid SAP compliance.",
    "a11yConsiderations": "High-density institutional tables require clear screen-reader table summaries, keyboard-sortable columns, and non-color systemic risk flags.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "What is the system-wide retention rate for this academic year?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which departments currently have the highest number of unassigned advisees?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "Can you generate an audit report of system usage across all academic units?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "How many total degree progress checks were completed last month?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "What are the current global advisor-to-student ratios across all campuses?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Are there any systemic flags or holds currently affecting large groups of students?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "How many active users are currently logged into the advising portal?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "Which academic programs have the highest rate of major changes this year?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "What is the overall course completion rate across the entire university?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Can you export the global compliance report for financial aid academic progress?"
      }
    ]
  },
  {
    "order": 2,
    "id": "provost",
    "role": "Provost",
    "icon": "🏛️",
    "tier": "Institutional Leadership & Systems",
    "rbacLevel": 95,
    "advisingScope": "All (University-Wide)",
    "defaultUnit": "Academic Affairs (All Colleges & Schools)",
    "systemPrompt": "You are the Provost. You serve as the chief academic officer with global read-access. You have the ability to deep-dive into any student, faculty, or advisor-level data to ensure institutional alignment and academic excellence.",
    "FromSheetPrompt": "\"You are the Provost. You serve as the chief academic officer with global read-access. You have the ability to deep-dive into any student, faculty, or advisor-level data to ensure institutional alignment and academic excellence.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-provost@augie.edu (Pending Provisioning)",
    "primaryFocus": "Graduation rates by academic unit, 3-year enrollment trends, faculty advising load distribution, SOPHIA Gen-Ed fulfillment, STEM vs. non-STEM persistence, and critical seat shortages.",
    "a11yConsiderations": "Multi-unit trend comparisons pair visual sparklines/bars with explicit numeric deltas and screen-reader-accessible summary captions.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "What are the university-wide graduation rates broken down by academic unit?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which academic programs show a declining enrollment trend over the last 3 years?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "How do student outcome metrics compare across different academic divisions?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "What is the current distribution of faculty advising loads across academic units?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "How effectively are general education requirements being fulfilled across all majors?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Which units have the highest rate of students on academic probation?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "What percentage of first-year students are on track to graduate in four years?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "How do persistence rates vary between STEM and non-STEM disciplines?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "What is the overall student retention rate from year one to year two?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Which high-demand courses currently have critical seat shortages across the university?"
      }
    ]
  },
  {
    "order": 3,
    "id": "registrar",
    "role": "Registrar",
    "icon": "📋",
    "tier": "Systems & Compliance",
    "rbacLevel": 90,
    "advisingScope": "All (Systems & Compliance)",
    "defaultUnit": "Office of the Registrar",
    "systemPrompt": "You are the Registrar. You oversee all official academic records, curriculum requirements, and systems alignment. You act as the technical backbone of advising, collaborating with department chairs to manage registration, scheduling, and catalog compliance.",
    "FromSheetPrompt": "\"You are the Registrar. You oversee all official academic records, curriculum requirements, and systems alignment. You act as the technical backbone of advising, collaborating with department chairs to manage registration, scheduling, and catalog compliance.\"",
    "associatedUsers": [
      {
        "name": "Chris Assmus",
        "email": "chris.assmus@augie.edu"
      },
      {
        "name": "Kimberly Castle",
        "email": "kimberly.castle@augie.edu"
      },
      {
        "name": "Jennifer Davia",
        "email": "jennifer.davia@augie.edu"
      },
      {
        "name": "Melissa Kimmerling",
        "email": "melissa.kimmerling@augie.edu"
      },
      {
        "name": "Lori Leineke",
        "email": "lori.leineke@augie.edu"
      },
      {
        "name": "Mary Lewis",
        "email": "mary.lewis@augie.edu"
      },
      {
        "name": "Kerry Mallini",
        "email": "kerry.mallini@augie.edu"
      },
      {
        "name": "Andrea Mierau",
        "email": "andrea.mierau@augie.edu"
      },
      {
        "name": "Lindsay Perry",
        "email": "lindsay.perry@augie.edu"
      },
      {
        "name": "Eric Wilson",
        "email": "eric.wilson@augie.edu"
      }
    ],
    "googleGroupId": "aaa-registrar@augie.edu (Pending Provisioning)",
    "primaryFocus": "Degree clearance, core curriculum substitutions, academic policy overrides, transfer equivalencies, credit-hour overload monitoring, prerequisite conflicts, grade changes, and residency credit compliance.",
    "a11yConsiderations": "Actionable approval queues include explicit keyboard focus targets (48x48px), accessible confirmation dialogs, and clear status badges.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "How many students are currently pending degree clearance for the upcoming graduation?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Are there any core curriculum substitutions that require system-level approval?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "Which students have unresolved academic policy overrides on their record?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "How many course transfer equivalencies were processed this semester?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "What is the current list of students exceeding the maximum allowable credit hours?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Are there any course registration prerequisite conflicts reported for next term?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "How many grade change requests are currently awaiting processing?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "Which curriculum catalog changes need to be updated in the system for next year?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "What percentage of seniors have outstanding general education requirements?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Are all graduation candidates currently meeting residency credit requirements?"
      }
    ]
  },
  {
    "order": 4,
    "id": "student_success",
    "role": "Student Success",
    "icon": "🧭",
    "tier": "Systems & Compliance",
    "rbacLevel": 85,
    "advisingScope": "All (Systems & Compliance)",
    "defaultUnit": "Student Success Center",
    "systemPrompt": "You are a Student Success Advisor. You oversee all official academic records, curriculum requirements, and systems alignment. You act as the technical backbone of advising, collaborating with department chairs to manage registration, scheduling, and catalog compliance.",
    "FromSheetPrompt": "\"You are a Student Success Advisor. You oversee all official academic records, curriculum requirements, and systems alignment. You act as the technical backbone of advising, collaborating with department chairs to manage registration, scheduling, and catalog compliance.\"",
    "associatedUsers": [
      {
        "name": "Jessica Carlson",
        "email": "jessica.carlson@augie.edu"
      },
      {
        "name": "Tim Homan",
        "email": "tim.homan@augie.edu"
      },
      {
        "name": "Haley Maday",
        "email": "haley.maday@augie.edu"
      },
      {
        "name": "Jean Merkle",
        "email": "jean.merkle@augie.edu"
      },
      {
        "name": "Charlotte Snyder",
        "email": "charlotte.snyder@augie.edu"
      },
      {
        "name": "Sanna Strenge",
        "email": "sanna.strenge@augie.edu"
      },
      {
        "name": "Lydia Struck",
        "email": "lydia.struck@augie.edu"
      },
      {
        "name": "Mary Toso",
        "email": "mary.toso@augie.edu"
      }
    ],
    "googleGroupId": "aaa-student_success@augie.edu (Pending Provisioning)",
    "primaryFocus": "Early warning indicators, academic warning/probation cohorts, unregistered student outreach, active registration holds, DFW gateway courses, transfer retention, and F-1 international / accommodation support.",
    "a11yConsiderations": "Holistic student alerts highlight accommodation & international visa (F-1 12-credit minimum) flags with plain-language explanations.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "Which students in my cohort have missed multiple early warning indicators this term?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "How many students are currently on academic warning or probation?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "Which students haven't registered for next semester's classes yet?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "What intervention strategies have the highest success rate for at-risk freshmen?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "How many students have active holds preventing registration?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Which advisors have the highest volume of unresolved student alerts?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "What is the average time to resolution for student support referrals?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "How many students requested course withdrawals past the drop deadline?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "Which key gateway courses have the highest drop/fail/withdraw (DFW) rates?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "What is the current retention status of transfer students in their first semester?"
      }
    ]
  },
  {
    "order": 5,
    "id": "deans",
    "role": "Deans",
    "icon": "🎓",
    "tier": "Academic Unit Leadership",
    "rbacLevel": 75,
    "advisingScope": "All in School/College",
    "defaultUnit": "School / College (e.g., School of Music, Lust School of Education, Nursing, Business)",
    "systemPrompt": "You are the Dean of your School or College. You provide high-level academic and administrative leadership for your unit. You have structural oversight over all advising plans, exceptions, and student progress within your designated school or college.",
    "FromSheetPrompt": "\"You are the Dean of your School or College. You provide high-level academic and administrative leadership for your unit. You have structural oversight over all advising plans, exceptions, and student progress within your designated school or college.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-deans@augie.edu (Pending Provisioning)",
    "primaryFocus": "Credit hour production, major retention rates, graduation eligibility, average time-to-degree, course bottlenecks, probation counts, full-time load rates, and degree plan exceptions.",
    "a11yConsiderations": "School-level rollups provide structured drill-downs with semantic region landmarks and downloadable CSV/Sheets views.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "What is the total credit hour production across all departments in our academic unit?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which majors in our academic unit have the highest student retention rates?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "How many students in our academic unit are currently eligible for graduation?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "What is the average time-to-degree for students enrolled in our academic unit?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "Are there bottlenecks in required departmental courses preventing timely graduation?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "How does our academic unit's retention rate compare to the university average?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "How many students in our academic unit are currently on academic probation?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "Which programs in our academic unit have seen the largest shift in student enrollment?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "What percentage of students in our academic unit are taking a full-time course load?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "How many degree plan exceptions were approved within our academic unit this term?"
      }
    ]
  },
  {
    "order": 6,
    "id": "area_chair",
    "role": "Area Chair",
    "icon": "🗂️",
    "tier": "Academic Unit Leadership",
    "rbacLevel": 65,
    "advisingScope": "All in Area (Arts & Sciences)",
    "defaultUnit": "Divisional Area (Natural Sciences, Social Sciences, Humanities, Fine & Performing Arts)",
    "systemPrompt": "You are the Area Chair. You provide strategic oversight and administrative leadership for grouped departments within your specific divisional area. You monitor student progression and support department chairs in coordinating student success across the area.",
    "FromSheetPrompt": "\"You are the Area Chair. You provide strategic oversight and administrative leadership for grouped departments within your specific divisional area. You monitor student progression and support department chairs in coordinating student success across the area.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-area_chair@augie.edu (Pending Provisioning)",
    "primaryFocus": "Enrollment distribution across area departments, course withdrawal rates, cross-departmental bottlenecks, foundational course completion, advising load balance, and 4-year graduation rates.",
    "a11yConsiderations": "Cross-departmental matrices use both row and column headers (<th scope='row'> and <th scope='col'>) for JAWS/NVDA/VoiceOver navigation.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "How is student enrollment distributed across the departments in our area?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which majors in our divisional area have the highest rate of course withdrawals?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "Are there cross-departmental course bottlenecks affecting student progression in our area?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "What percentage of students in our area are successfully completing their foundational requirements?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "How do advising loads compare across the different departments in our area?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Which programs within our area are experiencing the highest growth in student majors?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "What is the four-year graduation rate for students majoring in our divisional area?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "How many students in our area require course substitutions for graduation this year?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "Which upper-level courses in our area have lower-than-projected enrollment?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Are students in our divisional area meeting key academic milestones on schedule?"
      }
    ]
  },
  {
    "order": 7,
    "id": "program_director",
    "role": "Program Director",
    "icon": "🔬",
    "tier": "Department & Program Leadership",
    "rbacLevel": 55,
    "advisingScope": "All in Program",
    "defaultUnit": "Interdisciplinary / Specialized Program (e.g., Data Science, Nursing, Pre-Medicine)",
    "systemPrompt": "You are the Program Director. You supervise the academic advising system and course plan-of-study development specifically for your program. You serve as the direct advocate for majors in your program, holding authoritative power to approve or reject course exceptions, substitutions, and transfer credits.",
    "FromSheetPrompt": "\"You are the Program Director. You supervise the academic advising system and course plan-of-study development specifically for your program. You serve as the direct advocate for majors in your program, holding authoritative power to approve or reject course exceptions, substitutions, and transfer credits.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-program_director@augie.edu (Pending Provisioning)",
    "primaryFocus": "Program plan-of-study enrollment, under-enrolled core courses, capstone completion, course substitution approvals, transfer admits, and elective track popularity.",
    "a11yConsiderations": "Substitution approval workflows pair clear before/after course equivalencies with plain-language rationale fields.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "How many students are currently enrolled in our program's plan of study?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which core program courses are currently under-enrolled for next semester?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "Are students in our program completing their capstone requirements on schedule?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "How many course substitution requests were submitted for our major this term?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "What is the average time-to-degree for students graduating from our program?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Which required program courses have the highest drop or failure rates?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "How many incoming transfer students were admitted into our program this semester?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "Are all program majors assigned to active program faculty advisors?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "What percentage of our program's students are on track with their plan of study?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Which elective tracks within our program are currently the most popular?"
      }
    ]
  },
  {
    "order": 8,
    "id": "department_chair",
    "role": "Department Chair",
    "icon": "🏫",
    "tier": "Department & Program Leadership",
    "rbacLevel": 50,
    "advisingScope": "All in Department",
    "defaultUnit": "Academic Department (e.g., Computer Science & Mathematics, Biology, Music, Religion)",
    "systemPrompt": "You are the Department Chair. You directly supervise the day-to-day academic advising system within your department in direct coordination with the Registrar’s Office and the Student Success Center. You assign advisors, arbitrate student-faculty academic conflicts, and ensure majors fulfill all specialized graduation requirements.",
    "FromSheetPrompt": "\"You are the Department Chair. You directly supervise the day-to-day academic advising system within your department in direct coordination with the Registrar’s Office and the Student Success Center. You assign advisors, arbitrate student-faculty academic conflicts, and ensure majors fulfill all specialized graduation requirements.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-department_chair@augie.edu (Pending Provisioning)",
    "primaryFocus": "Faculty advising capacity & assignment load, adding course sections for next term, departmental probation, prerequisite overrides, gateway course failure rates, and new major declarations.",
    "a11yConsiderations": "Faculty load and section capacity tables include non-color threshold badges (e.g., Over Capacity, Balanced, Needs Section).",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "What is the current advising capacity and student assignment load for our department faculty?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Which required departmental courses need additional sections added for next term?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "How many students in our department are currently on academic probation?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "Are there any department-specific prerequisite overrides pending review?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "What percentage of our department’s majors are on track to graduate this year?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Which gateway courses in our department have the highest failure rates?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "How many senior majors in our department need course substitutions to graduate?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "What is the overall course completion rate for undergraduate classes in our department?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "Are all declared majors in our department assigned to a primary advisor?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "How many students declared or switched into our department’s majors this term?"
      }
    ]
  },
  {
    "order": 9,
    "id": "advisor",
    "role": "Advisor",
    "icon": "🤝",
    "tier": "Direct Advising & Student Experience",
    "rbacLevel": 30,
    "advisingScope": "Assigned Advisees Only",
    "defaultUnit": "Assigned Advisee Roster Only",
    "systemPrompt": "You are the Academic Advisor. You act as the primary, direct mentor and guide to your specifically assigned roster of students. You partner with each student to foster self-advocacy, navigate degree plans, resolve registration hurdles, and connect them with institutional support systems.",
    "FromSheetPrompt": "\"You are the Academic Advisor. You act as the primary, direct mentor and guide to your specifically assigned roster of students. You partner with each student to foster self-advocacy, navigate degree plans, resolve registration hurdles, and connect them with institutional support systems.\"",
    "associatedUsers": [],
    "googleGroupId": "aaa-advisor@augie.edu (Pending Provisioning)",
    "primaryFocus": "Advisee registration status, prerequisite overrides, remaining credits to graduate, SOPHIA Gen-Ed checklist, registration holds, financial aid SAP status, major-change simulations, midterm grades below C, and career-aligned electives.",
    "a11yConsiderations": "1-on-1 advising views include a screen-share / student-friendly toggle with plain-language definitions and F-1 visa credit-load guardrails.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "Which of my assigned advisees have not yet registered for next semester?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "Does this student need any prerequisite overrides to register for their target classes?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "How many remaining credit hours does this advisee need to meet graduation requirements?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "Which required courses does my advisee still need to fulfill their general education plan?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "Has this student cleared all registration holds before their enrollment window opens?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "Is my advisee currently on track to maintain financial aid academic progress?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "What course substitutions can we submit to keep this student on track for spring graduation?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "How will changing their major impact this advisee's expected graduation date?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "Which of my advisees have mid-term grades below a C in required major courses?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "What are the recommended elective options for this student based on their career goals?"
      }
    ]
  },
  {
    "order": 10,
    "id": "student",
    "role": "Student",
    "icon": "⚡",
    "tier": "Direct Advising & Student Experience",
    "rbacLevel": 10,
    "advisingScope": "Self Only",
    "defaultUnit": "Self Only (Individual Student Record)",
    "systemPrompt": "You are the Student's personal Academic Advising Companion at Augustana University in Sioux Falls, South Dakota. You only have access to this individual student's record (Self Only scope). Your goal is to empower the student with clear, accessible, jargon-free guidance on their SOPHIA general education plan, major requirements, transfer credits, graduation timeline, F-1 international enrollment rules (if applicable), and direct connection to their assigned Augustana advisor.",
    "FromSheetPrompt": "",
    "associatedUsers": [],
    "googleGroupId": "aaa-student@augie.edu (Pending Provisioning)",
    "primaryFocus": "Next-semester course recommendations, expected graduation date, major-change what-if explorer, remaining degree & SOPHIA Gen-Ed credits, transfer credit coverage, capstone prerequisites, drop-course impact (including F-1 12-credit check), and booking advisor appointments.",
    "a11yConsiderations": "Designed for blind, deaf, visually impaired, and international students: WCAG AAA contrast option, screen-reader narration, 100% visual parity (zero audio-only cues), higher-ed jargon glossary, and multilingual labels.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "question": "What courses should I take next semester?"
      },
      {
        "id": "q2",
        "number": 2,
        "question": "When will I graduate?"
      },
      {
        "id": "q3",
        "number": 3,
        "question": "I want to change my major; what courses are left for me to take in my general education plan?"
      },
      {
        "id": "q4",
        "number": 4,
        "question": "How many credits do I still need to complete my degree?"
      },
      {
        "id": "q5",
        "number": 5,
        "question": "Will my transfer credits cover my core major requirements?"
      },
      {
        "id": "q6",
        "number": 6,
        "question": "What prerequisites do I need before I can enroll in my senior capstone class?"
      },
      {
        "id": "q7",
        "number": 7,
        "question": "Am I on track to graduate in four years with my current schedule?"
      },
      {
        "id": "q8",
        "number": 8,
        "question": "What happens to my graduation date if I drop a course this semester?"
      },
      {
        "id": "q9",
        "number": 9,
        "question": "Which remaining general education categories do I still need to fulfill?"
      },
      {
        "id": "q10",
        "number": 10,
        "question": "Who is my assigned academic advisor and how can I set up an appointment?"
      }
    ]
  }
];

window.AUGIE_ZION_SCHEMA = {
  "schemaStatus": "ZION_J1PRD_CONNECTOR_API_V1_0",
  "partner": "Zion Cloud Solutions",
  "institution": "Augustana University (Sioux Falls, SD)",
  "lastUpdated": "2026-10-30",
  "connectorApi": {
    "version": "1.0 (24 September 2026)",
    "baseUrl": "https://connector-api-385429559879.us-central1.run.app",
    "protocol": "HTTPS GET-only REST API returning JSON (Read-only; never writes to J1)",
    "dataSource": "Jenzabar J1 (J1PRD) over site-to-site VPN (Zero cached student data)",
    "hosting": "Google Cloud Run, us-central1, project fit-stream-495320-f6",
    "authLayers": [
      "Layer 1 (Google Cloud IAM): Authorization: Bearer <Google OIDC identity token> (requires roles/run.invoker)",
      "Layer 2 (Identity Headers): X-User-Id (<J1 ID_NUM>) and X-User-Role (student | advisor | advising_admin; resolved via GET /identity/resolve?email=...)"
    ],
    "criticalConventions": [
      "Terms use yr (4-digit academic year starting in autumn, so yr=2026&trm=SP is Spring 2027) and trm (FA, SP, SU, IN). Always call GET /terms/resolve?q=... first.",
      "Advisee routes (/advisors/me/advisees/{adviseeId}/...) verify advisor-advisee ownership in J1 and return 404 (not 403) if not owned.",
      "Degree Audit gotcha 1: credits_met covers only credit count; check incomplete_requirements and met ('not_met') before calling a program complete.",
      "Degree Audit gotcha 2: total_credits.met means earned >= needed (124), but if requirements_complete is false, the degree is NOT finished.",
      "Degree Audit gotcha 3: plan.available is always false ('AVStudentPlan not populated at AugU'). Use /students/me/recommend-next-term + /degree-progress instead.",
      "Privacy boundary: Connector API v1.0 does not read BIOGRAPH_MASTER, address/telephone tables, or free-text notes."
    ],
    "endpointCount": 26,
    "endpointGroups": {
      "catalog": [
        "GET /health",
        "GET /terms?yr=&limit=",
        "GET /terms/resolve?q=",
        "GET /catalog/courses?subject=&level=&active_only=true&limit=",
        "GET /catalog/sections?yr=&trm=&subject=&level=&open_only=true&min_seats=&limit=",
        "GET /catalog/section?yr=&trm=&crs="
      ],
      "identity": [
        "GET /identity/resolve?email=",
        "GET /me/profile"
      ],
      "student": [
        "GET /students/me/registration?yr=&trm=",
        "GET /students/me/holds",
        "GET /students/me/registration-window?yr=&trm=",
        "GET /students/me/gpa",
        "GET /students/me/schedule-conflicts?yr=&trm=&candidate=&candidates=",
        "GET /students/me/course-eligibility?yr=&trm=&crs=",
        "GET /students/me/recommend-next-term?yr=&trm=",
        "GET /students/me/degree-progress?detail=true&checklist=true&rules=true"
      ],
      "advisor": [
        "GET /advisors/me/caseload?yr=&trm=&status=unregistered",
        "GET /advisors/me/advisees/{adviseeId}/registration?yr=&trm=",
        "GET /advisors/me/advisees/{adviseeId}/holds",
        "GET /advisors/me/advisees/{adviseeId}/registration-window?yr=&trm=",
        "GET /advisors/me/advisees/{adviseeId}/gpa",
        "GET /advisors/me/advisees/{adviseeId}/schedule-conflicts?yr=&trm=&candidate=",
        "GET /advisors/me/advisees/{adviseeId}/course-eligibility?yr=&trm=&crs=",
        "GET /advisors/me/advisees/{adviseeId}/recommend-next-term?yr=&trm=",
        "GET /advisors/me/advisees/{adviseeId}/degree-progress?detail=true&checklist=true&rules=true"
      ],
      "administrator": [
        "GET /students/search?q=&limit=",
        "GET /advisors/me/caseload?yr=&trm=&scope=all&limit=&offset="
      ]
    }
  },
  "instructionsForTomorrow": "Mapped directly to Zion Cloud Solutions' Academic Advising Agent Connector API Reference v1.0 (26 GET endpoints over Jenzabar J1 `J1PRD`). Fields natively returned in v1.0 show their exact endpoint and JSON path; campus metrics requiring Phase 2 J1 queries or aggregation are tagged `[Phase 2 J1 Query]`.",
  "jargonGlossary": {
    "SOPHIA": {
      "term": "SOPHIA Plan (Core General Education — J1 `gen_ed.curriculum: Sophia Core`)",
      "plainLanguage": "Augustana University's general education curriculum required of all undergraduates (45 credits in J1 `audit.gen_ed.hrs_needed`, `aim_label: CORE`).",
      "i18n": {
        "es": "Plan SOPHIA (Educación General Básica — 45 créditos)",
        "zh": "SOPHIA 核心通识教育计划（45学分）",
        "ne": "SOPHIA सामान्य शिक्षा योजना (४५ क्रेडिट)",
        "am": "SOPHIA አጠቃላይ ትምህርት ዕቅድ (45 ክሬዲት)"
      }
    },
    "DFW Rate": {
      "term": "DFW Rate (Drop / Fail / Withdraw % & J1 `below_c_minus`)",
      "plainLanguage": "Percentage of enrolled students who earn a D, earn an F, or withdraw (W). In J1 `degree_rules.min_grade`, major courses require C- or better (`below_c_minus` triggers `retake_to_count`).",
      "i18n": {
        "es": "Tasa DFW (% de Baja, Reprobación o Retiro; mínimo C- en la especialidad)",
        "zh": "DFW 率（低分/不及格/退课比例；专业课要求 C- 及以上）",
        "ne": "DFW दर (ड्रप / फेल / फिर्ता प्रतिशत; प्रमुख विषयमा कम्तीमा C- आवश्यक)",
        "am": "DFW ምጣኔ (ያቋረጡ/የወደቁ ተማሪዎች መቶኛ)"
      }
    },
    "SAP": {
      "term": "SAP & Minimum Degree GPA (J1 `degree_rules.degree.min_cum_gpa: 2.0`)",
      "plainLanguage": "Federal and institutional requirement (`cum_gpa >= 2.0` in J1 `degree_rules.degree.cum_gpa_ok` plus credit completion pace) needed to maintain good standing and financial aid.",
      "i18n": {
        "es": "Progreso Académico Satisfactorio (Promedio mínimo 2.0 y ritmo de créditos)",
        "zh": "学业进展合格标准（累计 GPA 至少 2.0 及学分完成进度）",
        "ne": "सन्तोषजनक शैक्षिक प्रगति (न्युनतम २.० GPA र क्रेडिट प्रगति)",
        "am": "አጥጋቢ የትምህርት እድገት (የገንዘብ ድጋፍ መስፈርት)"
      }
    },
    "Hold": {
      "term": "Registration Hold (J1 `/students/me/holds` → `blocks_registration: H`)",
      "plainLanguage": "A restriction on your J1 account (`hold_cde`, `hold_desc`, `hold_type`) that blocks course registration (`blocks_registration: 'H'`) until cleared by the issuing office.",
      "i18n": {
        "es": "Retención de Matrícula (Bloqueo temporal para inscribir clases en J1)",
        "zh": "选课限制/冻结（J1 系统中阻止选课的账户限制）",
        "ne": "दर्ता रोक्का (कक्षा दर्ता गर्नुअघि हटाउनुपर्ने अवरोध)",
        "am": "የምዝገባ እገዳ (ኮርስ ከመመዝገብዎ በፊት መፈታት ያለበት)"
      }
    },
    "F-1 Full-Time Load": {
      "term": "F-1 International Full-Time Enrollment (12+ Credits in `registered_credits`)",
      "plainLanguage": "US SEVIS immigration rule requiring F-1 international undergraduate students to stay enrolled in at least 12 credits (`registered_credits >= 12`) each fall/spring semester unless authorized by the International Programs Office (IPO).",
      "i18n": {
        "es": "Carga Completa F-1 (Mínimo 12 créditos para visa internacional)",
        "zh": "F-1 国际学生全职学分要求（每学期至少 12 学分）",
        "ne": "F-1 अन्तर्राष्ट्रिय पूर्ण-समय क्रेडिट (कम्तीमा १२ क्रेडिट आवश्यक)",
        "am": "የF-1 ዓለም አቀፍ ተማሪ ሙሉ ጊዜ ትምህርት (ቢያንስ 12 ክሬዲት)"
      }
    },
    "Prerequisite Override": {
      "term": "Course Eligibility & Prerequisite Check (J1 `/course-eligibility` & `department_override`)",
      "plainLanguage": "J1's `/students/me/course-eligibility` checks whether prior courses are `met`, `not_met`, or `verify` (`missing[]`). Official permission from a department chair grants a prerequisite or `department_override`.",
      "i18n": {
        "es": "Elegibilidad y Exención de Prerrequisito (Verificación en J1)",
        "zh": "课程先修资格检查与豁免许可（J1 资格验证）",
        "ne": "पूर्वशर्त योग्यता र छुट अनुमति",
        "am": "የቅድመ-ሁኔታ ይሁንታ (ያለ ቅድመ ኮርስ ለመመዝገብ የሚሰጥ ፈቃድ)"
      }
    },
    "Residency Requirement": {
      "term": "Institutional Residency Requirement (J1 `degree_rules.residency.meets_50`)",
      "plainLanguage": "Tracked in J1 `degree_rules.residency` (`major_courses_total`, `at_augustana`, `transfer`, `pct_at_augustana`, `meets_50`): at least 50% of major courses must be taken directly at Augustana University.",
      "i18n": {
        "es": "Requisito de Residencia en Augustana (Mínimo 50% de cursos de la especialidad en Augustana)",
        "zh": "本校修读学分要求（至少 50% 专业课须在奥古斯塔纳大学修读）",
        "ne": "संस्थागत रेसिडेन्सी नियम (कम्तीमा ५०% प्रमुख विषय अगस्टानामा पढ्नुपर्ने)",
        "am": "በዩኒቨርሲቲው ውስጥ መወሰድ ያለባቸው ክሬዲቶች (ቢያንስ 50%)"
      }
    }
  },
  "fields": [
    {
      "hypotheticalField": "student_id",
      "zionOfficialField": "id_num / advisee_id",
      "zionTable": "GET /identity/resolve | GET /advisors/me/caseload (J1 ID_NUM)",
      "label": "J1 Student ID (ID_NUM)",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Jenzabar J1 unique student identifier (`id_num` / `advisee_id`, passed in `X-User-Id` or `/advisors/me/advisees/{adviseeId}`)."
    },
    {
      "hypotheticalField": "student_name",
      "zionOfficialField": "name / display_name / advisee_name",
      "zionTable": "GET /me/profile | GET /advisors/me/caseload | GET /students/search",
      "label": "Student Name",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Student's display name (`first_name`, `last_name`, `name`, `display_name`, or `advisee_name`)."
    },
    {
      "hypotheticalField": "academic_unit",
      "zionOfficialField": "courses[].school / courses[].division",
      "zionTable": "GET /catalog/courses (e.g., school='CAS', division='UG')",
      "label": "School / Division",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Augustana School or Division code in J1 course catalog (`school`, `division`)."
    },
    {
      "hypotheticalField": "department",
      "zionOfficialField": "subject / degree_rules.department_override",
      "zionTable": "GET /catalog/courses?subject= | GET /students/me/degree-progress?rules=true",
      "label": "Subject / Department Code",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Academic department / subject prefix (e.g., `BIOL`, `AMSL`, `COSC`, `MUSI`)."
    },
    {
      "hypotheticalField": "major_program",
      "zionOfficialField": "declared.major / declared.concentration / audit.programs[].code",
      "zionTable": "GET /students/me/degree-progress (declared + audit.programs[])",
      "label": "Declared Major / Concentration",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Declared J1 degree (`degree_code`), `major`, `major_2`, `concentration`, `catalog_year`, and `expected_grad_year`."
    },
    {
      "hypotheticalField": "assigned_advisor",
      "zionOfficialField": "X-User-Id (advisor) / ADVISING_ACCESS [Ownership Checked in J1]",
      "zionTable": "GET /advisors/me/caseload (J1 advisor-advisee relationship check)",
      "label": "Assigned J1 Advisor & Ownership",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Verified in J1 before reading `/advisors/me/advisees/{adviseeId}/...`; returns 404 if advisor does not own advisee."
    },
    {
      "hypotheticalField": "credits_completed",
      "zionOfficialField": "audit.total_credits.earned / audit.total_credits.needed (124)",
      "zionTable": "GET /students/me/degree-progress (audit.total_credits)",
      "label": "Earned Credits (of 124) & requirements_complete",
      "dataType": "number",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 `audit.total_credits.earned` vs `needed` (124). Note: Check `requirements_complete` (not just `total_credits.met`) to confirm degree completion."
    },
    {
      "hypotheticalField": "current_term_credits",
      "zionOfficialField": "advisees[].registered_credits / registration[].credit_hrs",
      "zionTable": "GET /advisors/me/caseload | GET /students/me/registration?yr=&trm=",
      "label": "Registered Term Credits & Count",
      "dataType": "number",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Current term enrolled credits (`registered_credits` and `registered_count`; 12+ required for full-time & F-1 status)."
    },
    {
      "hypotheticalField": "sophia_gen_ed_status",
      "zionOfficialField": "audit.gen_ed.met / audit.gen_ed.hrs_earned / hrs_needed (45)",
      "zionTable": "GET /students/me/degree-progress (audit.gen_ed curriculum='Sophia Core')",
      "label": "Sophia Core Gen-Ed Status (aim_label='CORE')",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 `audit.gen_ed` tracking `curriculum: 'Sophia Core'`, `met` (`met` | `not_met`), `hrs_earned`, and `hrs_needed` (45)."
    },
    {
      "hypotheticalField": "registration_holds",
      "zionOfficialField": "holds[].hold_cde / hold_desc / blocks_registration / active_holds",
      "zionTable": "GET /students/me/holds | GET /advisors/me/caseload",
      "label": "Active J1 Holds (hold_cde & blocks_registration)",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 holds array (`hold_cde`, `hold_desc`, `hold_type`, `display_text`, `blocks_registration: 'H'`, `allow_web_reg`) and caseload `active_holds` count."
    },
    {
      "hypotheticalField": "academic_standing",
      "zionOfficialField": "cumulative_gpa / institution_gpa / degree_rules.degree.cum_gpa_ok",
      "zionTable": "GET /students/me/gpa | GET /students/me/degree-progress?rules=true",
      "label": "Cumulative & Area GPA (min_cum_gpa: 2.0)",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 `cumulative_gpa`, `institution_gpa`, `transfer_gpa`, `by_area[].gpa`, and `degree_rules.degree.cum_gpa_ok` (`min_cum_gpa: 2.0`)."
    },
    {
      "hypotheticalField": "early_warning_flags",
      "zionOfficialField": "degree_rules.min_grade.below_c_minus[] / retake.repeated_courses",
      "zionTable": "GET /students/me/degree-progress?rules=true (degree_rules.min_grade & retake)",
      "label": "Major Courses Below C- & Retake Flags",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 `degree_rules.min_grade.below_c_minus[]` (`course`, `grade`, `action: 'retake_to_count'`) and `retake` policy (`university` vs `nursing` caps)."
    },
    {
      "hypotheticalField": "course_eligibility_prereq",
      "zionOfficialField": "status ('met'|'not_met'|'verify') / missing[] / prerequisites_raw",
      "zionTable": "GET /students/me/course-eligibility?yr=&trm=&crs=",
      "label": "Advisory Prerequisite Eligibility",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 advisory prerequisite check returning `status` (`met`, `not_met`, `verify`), `missing[]`, and `already_completed.taken`."
    },
    {
      "hypotheticalField": "section_seats_capacity",
      "zionOfficialField": "sections[].capacity / enrolled / seats_left / waitlisted / status",
      "zionTable": "GET /catalog/sections?yr=&trm= | GET /catalog/section?yr=&trm=&crs=",
      "label": "Section Seat Capacity & Waitlist",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Live J1 section enrollment (`capacity`, `enrolled`, `seats_left`, `waitlisted`, `credit_hrs`, `instructor`, `status`)."
    },
    {
      "hypotheticalField": "registration_window_status",
      "zionOfficialField": "windows[].group_name / add_open_now / drop_open_now / requires_clearance",
      "zionTable": "GET /students/me/registration-window?yr=&trm=",
      "label": "Registration Window & Clearance Flags",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "J1 registration group (`group_code`, `group_name`), `add_begin`/`add_end`, `add_open_now`, `requires_clearance`, and `requires_advisor_approval`."
    },
    {
      "hypotheticalField": "residency_rule_status",
      "zionOfficialField": "degree_rules.residency.meets_50 / at_augustana / pct_at_augustana",
      "zionTable": "GET /students/me/degree-progress?rules=true (degree_rules.residency)",
      "label": "Augustana 50% Major Residency Check",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Tracks `major_courses_total`, `at_augustana`, `transfer`, `pct_at_augustana`, and `meets_50` boolean."
    },
    {
      "hypotheticalField": "visa_international_status",
      "zionOfficialField": "registered_credits >= 12 + [Phase 2 J1 BIOGRAPH/SEVIS Flag]",
      "zionTable": "GET /students/me/registration (credit_hrs sum) + Phase 2 SEVIS Flag",
      "label": "International / F-1 12-Credit Guardrail",
      "dataType": "badge",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Computes live credit load from `/students/me/registration` (`registered_credits >= 12`); note Connector v1.0 does not read `BIOGRAPH_MASTER`."
    },
    {
      "hypotheticalField": "accessibility_accommodations",
      "zionOfficialField": "UI Client Preference + [Phase 2 Student Support Flag]",
      "zionTable": "A2UI Client Preferences (BIOGRAPH_MASTER / free-text notes excluded in v1.0)",
      "label": "Accessibility & Modality Prefs",
      "dataType": "string",
      "minRbacLevel": 10,
      "plainLanguageDescription": "Screen-reader compatibility, ASL/captioning, high-contrast AAA, and multilingual glossary preferences."
    }
  ]
};

window.AUGIE_MOCK_DATA = {
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
};
