/**
 * Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
 * Interactive A2UI + ADK 2-Hour Hackathon Workbench Controller
 */

(function () {
  const personas = window.AUGIE_AAA_PERSONAS || [];
  const zionSchema = window.AUGIE_ZION_SCHEMA || { fields: [], jargonGlossary: {} };
  const baseViews = window.AUGIE_DEFAULT_A2UI_VIEWS || {};

  // Working copy of A2UI views per persona (persisted in sessionStorage during the hackathon sprint)
  const customViews = {};
  personas.forEach((p) => {
    const saved = sessionStorage.getItem(`augie_a2ui_view_${p.id}`);
    if (saved && p.id !== "student") {
      try {
        customViews[p.id] = JSON.parse(saved);
        return;
      } catch (e) {
        // fallback to default
      }
    }
    customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id] || {}));
  });
  // Clear any stale cached student_q1 / student_q2 views so the latest builds always render fresh
  try {
    sessionStorage.removeItem("augie_a2ui_view_student");
    sessionStorage.removeItem("augie_a2ui_view_student_q1");
    sessionStorage.removeItem("augie_a2ui_view_student_q2");
  } catch (e) {}

  const PERSONA_RECOMMENDED_LAYOUT = {
    admin: "inverted-pyramid",
    provost: "inverted-pyramid",
    registrar: "table-first",
    student_success: "table-first",
    deans: "split-dashboard",
    area_chair: "split-dashboard",
    program_director: "split-dashboard",
    department_chair: "table-first",
    advisor: "split-dashboard",
    student: "inverted-pyramid"
  };

  const state = {
    activePersonaId: personas[0]?.id || "admin",
    activeQuestionIdx: 0,
    activeTab: "surface", // 'surface' | 'visual-builder' | 'json-editor' | 'a11y-audit' | 'hackathon-guide'
    layoutMode: PERSONA_RECOMMENDED_LAYOUT[personas[0]?.id || "admin"] || "inverted-pyramid",
    highContrast: false,
    textScale: "100", // '100' | '125' | '150'
    wideSpacing: false,
    showGlossary: false,
    showZionCodes: true,
    lang: "en", // 'en' | 'es' | 'zh' | 'ne' | 'am'
    sortState: {}
  };

  function getActivePersona() {
    return personas.find((p) => p.id === state.activePersonaId) || personas[0];
  }

  function getActiveQuestion() {
    const p = getActivePersona();
    return (p?.questions || [])[state.activeQuestionIdx] || p?.questions?.[0] || null;
  }

  function getActiveViewKey() {
    const q = getActiveQuestion();
    return `${state.activePersonaId}_q${q?.number || 1}`;
  }

  function getActivePayload() {
    const key = getActiveViewKey();
    if (customViews[key]) {
      return customViews[key];
    }
    const p = getActivePersona();
    const q = getActiveQuestion();
    const base = baseViews[state.activePersonaId] || customViews[state.activePersonaId] || {};
    if (window.AUGIE_QUESTION_VIEW_ADAPTER) {
      const adapted = window.AUGIE_QUESTION_VIEW_ADAPTER.adaptPayloadForQuestion(base, p, q);
      customViews[key] = adapted.payload;
      return customViews[key];
    }
    return base;
  }

  function saveActivePayload(newPayload) {
    const key = getActiveViewKey();
    const q = getActiveQuestion();
    customViews[key] = newPayload;
    if ((q?.number || 1) === 1) {
      customViews[state.activePersonaId] = newPayload;
    }
    try {
      sessionStorage.setItem(`augie_a2ui_view_${key}`, JSON.stringify(newPayload));
    } catch (e) {
      // ignore storage quota errors
    }
  }

  function announcePolite(message) {
    const region = document.getElementById("a11y-live-announcer");
    if (region) {
      region.textContent = message;
    }
  }

  function showToast(title, detail) {
    const toast = document.getElementById("workbench-toast");
    if (!toast) return;
    toast.innerHTML = `
      <div style="font-weight:800; margin-bottom:0.25rem; color:var(--augie-gold);">${title}</div>
      <div style="font-size:0.86rem;">${detail}</div>
    `;
    toast.hidden = false;
    announcePolite(`${title}. ${detail}`);
    clearTimeout(window.__augieToastTimer);
    window.__augieToastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 5200);
  }

  function renderPersonaPills() {
    const container = document.getElementById("persona-pills-container");
    if (!container) return;
    container.innerHTML = personas
      .map((p) => {
        const isSel = p.id === state.activePersonaId;
        return `
          <button
            type="button"
            role="tab"
            class="persona-pill-btn"
            aria-selected="${isSel ? "true" : "false"}"
            data-persona-id="${p.id}"
          >
            <span class="persona-pill-meta">
              <span class="persona-pill-role">${p.order}. ${p.role}</span>
              <span class="persona-pill-scope">${p.advisingScope}</span>
            </span>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll(".persona-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-persona-id");
        state.activePersonaId = pid;
        state.activeQuestionIdx = 0;
        state.layoutMode = PERSONA_RECOMMENDED_LAYOUT[pid] || "inverted-pyramid";
        const layoutSel = document.getElementById("sel-layout-mode");
        if (layoutSel) layoutSel.value = state.layoutMode;
        const p = getActivePersona();
        announcePolite(
          `Switched persona to ${p.role}. Advising scope: ${p.advisingScope}. Auto-selected AI best-practice layout: ${state.layoutMode}.`
        );
        renderAll();
      });
    });
  }

  function renderSidebar() {
    const p = getActivePersona();
    if (!p) return;

    const titleEl = document.getElementById("sidebar-persona-title");
    const scopeEl = document.getElementById("sidebar-persona-scope");
    const unitEl = document.getElementById("sidebar-persona-unit");
    const promptEl = document.getElementById("sidebar-persona-prompt");
    const rosterEl = document.getElementById("sidebar-persona-roster");
    const qListEl = document.getElementById("sidebar-questions-list");

    if (titleEl) titleEl.innerHTML = `<span>${p.role}</span>`;
    if (scopeEl) scopeEl.textContent = `Advising Scope: ${p.advisingScope}`;
    if (unitEl) unitEl.innerHTML = `${p.defaultUnit}<br>Google Group: ${p.googleGroupId}`;
    if (promptEl) promptEl.textContent = p.systemPrompt;

    if (rosterEl) {
      if (p.associatedUsers && p.associatedUsers.length > 0) {
        rosterEl.innerHTML = `
          <details class="persona-roster-details">
            <summary>Associated @augie.edu Stakeholders (${p.associatedUsers.length})</summary>
            <ul class="roster-list">
              ${p.associatedUsers
                .map((u) => `<li><strong>${u.name}</strong> ${u.email ? `(<a href="mailto:${u.email}">${u.email}</a>)` : ""}</li>`)
                .join("")}
            </ul>
          </details>
        `;
      } else {
        rosterEl.innerHTML = `<div style="margin-top:0.5rem; font-size:0.8rem; color:var(--text-muted);">Assigned dynamically via Google Workspace Group / Banner / Zion SIS Role.</div>`;
      }
    }

    if (qListEl) {
      qListEl.innerHTML = (p.questions || [])
        .map((q, idx) => {
          const isCurr = idx === state.activeQuestionIdx;
          return `
            <button
              type="button"
              class="question-btn"
              aria-current="${isCurr ? "true" : "false"}"
              data-q-idx="${idx}"
            >
              <span class="q-num-badge">Q${q.number}</span>
              <span>${q.question}</span>
            </button>
          `;
        })
        .join("");

      qListEl.querySelectorAll(".question-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-q-idx"));
          state.activeQuestionIdx = idx;
          const p = getActivePersona();
          const q = getActiveQuestion();
          if (window.AUGIE_QUESTION_VIEW_ADAPTER && q) {
            const bp = window.AUGIE_QUESTION_VIEW_ADAPTER.inferQuestionBlueprint(p, q);
            if (bp && bp.layout) {
              state.layoutMode = bp.layout;
              const layoutSel = document.getElementById("sel-layout-mode");
              if (layoutSel) layoutSel.value = state.layoutMode;
            }
          }
          announcePolite(
            `Selected Question ${q.number}: ${q.question}. Auto-configured AI best-practice layout (${state.layoutMode}) and question-specific table view.`
          );
          renderAll();
        });
      });
    }
  }

  function renderWorkspaceTabs() {
    document.querySelectorAll(".ws-tab-btn").forEach((btn) => {
      const tab = btn.getAttribute("data-ws-tab");
      btn.setAttribute("aria-selected", tab === state.activeTab ? "true" : "false");
    });

    const panes = ["surface", "visual-builder", "json-editor", "a11y-audit", "hackathon-guide"];
    panes.forEach((paneId) => {
      const el = document.getElementById(`pane-${paneId}`);
      if (el) {
        el.hidden = paneId !== state.activeTab;
      }
    });
  }

  function renderMainSurface() {
    const surfaceContainer = document.getElementById("a2ui-live-canvas");
    if (!surfaceContainer) return;

    const p = getActivePersona();
    const q = getActiveQuestion();
    const payload = getActivePayload();

    window.AugieA2UIRenderer.renderA2UISurface(surfaceContainer, payload, {
      persona: p,
      activeQuestion: q,
      zionSchema,
      lang: state.lang,
      showGlossary: state.showGlossary,
      showZionCodes: state.showZionCodes,
      layoutMode: state.layoutMode,
      sortState: state.sortState,
      onSortChange: (tableId, colKey) => {
        const prev = state.sortState[tableId];
        const nextDir = prev && prev.key === colKey && prev.dir === "asc" ? "desc" : "asc";
        state.sortState[tableId] = { key: colKey, dir: nextDir };
        announcePolite(`Sorted table by ${colKey} ${nextDir === "asc" ? "ascending" : "descending"}.`);
        renderMainSurface();
      },
      onAction: (evt) => {
        if (evt.type === "prioritySliceChange") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          dataModel.activePriorityMode = evt.modeId;
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];
          const slot1300 = slots.find((s) => s.slotId === "13:00");
          const slot0930 = slots.find((s) => s.slotId === "09:30");

          if (evt.modeId === "heavy_major_minor") {
            if (slot1300) slot1300.selectedValue = "DATA 340";
            if (slot0930) slot0930.selectedValue = "MATH 310";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 2: Heavy Major & Minor Push + Parallel SOPHIA",
              totalCredits: "15 Credits (4 Courses)",
              f1Status: "15 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
              {
                slotId: "09:30",
                days: "TR",
                course: "MATH 310",
                title: "Linear Algebra",
                bucket: "Major Core"
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
            ];
          } else if (evt.modeId === "sophia_electives_mix") {
            if (slot1300) slot1300.selectedValue = "ART 140";
            if (slot0930) slot0930.selectedValue = "COSC 315";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 3: Finish Remaining SOPHIA + Studio & Career Electives",
              totalCredits: "14 Credits (4 Courses)",
              f1Status: "14 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
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
                course: "ART 140",
                title: "Studio Ceramics",
                bucket: "Elective"
              },
              {
                slotId: "13:30",
                days: "TR",
                course: "RELI 218",
                title: "Global Christianities",
                bucket: "SOPHIA"
              }
            ];
          } else {
            if (slot1300) slot1300.selectedValue = "DATA 340";
            if (slot0930) slot0930.selectedValue = "COSC 315";
            dataModel.scheduleSummary = {
              sliceLabel: "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective",
              totalCredits: "14 Credits (4 Courses)",
              f1Status: "14 Credits (Meets 12-Credit Full-Time Minimum)"
            };
            dataModel.calendarEvents = [
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
            ];
          }

          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          showToast(
            `Updated Semester Mix`,
            `Step 1 Pillars, Step 2 Dropdowns, and Step 3 Calendar updated.`
          );
          return;
        }

        if (evt.type === "slotDropdownChange") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];
          const targetSlot = slots.find((s) => s.slotId === evt.slotId);
          if (targetSlot) {
            targetSlot.selectedValue = evt.chosenCourse;
            const chosenOpt = (targetSlot.options || []).find((o) => o.value === evt.chosenCourse);
            const events = Array.isArray(dataModel.calendarEvents) ? dataModel.calendarEvents : [];
            const calEv = events.find((e) => e.slotId === evt.slotId);
            if (calEv && chosenOpt) {
              calEv.course = chosenOpt.course;
              calEv.title = chosenOpt.title;
              calEv.bucket = chosenOpt.bucket;
            }
          }
          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          showToast(
            `Updated Time Slot (${evt.chosenCourse})`,
            `Updated downstream trade-off and Step 3 Monday–Friday Calendar.`
          );
          return;
        }

        if (evt.type === "gradPathwayChange") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          dataModel.activeGradPathwayId = evt.pathwayId;
          const kpiComp = (payload?.surfaceUpdate?.components || []).find(
            (c) => c.component && c.component.KPIStatRow
          );
          if (kpiComp && Array.isArray(kpiComp.component.KPIStatRow.items)) {
            const termKpi = kpiComp.component.KPIStatRow.items[0];
            if (termKpi) {
              if (evt.pathwayId === "accelerate_dec_2027") {
                termKpi.value = "Dec 2027";
                termKpi.trend = "Accelerated (1 Semester Early via J-Term + Summer)";
              } else if (evt.pathwayId === "explore_majors_minors") {
                termKpi.value = "May 2028";
                termKpi.trend = "On Time + Added Minor / Double Major Credential";
              } else if (evt.pathwayId === "experiential_internship_abroad") {
                termKpi.value = "May 2028";
                termKpi.trend = "On Time + Sioux Falls Industry Internship";
              } else {
                termKpi.value = "May 2028";
                termKpi.trend = "3 Semesters Left · Can Accelerate to Dec 2027";
              }
            }
          }
          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          const chosenPw = (dataModel.gradPathways || []).find((p) => p.id === evt.pathwayId);
          showToast(
            `Updated Graduation Pathway`,
            chosenPw ? `${chosenPw.buttonLabel} (${chosenPw.graduationDate})` : `Switched graduation pathway.`
          );
          return;
        }

        if (evt.type === "exploreProgramSimulate") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          dataModel.activeGradPathwayId = "explore_majors_minors";
          const explorePw = (dataModel.gradPathways || []).find((p) => p.id === "explore_majors_minors");
          const opt = (dataModel.explorationOptions || []).find((o) => o.id === evt.programId);
          if (explorePw && opt) {
            explorePw.highlightedExplorationId = opt.id;
            explorePw.graduationDate = `May 2028 (With ${opt.title})`;
            explorePw.guidanceSummary = `${opt.fitExplanation} Your term-by-term roadmap below has been updated to include the required courses for ${opt.title} while keeping your May 2028 graduation date intact.`;
            if (opt.id === "studio_art_minor") {
              explorePw.terms = [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Completes Data Science Capstone + SOPHIA + Studio Art Minor Course 1",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "ART 140 — Studio Ceramics (4 Cr · Studio Art Minor Course 1 of 3)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Career Elective)"
                  ]
                },
                {
                  termName: "Fall 2027 (Studio Art & Core Semester)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Completes Data Science Major Core, Math Minor, and Studio Art Minor Course 2",
                  courses: [
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "MATH 310 — Linear Algebra (4 Cr · Completes Mathematics Minor)",
                    "ART 180 — Digital Design & Visual Communication (4 Cr · Studio Art Minor Course 2 of 3)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Graduate With Studio Art Minor)",
                  creditsLabel: "6–12 Credits (118 -> 124 of 124 Credits)",
                  milestoneNote: "Completes Studio Art Minor Course 3 and reaches 124 credits on schedule",
                  courses: [
                    "ART 240 — Intermediate Ceramic Sculpture (4 Cr · Completes Studio Art Minor)",
                    "MUSI 118 — History of Jazz (2 Cr · Reaches 124.0 Credits for May 2028 Commencement)"
                  ]
                }
              ];
            } else if (opt.id === "ai_ethics_cert") {
              explorePw.terms = [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Completes Data Science Capstone + ML + AI Ethics Certificate Course 1",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · AI Ethics Track)"
                  ]
                },
                {
                  termName: "Fall 2027 (AI Ethics & Sioux Falls Internship Semester)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Completes AI Ethics Certificate, Industry Internship, and Mathematics Minor",
                  courses: [
                    "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · Completes AI Ethics Certificate)",
                    "COSC 495 — Sioux Falls Industry Data Science Internship (4 Cr · Experiential Practicum)",
                    "MATH 310 — Linear Algebra (4 Cr · Completes Mathematics Minor)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Creative Exploration Finish)",
                  creditsLabel: "6–12 Credits (118 -> 124 of 124 Credits)",
                  milestoneNote: "6 open credits remaining to reach 124.0 total graduation credits",
                  courses: [
                    "ART 140 — Studio Ceramics (4 Cr · Open Creative Elective)",
                    "MUSI 118 — History of Jazz (2 Cr · Reaches 124.0 Credits for May 2028 Commencement)"
                  ]
                }
              ];
            } else {
              explorePw.terms = [
                {
                  termName: "Spring 2027 (Upcoming Semester)",
                  creditsLabel: "14 Credits (92 -> 106 of 124 Credits)",
                  milestoneNote: "Completes Data Science Capstone, Applied ML, and Final SOPHIA Requirement",
                  courses: [
                    "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)",
                    "DATA 340 — Applied Machine Learning (4 Cr · Major Core)",
                    "RELI 218 — Global Christianities (4 Cr · Completes Final SOPHIA Requirement)",
                    "COSC 315 — Accessible Human-Computer Interaction (2 Cr · Career Elective)"
                  ]
                },
                {
                  termName: "Fall 2027 (Mathematics Double Major Expansion)",
                  creditsLabel: "12 Credits (106 -> 118 of 124 Credits)",
                  milestoneNote: "Advances from Mathematics Minor toward full Mathematics Second Major",
                  courses: [
                    "MATH 310 — Linear Algebra (4 Cr · Math Double Major Core)",
                    "MATH 320 — Probability & Mathematical Statistics (4 Cr · Math Double Major Core)",
                    "PHIL 230 — Ethics of Artificial Intelligence & Data (4 Cr · Elective)"
                  ]
                },
                {
                  termName: "Spring 2028 (Final Semester — Graduate With Double Major)",
                  creditsLabel: "6–12 Credits (118 -> 124 of 124 Credits)",
                  milestoneNote: "Completes Mathematics Double Major and reaches 124.0 credits on time",
                  courses: [
                    "MATH 410 — Real Analysis (4 Cr · Completes Mathematics Double Major)",
                    "MUSI 118 — History of Jazz (2 Cr · Reaches 124.0 Credits for May 2028 Commencement)"
                  ]
                }
              ];
            }
          }
          saveActivePayload(payload);
          renderMainSurface();
          renderJsonEditor();
          showToast(
            `Simulated Adding ${opt?.shortButtonLabel || "Credential"}`,
            `Updated your May 2028 Term-by-Term Roadmap using your 16 open credits.`
          );
          return;
        }

        if (evt.type === "inspectCourse") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const detailsMap = dataModel.courseCatalogDetails || {};
          const info = detailsMap[evt.courseCode];
          const drawer = document.getElementById("course-detail-drawer");
          const titleEl = document.getElementById("course-drawer-title");
          const bodyEl = document.getElementById("course-drawer-body");
          if (drawer && titleEl && bodyEl && info) {
            const syllabusItems = info.syllabusHighlights || info.syllabusOutline || [];
            titleEl.textContent = `${info.code} — ${info.title}`;
            bodyEl.innerHTML = `
              <div class="course-drawer-meta-grid">
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Curriculum Pillar</span>
                  <strong>${info.pillar}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Credits</span>
                  <strong>${info.credits}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Instructor</span>
                  <strong>${info.instructor}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Meeting Time & Room</span>
                  <strong>${info.schedule}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Live J1 Seat Availability</span>
                  <strong>${info.seats}</strong>
                </div>
                <div class="course-drawer-meta-item">
                  <span class="course-drawer-meta-label">Prerequisites</span>
                  <strong>${info.prerequisites}</strong>
                </div>
              </div>

              <div class="course-drawer-section">
                <h4>Course Catalog Description</h4>
                <p>${info.description}</p>
              </div>

              <div class="course-drawer-section">
                <h4>Course Syllabus Outline</h4>
                <ul class="course-drawer-syllabus-list">
                  ${syllabusItems.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>

              <div class="course-drawer-actions">
                <a href="${info.syllabusUrl}" target="_blank" rel="noopener" class="btn-augie-primary" id="btn-open-syllabus-doc">
                  Open / Download ${info.code} Syllabus (PDF Preview)
                </a>
              </div>
            `;
            drawer.hidden = false;
            const openBtn = document.getElementById("btn-open-syllabus-doc");
            openBtn?.addEventListener("click", (e) => {
              e.preventDefault();
              const syllabusHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${info.code} — ${info.title} Syllabus</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #081E3F; max-width: 760px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; }
    header { border-bottom: 4px solid #FED102; background: #081E3F; color: #fff; padding: 1.25rem 1.5rem; border-radius: 8px; }
    h1 { margin: 0 0 0.35rem; font-size: 1.35rem; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; background: #f8fafc; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; margin: 1.25rem 0; font-size: 0.92rem; }
    h2 { color: #081E3F; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 1.5rem; font-size: 1.1rem; }
  </style>
</head>
<body>
  <header>
    <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:#FED102; font-weight:700;">Augustana University — Sioux Falls, SD</div>
    <h1>${info.code}: ${info.title} (${info.credits})</h1>
    <div>Official Course Syllabus</div>
  </header>
  <div class="meta">
    <div><strong>Instructor:</strong> ${info.instructor}</div>
    <div><strong>Meeting Time & Location:</strong> ${info.schedule}</div>
    <div><strong>Curriculum Requirement:</strong> ${info.pillar}</div>
    <div><strong>Prerequisites:</strong> ${info.prerequisites}</div>
  </div>
  <h2>Course Description</h2>
  <p>${info.description}</p>
  <h2>Weekly Module Outline</h2>
  <ul>
    ${syllabusItems.map((item) => `<li>${item}</li>`).join("")}
  </ul>
</body>
</html>`;
              const blob = new Blob([syllabusHtml], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            });
            announcePolite(`Opened course detail side panel for ${info.code}: ${info.title}.`);
          } else {
            showToast(`Course Details: ${evt.courseCode}`, `No extended catalog record found for ${evt.courseCode}.`);
          }
          return;
        }

        if (evt.type === "exportDataTableToSheets") {
          const comps = payload?.surfaceUpdate?.components || [];
          const found =
            comps.find((c) => c.id === evt.tableNodeId && c.component?.DataTable) ||
            comps.find((c) => c.component?.DataTable);
          const table = found?.component?.DataTable;
          if (table) {
            const dataModel = payload?.dataModelUpdate?.contents || {};
            const rowsKey = (table.rowsPath || "").replace(/^\//, "");
            const rows = Array.isArray(dataModel[rowsKey]) ? dataModel[rowsKey] : [];
            const cols = table.columns || [];
            const headers = cols.map((c) => c.label);
            const matrix = [
              headers,
              ...rows.map((r) => cols.map((c) => String(r[c.key] ?? "")))
            ];
            const csvText =
              "\uFEFF" +
              matrix
                .map((row) =>
                  row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
                )
                .join("\r\n");
            const tsvText = matrix
              .map((row) => row.map((cell) => String(cell).replace(/[\t\r\n]+/g, " ")).join("\t"))
              .join("\n");

            navigator.clipboard?.writeText(tsvText).catch(() => {});

            if (evt.exportMode === "sheets_new") {
              window.open("https://sheets.new", "_blank", "noopener");
              showToast(
                "Copied Table & Opened Google Sheets (sheets.new)",
                `Copied ${rows.length} rows to your clipboard — press Cmd+V (or Ctrl+V) in cell A1 of the new Google Sheet!`
              );
            } else {
              const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Augustana_AAA_${p.id}_Q${q?.number || 1}_Google_Sheets.csv`;
              a.click();
              URL.revokeObjectURL(url);
              showToast(
                "Exported to Google Sheets (.csv)",
                `Downloaded Augustana_AAA_${p.id}_Q${q?.number || 1}_Google_Sheets.csv (and copied rows to clipboard for pasting into Google Sheets).`
              );
            }
          }
          return;
        }

        if (evt.type === "exportSchedule") {
          const dataModel = payload?.dataModelUpdate?.contents || {};
          const detailsMap = dataModel.courseCatalogDetails || {};

          // Check if we are exporting Student Q2 (Multi-Term Graduation Roadmap)
          if (Array.isArray(dataModel.gradPathways) && dataModel.gradPathways.length > 0) {
            const activePw =
              dataModel.gradPathways.find((p) => p.id === dataModel.activeGradPathwayId) || dataModel.gradPathways[0];
            const matrix = [
              [
                "Semester",
                "Course Number",
                "Course Name",
                "Credits",
                "Requirement / Pillar",
                "Cumulative Credits (of 124)",
                "Target Graduation"
              ]
            ];

            let runningCredits = 92;
            let plannedCreditsTotal = 0;

            (activePw.terms || []).forEach((t) => {
              const cleanTerm = String(t.termName || "").replace(/\s*\(.*?\)\s*/g, "").trim() || t.termName;
              (t.courses || []).forEach((c) => {
                // Parse "COSC 450 — Data Science Senior Capstone (4 Cr · Major Required)" into clean columns
                const codeMatch = String(c).match(/^([A-Z]{3,4}\s+\d{3})\s*[—-]\s*([^(]+?)(?:\s*\((.+)\))?$/);
                const courseCode = codeMatch ? codeMatch[1].trim() : c;
                const courseTitle = codeMatch ? codeMatch[2].trim() : (detailsMap[courseCode]?.title || "");
                const parenText = codeMatch && codeMatch[3] ? codeMatch[3] : "";
                const crMatch = parenText.match(/(\d+)\s*Cr/i) || String(detailsMap[courseCode]?.credits || "4").match(/(\d+)/);
                const creditNum = crMatch ? Number(crMatch[1]) : 4;
                const reqPart = parenText.includes("·")
                  ? parenText.split("·").slice(1).join("·").trim()
                  : detailsMap[courseCode]?.pillar || "Degree Requirement";

                runningCredits += creditNum;
                plannedCreditsTotal += creditNum;

                matrix.push([
                  cleanTerm,
                  courseCode,
                  courseTitle,
                  creditNum,
                  reqPart,
                  `${runningCredits} of 124`,
                  activePw.graduationDate || "May 2028"
                ]);
              });
            });

            matrix.push([
              "TOTAL PLANNED",
              `${matrix.length - 1} Courses`,
              `92 Earned + ${plannedCreditsTotal} Planned = ${runningCredits} Total Credits`,
              plannedCreditsTotal,
              activePw.buttonLabel || "",
              `${runningCredits} of 124`,
              activePw.graduationDate || "May 2028"
            ]);

            const csvText =
              "\uFEFF" +
              matrix
                .map((row) =>
                  row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
                )
                .join("\r\n");
            const tsvText = matrix
              .map((row) => row.map((cell) => String(cell ?? "").replace(/[\t\r\n]+/g, " ")).join("\t"))
              .join("\n");

            if (evt.exportAction === "download_plan") {
              navigator.clipboard?.writeText(tsvText).catch(() => {});
              const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "Augustana_Graduation_Roadmap_Amina_Tesfaye.csv";
              a.click();
              URL.revokeObjectURL(url);
              showToast(
                "Exported Clean Table to Google Sheets (.csv)",
                "Downloaded Augustana_Graduation_Roadmap_Amina_Tesfaye.csv (and copied clean spreadsheet rows to clipboard)."
              );
            } else if (evt.exportAction === "open_sheets_new") {
              navigator.clipboard?.writeText(tsvText).catch(() => {});
              window.open("https://sheets.new", "_blank", "noopener");
              showToast(
                "Copied Clean Table & Opened Google Sheets",
                "Press Cmd+V (or Ctrl+V) in cell A1 of your new Google Sheet!"
              );
            } else if (evt.exportAction === "email_advisor") {
              const termLines = (activePw.terms || [])
                .map((t) => `${t.termName} (${t.creditsLabel}):\n  - ${(t.courses || []).join("\n  - ")}`)
                .join("\n\n");
              const subject = encodeURIComponent(
                `Graduation Timeline Review (${activePw.graduationDate}) — Amina Tesfaye`
              );
              const body = encodeURIComponent(
                `Dear Dr. Matthewulat,\n\nI explored my multi-term graduation timeline in the Augustana Academic Advising Agent and would like to review this pathway with you:\n\nSelected Pathway: ${activePw.buttonLabel}\nTarget Graduation Date: ${activePw.graduationDate}\n\nTerm-by-Term Plan:\n${termLines}\n\nThank you,\nAmina Tesfaye`
              );
              window.location.href = `mailto:m.matthewulat@augie.edu?subject=${subject}&body=${body}`;
              showToast(
                "Graduation Plan Email Prepared",
                "Opened email client with your multi-term graduation roadmap for Dr. Matthewulat."
              );
            }
            return;
          }

          const summary = dataModel.scheduleSummary || {};
          const events = Array.isArray(dataModel.calendarEvents) ? dataModel.calendarEvents : [];
          const slots = Array.isArray(dataModel.contestableSlots) ? dataModel.contestableSlots : [];

          const matrix = [
            [
              "Semester",
              "Course Number",
              "Course Name",
              "Credits",
              "Requirement / Pillar",
              "Meeting Days & Time",
              "Location",
              "Instructor",
              "Downstream Trade-Off / Note"
            ]
          ];

          let totalSpringCredits = 0;

          events.forEach((e) => {
            const d = detailsMap[e.course] || {};
            const crMatch = String(d.credits || "4").match(/(\d+)/);
            const creditNum = crMatch ? Number(crMatch[1]) : 4;
            totalSpringCredits += creditNum;

            const matchingSlot = slots.find((s) => s.slotId === e.slotId);
            const chosenOpt = matchingSlot
              ? (matchingSlot.options || []).find((o) => o.value === matchingSlot.selectedValue)
              : null;

            matrix.push([
              "Spring 2027",
              e.course,
              e.title,
              creditNum,
              d.pillar || e.bucket,
              d.schedule || `${e.days} ${e.slotId}`,
              d.location || "Main Campus",
              d.instructor || "Staff",
              chosenOpt ? chosenOpt.impact : "Required anchor course"
            ]);
          });

          matrix.push([
            "TOTAL",
            `${events.length} Courses`,
            summary.sliceLabel || "Option 1: Balanced Major/Core + Parallel SOPHIA + Elective",
            totalSpringCredits,
            summary.f1Status || "Meets 12-Credit Full-Time Minimum",
            "",
            "",
            "Advisor: Dr. Matthewulat",
            "Ready for Registration Approval"
          ]);

          const csvText =
            "\uFEFF" +
            matrix
              .map((row) =>
                row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
              )
              .join("\r\n");
          const tsvText = matrix
            .map((row) => row.map((cell) => String(cell ?? "").replace(/[\t\r\n]+/g, " ")).join("\t"))
            .join("\n");

          if (evt.exportAction === "download_plan") {
            navigator.clipboard?.writeText(tsvText).catch(() => {});
            const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Augustana_Spring_2027_Advising_Plan_Amina_Tesfaye.csv";
            a.click();
            URL.revokeObjectURL(url);
            showToast(
              "Exported Advising Plan to Google Sheets (.csv)",
              "Downloaded Augustana_Spring_2027_Advising_Plan_Amina_Tesfaye.csv (and copied rows to clipboard for Google Sheets)."
            );
          } else if (evt.exportAction === "open_sheets_new") {
            navigator.clipboard?.writeText(tsvText).catch(() => {});
            window.open("https://sheets.new", "_blank", "noopener");
            showToast(
              "Copied Schedule & Opened Google Sheets (sheets.new)",
              "Press Cmd+V (or Ctrl+V) in cell A1 of your new Google Sheet to paste your Spring 2027 schedule!"
            );
          } else if (evt.exportAction === "email_advisor") {
            const courseLines = events
              .map((e) => {
                const d = detailsMap[e.course] || {};
                return `- ${e.course}: ${e.title} (${d.schedule || `${e.days} ${e.slotId}`})`;
              })
              .join("\n");
            const subject = encodeURIComponent("Spring 2027 Registration Plan Approval Request — Amina Tesfaye");
            const body = encodeURIComponent(
              `Dear Dr. Matthewulat,\n\nI have reviewed my Spring 2027 degree progress, SOPHIA requirements, and time-slot trade-offs in the Augustana Academic Advising Agent. Here is my proposed Spring 2027 schedule for your registration approval:\n\nSelected Mix: ${summary.sliceLabel || "Option 1"}\nTotal Load: ${summary.totalCredits || "14 Credits"}\n\nProposed Courses:\n${courseLines}\n\nPlease let me know if you approve this plan for registration or if we should adjust any sections during our advising session.\n\nThank you,\nAmina Tesfaye`
            );
            window.location.href = `mailto:m.matthewulat@augie.edu?subject=${subject}&body=${body}`;
            showToast(
              "Email Draft Prepared for Dr. Matthewulat",
              "Opened email client with your Spring 2027 schedule requesting registration approval."
            );
          }
          return;
        }

        if (evt.type === "rowAction") {
          // Live in-place A2UI dataModelUpdate simulation when a row action is clicked
          const table = getPrimaryDataTableComponent(payload);
          if (table) {
            const dataModel = payload?.dataModelUpdate?.contents || {};
            const rowsKey = (table.rowsPath || "").replace(/^\//, "");
            const rows = Array.isArray(dataModel[rowsKey]) ? dataModel[rowsKey] : [];
            const targetRow = rows.find((r) => String(r[table.rowHeaderKey]) === String(evt.target));
            const badgeCol = table.columns.find((c) => c.type === "badge");
            if (targetRow && badgeCol) {
              targetRow[badgeCol.key] = `✓ ADK Action Applied (${evt.actionId})`;
              saveActivePayload(payload);
              renderMainSurface();
              renderJsonEditor();
            }
          }
          showToast(
            `A2UI actionResponse Dispatched & Applied Live`,
            `Persona "${p.role}" executed "${evt.actionId}" on "${evt.target}" (Q${q?.number || 1}) — updated table status badge in-place.`
          );
        } else if (evt.type === "formSubmit") {
          const alertComp = (payload?.surfaceUpdate?.components || []).find(
            (c) => c.component && c.component.AlertBanner
          );
          if (alertComp) {
            alertComp.component.AlertBanner.severity = "info";
            alertComp.component.AlertBanner.icon = "✓";
            alertComp.component.AlertBanner.title = `✓ ADK Agent Executed Action: ${evt.actionName}`;
            alertComp.component.AlertBanner.message = `Dispatched parameters ${JSON.stringify(evt.context)} for ${p.role} (Q${q?.number || 1}). Surface updated via A2UI dataModelUpdate.`;
            saveActivePayload(payload);
            renderMainSurface();
            renderJsonEditor();
          }
          showToast(
            `A2UI Form Submitted (${evt.actionName})`,
            `Payload sent to ADK Agent with context: ${JSON.stringify(evt.context)}`
          );
        }
      }
    });
  }

  function getPrimaryDataTableComponent(payload) {
    const comps = payload?.surfaceUpdate?.components || [];
    const found = comps.find((c) => c.component && c.component.DataTable);
    return found ? found.component.DataTable : null;
  }

  function renderVisualBuilder() {
    const container = document.getElementById("visual-builder-content");
    if (!container) return;

    const p = getActivePersona();
    const payload = getActivePayload();
    const table = getPrimaryDataTableComponent(payload);

    if (!table) {
      container.innerHTML = `<p>No DataTable component found in this surface.</p>`;
      return;
    }

    const columns = table.columns || [];
    const availableZionFields = zionSchema.fields || [];

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:1rem;">
        <div>
          <h3 style="margin:0; color:var(--augie-navy);">No-Code A2UI Table Designer — ${p.role} View</h3>
          <p style="margin:0.25rem 0 0; font-size:0.86rem; color:var(--text-muted);">
            Customize what columns, badges, and Zion Cloud Solutions fields display for <strong>${p.role}</strong> (${p.advisingScope}).
          </p>
        </div>
        <button type="button" id="btn-reset-persona-view" class="btn-augie-outline">↺ Reset ${p.role} to Default View</button>
      </div>

      <div class="a2ui-field-group" style="margin-bottom:1rem;">
        <label for="vb-table-title" class="a2ui-field-label">Table Title</label>
        <input id="vb-table-title" type="text" class="a2ui-input" value="${table.title.replace(/"/g, "&quot;")}" />
      </div>

      <div class="a2ui-field-group" style="margin-bottom:1rem;">
        <label for="vb-table-caption" class="a2ui-field-label">Screen-Reader Accessible Caption (Required for Blind & Low-Vision Users)</label>
        <input id="vb-table-caption" type="text" class="a2ui-input" value="${(table.a11yCaption || "").replace(/"/g, "&quot;")}" />
      </div>

      <h4 style="margin:1.2rem 0 0.6rem; color:var(--augie-navy);">Current Table Columns (${columns.length})</h4>
      <div style="display:grid; gap:0.5rem; margin-bottom:1.25rem;">
        ${columns
          .map(
            (col, idx) => `
          <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.5rem; padding:0.65rem 0.9rem; background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:8px;">
            <div>
              <strong>${idx + 1}. ${col.label}</strong>
              <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted); margin-left:0.5rem;">key: ${col.key}</span>
              ${col.zionField ? `<span class="zion-field-pill" style="background:var(--augie-navy); color:var(--augie-gold); margin-left:0.4rem;">${col.zionField}</span>` : ""}
              ${col.type === "badge" ? `<span class="a2ui-badge a2ui-badge-success" style="margin-left:0.4rem;">Accessible Status Badge</span>` : ""}
            </div>
            <button type="button" class="a2ui-action-btn btn-remove-col" data-col-idx="${idx}" aria-label="Remove column ${col.label}">
              ✕ Remove
            </button>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="background:var(--augie-light-blue-soft); border:1.5px solid var(--augie-navy); border-radius:12px; padding:1rem 1.2rem;">
        <h4 style="margin:0 0 0.65rem; color:var(--augie-navy);">➕ Add a Column to ${p.role}'s Table</h4>
        <div class="a2ui-form-grid">
          <div class="a2ui-field-group">
            <label for="vb-preset-field" class="a2ui-field-label">Pick from Hypothetical / Zion Field Catalog</label>
            <select id="vb-preset-field" class="a2ui-input">
              <option value="">-- Custom Column (Type Below) --</option>
              ${availableZionFields
                .map(
                  (f) =>
                    `<option value="${f.hypotheticalField}" data-label="${f.label}" data-zion="${f.zionOfficialField}" data-type="${f.dataType}">${f.label} (${f.zionOfficialField})</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-label" class="a2ui-field-label">Column Display Header</label>
            <input id="vb-new-col-label" type="text" class="a2ui-input" placeholder="e.g., F-1 Visa Full-Time Check" />
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-key" class="a2ui-field-label">JSON Field Key</label>
            <input id="vb-new-col-key" type="text" class="a2ui-input" placeholder="e.g., visa_status" />
          </div>
          <div class="a2ui-field-group">
            <label for="vb-new-col-sample" class="a2ui-field-label">Default Cell Value (For Existing Rows)</label>
            <input id="vb-new-col-sample" type="text" class="a2ui-input" placeholder="e.g., ✓ 14 Cr (F-1 Compliant)" />
          </div>
        </div>
        <button type="button" id="btn-add-col" class="btn-augie-primary">➕ Add Column & Update Live A2UI View</button>
      </div>
    `;

    // Wire title & caption live updates
    const titleInput = document.getElementById("vb-table-title");
    const capInput = document.getElementById("vb-table-caption");
    const updateMeta = () => {
      table.title = titleInput.value;
      table.a11yCaption = capInput.value;
      saveActivePayload(payload);
      renderMainSurface();
      renderJsonEditor();
    };
    titleInput?.addEventListener("change", updateMeta);
    capInput?.addEventListener("change", updateMeta);

    // Wire preset selector
    const presetSel = document.getElementById("vb-preset-field");
    presetSel?.addEventListener("change", () => {
      const opt = presetSel.options[presetSel.selectedIndex];
      if (!opt || !opt.value) return;
      document.getElementById("vb-new-col-key").value = opt.value;
      document.getElementById("vb-new-col-label").value = opt.getAttribute("data-label") || "";
      document.getElementById("vb-new-col-sample").value = "✓ Verified (Hypothetical)";
    });

    // Wire remove column buttons
    container.querySelectorAll(".btn-remove-col").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-col-idx"));
        const removed = table.columns.splice(idx, 1);
        saveActivePayload(payload);
        renderAll();
        showToast("Column Removed", `Removed column "${removed[0]?.label}" from ${p.role} DataTable.`);
      });
    });

    // Wire add column button
    document.getElementById("btn-add-col")?.addEventListener("click", () => {
      const label = document.getElementById("vb-new-col-label").value.trim() || "New Advising Field";
      const key =
        document.getElementById("vb-new-col-key").value.trim() ||
        label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const sampleVal = document.getElementById("vb-new-col-sample").value.trim() || "✓ On Track";
      const presetOpt = presetSel?.options[presetSel.selectedIndex];
      const zionCode = presetOpt?.getAttribute("data-zion") || "PENDING_ZION_CUSTOM_FIELD";

      table.columns.push({
        key,
        label,
        zionField: zionCode,
        type: sampleVal.match(/^[✓⚠⛔🌐]/) ? "badge" : "string",
        sortable: true
      });

      const dataModel = payload?.dataModelUpdate?.contents || {};
      const rowsKey = (table.rowsPath || "").replace(/^\//, "");
      if (Array.isArray(dataModel[rowsKey])) {
        dataModel[rowsKey].forEach((r) => {
          if (r[key] === undefined) r[key] = sampleVal;
        });
      }

      saveActivePayload(payload);
      state.activeTab = "surface";
      renderAll();
      showToast("Added Column to A2UI Surface", `Added "${label}" (${zionCode}) to ${p.role}'s table.`);
    });

    // Wire reset button
    document.getElementById("btn-reset-persona-view")?.addEventListener("click", () => {
      sessionStorage.removeItem(`augie_a2ui_view_${p.id}`);
      for (let i = 1; i <= 10; i++) {
        delete customViews[`${p.id}_q${i}`];
        sessionStorage.removeItem(`augie_a2ui_view_${p.id}_q${i}`);
      }
      customViews[p.id] = JSON.parse(JSON.stringify(baseViews[p.id]));
      renderAll();
      showToast("View Reset", `Restored AI Best-Practice A2UI surface for ${p.role} (Q1–Q10).`);
    });
  }

  function renderJsonEditor() {
    const textarea = document.getElementById("a2ui-json-textarea");
    if (!textarea) return;
    const payload = getActivePayload();
    textarea.value = JSON.stringify(payload, null, 2);
  }

  function renderA11yAudit() {
    const container = document.getElementById("a11y-audit-content");
    if (!container) return;

    const p = getActivePersona();
    const q = getActiveQuestion();
    const payload = getActivePayload();
    const checks = window.AugieA2UIRenderer.auditA2UIPayload(payload);
    const transcript = window.AugieA2UIRenderer.generateScreenReaderTranscript(payload, p, q);

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:1rem;">
        <div>
          <h3 style="margin:0; color:var(--augie-navy);">♿ WCAG 2.2 AA/AAA & International Student Audit — ${p.role}</h3>
          <p style="margin:0.25rem 0 0; font-size:0.86rem; color:var(--text-muted);">
            Role-specific note: ${p.a11yConsiderations}
          </p>
        </div>
        <button type="button" id="btn-speak-transcript" class="btn-augie-primary">🔊 Speak Screen-Reader Narration Aloud</button>
      </div>

      <div class="audit-checklist">
        ${checks
          .map(
            (c) => `
          <div class="audit-item ${c.pass ? "pass" : ""}">
            <span style="font-size:1.2rem;" aria-hidden="true">${c.pass ? "✅" : "⚠️"}</span>
            <div>
              <div style="font-weight:800; color:var(--augie-navy);">${c.label}</div>
              <div style="font-size:0.84rem; color:var(--text-secondary);">${c.detail}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <h4 style="margin:1.35rem 0 0.5rem; color:var(--augie-navy);">🎧 Live Screen-Reader Narration Transcript (JAWS / NVDA / VoiceOver Preview)</h4>
      <pre class="sr-transcript-box" tabindex="0" aria-label="Screen Reader Narration Transcript">${transcript}</pre>
    `;

    document.getElementById("btn-speak-transcript")?.addEventListener("click", () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(transcript);
        utter.rate = 1.02;
        window.speechSynthesis.speak(utter);
        showToast("Screen-Reader Audio Preview Started", "Reading the active A2UI surface aloud via Web Speech API.");
      } else {
        showToast("Speech Synthesis Unavailable", "Review the written screen-reader transcript box below.");
      }
    });
  }

  function buildCodingAgentPrompt() {
    const p = getActivePersona();
    const q = getActiveQuestion();
    const fieldList = (zionSchema.fields || [])
      .map((f) => `- ${f.hypotheticalField} (Zion Mapping: ${f.zionOfficialField}) — ${f.label}: ${f.plainLanguageDescription}`)
      .join("\n");

    return [
      `# Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA) A2UI Design Task`,
      ``,
      `You are helping design an accessible **A2UI (Agent-to-UI)** interface for **Augustana University in Sioux Falls, South Dakota** using the **Google Agent Development Kit (ADK)**.`,
      ``,
      `## Target Persona & Question`,
      `- **Persona Role:** ${p.role}`,
      `- **Advising Scope (RBAC):** ${p.advisingScope}`,
      `- **Companion System Prompt:** "${p.systemPrompt}"`,
      `- **Target Question (Q${q?.number || 1}):** "${q?.question || ""}"`,
      ``,
      `## Mandatory Accessibility & Branding Requirements`,
      `1. **Augustana University (Sioux Falls, SD) Brand Palette:** Primary Blue/Navy \`#081E3F\` (PMS 282, RGB 9/31/64) and Primary Yellow/Gold \`#FED102\` (PMS 109, RGB 255/209/0).`,
      `2. **Blind & Screen-Reader Users:** Every \`DataTable\` (\`MaterialTable\`) MUST include \`a11yCaption\`, \`a11ySummary\`, and \`rowHeaderKey\`.`,
      `3. **Visually Impaired & Color-Blind Users:** Every status badge MUST pair an icon (\`✓\`, \`⚠\`, \`⛔\`, \`🌐\`) with explicit text—never rely on color alone.`,
      `4. **Deaf & Hard-of-Hearing Users:** 100% visual/text parity (zero audio-only alerts).`,
      `5. **International Students:** Link US higher-ed jargon terms (\`SOPHIA\`, \`DFW Rate\`, \`SAP\`, \`Hold\`, \`F-1 Full-Time Load\`, \`Prerequisite Override\`, \`Residency Requirement\`) and include F-1 12-credit full-time guardrails where relevant.`,
      ``,
      `## Gemini Enterprise A2UI v0.9 Technical Requirements (From Zion Cloud Solutions)`,
      `- **Version:** Strictly \`"version": "v0.9"\` on every message (\`v0.9.1\` is not supported in Gemini Enterprise).`,
      `- **Catalog ID:** \`https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json\` (69 built-in components across Basic, Material layout/display/actions/input, and Gemini Enterprise extras \`Canvas\`, \`IFrameSrcdoc\`, \`IFrameUrl\`).`,
      `- **A2A Extension & Hosting:** Declare \`https://a2ui.org/a2a-extension/a2ui/v0.9\` on an **A2A v0.3** agent hosted on **Google Cloud Run** (Vertex AI Agent Engine is not supported for A2UI).`,
      `- **Security & Files:** Call **Model Armor** directly and re-validate \`action\` payloads server-side; deliver downloadable files (PDF degree audits, CSV exports) as **A2A file parts** rather than \`save_artifact\`.`,
      ``,
      `## Official Zion Cloud Solutions Jenzabar J1 (J1PRD) Connector API v1.0 Fields`,
      `- **Base URL:** \`https://connector-api-385429559879.us-central1.run.app\` (26 read-only \`GET\` endpoints over Jenzabar J1 \`J1PRD\`; never writes directly to J1)`,
      `- **Auth & RBAC Headers:** \`Authorization: Bearer <OIDC>\` + \`X-User-Id: <J1 ID_NUM>\` + \`X-User-Role: student | advisor | advising_admin\``,
      fieldList,
      ``,
      `## Output Format`,
      `Return valid A2UI v0.9 JSON matching the structure in \`docs/views/default-views.js\` (\`version: "v0.9"\`, \`surfaceId\`, \`createSurface\`, \`beginRendering\`, \`surfaceUpdate\`, \`dataModelUpdate\`) so I can paste it directly into the Live A2UI JSON Editor or save it to \`docs/views/default-views.js\`.`
    ].join("\n");
  }

  function renderZionModal() {
    const tbody = document.getElementById("zion-mapping-tbody");
    if (!tbody) return;
    tbody.innerHTML = (zionSchema.fields || [])
      .map(
        (f, idx) => `
        <tr>
          <th scope="row" style="font-family:var(--font-mono); font-size:0.8rem;">${f.hypotheticalField}</th>
          <td>
            <div style="font-weight:700;">${f.label}</div>
            <div style="font-family:var(--font-mono); font-size:0.74rem; color:var(--text-muted);">${f.zionTable || ""}</div>
          </td>
          <td>
            <input
              type="text"
              class="a2ui-input zion-field-input"
              style="min-height:38px; padding:0.3rem 0.6rem; font-family:var(--font-mono); font-size:0.8rem;"
              data-field-idx="${idx}"
              value="${f.zionOfficialField}"
              aria-label="Official Zion Cloud Solutions J1 field path for ${f.label}"
            />
          </td>
          <td style="font-size:0.82rem;">${f.plainLanguageDescription}</td>
        </tr>
      `
      )
      .join("");
  }

  function renderAll() {
    renderPersonaPills();
    renderSidebar();
    renderWorkspaceTabs();
    renderMainSurface();
    renderVisualBuilder();
    renderJsonEditor();
    renderA11yAudit();
  }

  function initEvents() {
    // Workspace Tab buttons
    document.querySelectorAll(".ws-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.getAttribute("data-ws-tab");
        renderWorkspaceTabs();
      });
    });

    // A2UI Surface Layout Switcher
    const layoutSel = document.getElementById("sel-layout-mode");
    layoutSel?.addEventListener("change", () => {
      state.layoutMode = layoutSel.value;
      state.activeTab = "surface";
      renderWorkspaceTabs();
      renderMainSurface();
      const labelText = layoutSel.options[layoutSel.selectedIndex]?.text || state.layoutMode;
      showToast("A2UI Surface Layout Updated", `Switched active surface layout to: ${labelText}`);
    });

    // Apply JSON Editor button
    document.getElementById("btn-apply-json")?.addEventListener("click", () => {
      const textarea = document.getElementById("a2ui-json-textarea");
      try {
        const parsed = JSON.parse(textarea.value);
        saveActivePayload(parsed);
        state.activeTab = "surface";
        renderAll();
        showToast("A2UI JSON Stream Applied", "Rendered updated A2UI payload on the live persona surface.");
      } catch (err) {
        showToast("Invalid JSON Syntax", err.message);
      }
    });

    // Download JSON button
    document.getElementById("btn-download-json")?.addEventListener("click", () => {
      const p = getActivePersona();
      const blob = new Blob([JSON.stringify(getActivePayload(), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `augie-aaa-a2ui-${p.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Copy Coding Agent Prompt button
    document.getElementById("btn-copy-agent-prompt")?.addEventListener("click", () => {
      const promptText = buildCodingAgentPrompt();
      navigator.clipboard?.writeText(promptText);
      const p = getActivePersona();
      const q = getActiveQuestion();
      showToast(
        "Copied Coding-Agent Prompt!",
        `Ready to paste into Gemini CLI, Antigravity, Workspace Gemini, Claude, or Cursor for ${p.role} (Q${q?.number || 1}).`
      );
    });

    // Accessibility Toolbar Toggles
    const hcBtn = document.getElementById("btn-toggle-hc");
    hcBtn?.addEventListener("click", () => {
      state.highContrast = !state.highContrast;
      document.body.classList.toggle("a11y-high-contrast", state.highContrast);
      hcBtn.setAttribute("aria-pressed", state.highContrast ? "true" : "false");
      announcePolite(`High contrast AAA mode ${state.highContrast ? "enabled" : "disabled"}.`);
    });

    const scaleSel = document.getElementById("sel-text-scale");
    scaleSel?.addEventListener("change", () => {
      state.textScale = scaleSel.value;
      document.documentElement.classList.remove("a11y-scale-125", "a11y-scale-150");
      if (state.textScale === "125") document.documentElement.classList.add("a11y-scale-125");
      if (state.textScale === "150") document.documentElement.classList.add("a11y-scale-150");
      announcePolite(`Text and target scale set to ${state.textScale} percent.`);
    });

    const spacingBtn = document.getElementById("btn-toggle-spacing");
    spacingBtn?.addEventListener("click", () => {
      state.wideSpacing = !state.wideSpacing;
      document.body.classList.toggle("a11y-wide-spacing", state.wideSpacing);
      spacingBtn.setAttribute("aria-pressed", state.wideSpacing ? "true" : "false");
      announcePolite(`Low-vision and dyslexia reading spacing ${state.wideSpacing ? "enabled" : "disabled"}.`);
    });

    const glossaryBtn = document.getElementById("btn-toggle-glossary");
    glossaryBtn?.addEventListener("click", () => {
      state.showGlossary = !state.showGlossary;
      glossaryBtn.setAttribute("aria-pressed", state.showGlossary ? "true" : "false");
      renderMainSurface();
      announcePolite(`Plain-language international student glossary ${state.showGlossary ? "expanded" : "compact"}.`);
    });

    const langSel = document.getElementById("sel-intl-lang");
    langSel?.addEventListener("change", () => {
      state.lang = langSel.value;
      if (state.lang !== "en") state.showGlossary = true;
      document.getElementById("btn-toggle-glossary")?.setAttribute("aria-pressed", state.showGlossary ? "true" : "false");
      renderMainSurface();
      announcePolite(`Switched international glossary language to ${langSel.options[langSel.selectedIndex].text}.`);
    });

    // Zion Field Mapper Modal
    const zionModal = document.getElementById("zion-schema-modal");
    document.getElementById("btn-open-zion-modal")?.addEventListener("click", () => {
      renderZionModal();
      if (zionModal) zionModal.hidden = false;
    });
    document.getElementById("btn-close-zion-modal")?.addEventListener("click", () => {
      if (zionModal) zionModal.hidden = true;
    });
    document.getElementById("btn-save-zion-mappings")?.addEventListener("click", () => {
      document.querySelectorAll(".zion-field-input").forEach((inp) => {
        const idx = Number(inp.getAttribute("data-field-idx"));
        if (zionSchema.fields[idx]) {
          zionSchema.fields[idx].zionOfficialField = inp.value.trim();
        }
      });
      if (zionModal) zionModal.hidden = true;
      renderAll();
      showToast("Zion Cloud Solutions Mappings Updated!", "Updated field mappings across the workbench.");
    });

    // Course Detail & Syllabus Drawer (Canvas Side Panel)
    const courseDrawer = document.getElementById("course-detail-drawer");
    document.getElementById("btn-close-course-drawer")?.addEventListener("click", () => {
      if (courseDrawer) courseDrawer.hidden = true;
    });
    document.getElementById("course-drawer-backdrop")?.addEventListener("click", () => {
      if (courseDrawer) courseDrawer.hidden = true;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && courseDrawer && !courseDrawer.hidden) {
        courseDrawer.hidden = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderAll();
  });
})();
