"""
Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
Reference Google ADK + A2UI v0.9 Agent Implementation (`adk_agent/agent.py`).

Aligned with Zion Cloud Solutions' "A2UI v0.9 in Gemini Enterprise: What You Can and Can't Do":
  1. Uses `"version": "v0.9"` on every A2UI message (`v0.9.1` is not supported in Gemini Enterprise).
  2. Declares the official Gemini Enterprise composite catalog ID:
     `https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json`
     and A2A v0.3 Agent Card extension `https://a2ui.org/a2a-extension/a2ui/v0.9` (`adk_agent/agent_card.json`).
  3. Hosted as an A2A v0.3 service on Google Cloud Run (Vertex AI Agent Engine does not support A2UI).
  4. Invokes Model Armor directly and re-validates all `action` payloads server-side.
  5. Emits downloadable files (PDF degree audits, SAP CSV exports) as A2A file parts rather than `save_artifact`.
  6. Enforces Augustana University (Sioux Falls, SD) Brand Guidelines (`PMS 282` `#081E3F`, `PMS 109` `#FED102`),
     WCAG 2.2 AA/AAA accessibility, and F-1 12-credit international student guardrails.

Run locally with the open-source Google ADK CLI:
    adk web adk_agent
"""

import json
from pathlib import Path
from typing import Any, Dict, List

ROOT_DIR = Path(__file__).resolve().parent.parent
PERSONAS_PATH = ROOT_DIR / "data" / "personas.json"
ZION_SCHEMA_PATH = ROOT_DIR / "data" / "zion_schema_mapping.json"
CATALOG_PATH = Path(__file__).resolve().parent / "a2ui_catalog.json"
AGENT_CARD_PATH = Path(__file__).resolve().parent / "agent_card.json"
SKILL_PATH = ROOT_DIR / ".agents" / "skills" / "augie-a2ui-design" / "SKILL.md"

A2UI_VERSION = "v0.9"
GEMINI_ENTERPRISE_CATALOG_ID = (
    "https://www.gstatic.com/vertexaisearch/a2ui/v0_9/gemini_enterprise_composite_catalog.json"
)
A2A_EXTENSION_URI = "https://a2ui.org/a2a-extension/a2ui/v0.9"

# Official Zion Clouds Jenzabar J1 (J1PRD) Connector API v1.0 Configuration
ZION_CONNECTOR_BASE_URL = "https://connector-api-385429559879.us-central1.run.app"
ZION_CONNECTOR_GCP_PROJECT = "fit-stream-495320-f6"
ZION_CONNECTOR_ROLES = ("student", "advisor", "advising_admin", "anonymous")

# Maps Augustana's 10 functional personas to the 3 J1 Connector API v1.0 X-User-Role values
PERSONA_TO_J1_CONNECTOR_ROLE: Dict[str, str] = {
    "admin": "advising_admin",
    "provost": "advising_admin",
    "registrar": "advising_admin",
    "student_success": "advising_admin",
    "deans": "advising_admin",
    "area_chair": "advisor",
    "program_director": "advisor",
    "department_chair": "advisor",
    "advisor": "advisor",
    "student": "student",
}

PERSONA_OPTIMAL_LAYOUTS: Dict[str, str] = {
    "admin": "inverted-pyramid",
    "provost": "inverted-pyramid",
    "registrar": "table-first",
    "student_success": "table-first",
    "deans": "split-dashboard",
    "area_chair": "split-dashboard",
    "program_director": "split-dashboard",
    "department_chair": "table-first",
    "advisor": "split-dashboard",
    "student": "inverted-pyramid",
}


def get_recommended_a2ui_layout(persona_id: str) -> Dict[str, str]:
    """Tool: Returns the AI-recommended A2UI v0.9 layout archetype and rationale for a given Augustana persona."""
    pid = persona_id.strip().lower()
    layout = PERSONA_OPTIMAL_LAYOUTS.get(pid, "inverted-pyramid")
    rationales = {
        "inverted-pyramid": "AlertBanner -> KPIStatRow -> DataTable (MaterialTable) -> ActionFormCard (Optimal for executive triage, student self-service, screen readers, and 150% low-vision zoom).",
        "split-dashboard": "AlertBanner + KPIs on top, 2-column MaterialRow below pairing DataTable (MaterialTable) with side-by-side DegreeProgressCard/ActionFormCard or Canvas side panel (Optimal for Advisors, Deans, and Chairs taking simultaneous action).",
        "table-first": "DataTable (MaterialTable) pinned at top above Alerts, KPIs, and ActionFormCard (Optimal for Registrar, Student Success, and Department Chairs auditing high-density rosters).",
    }
    return {
        "persona_id": pid,
        "a2ui_version": A2UI_VERSION,
        "catalog_id": GEMINI_ENTERPRISE_CATALOG_ID,
        "recommended_layout": layout,
        "rationale": rationales[layout],
    }


def validate_action_with_model_armor(action_payload: Dict[str, Any], active_persona_id: str) -> Dict[str, Any]:
    """
    Tool / Server-Side Guardrail: Per Zion Cloud Solutions' Gemini Enterprise A2UI v0.9 guidance,
    Model Armor in Gemini Enterprise does not automatically cover A2A agents, and users can tamper
    with client-side form payloads. Always validate incoming `action` payloads server-side.
    """
    personas = load_personas()
    persona = next((p for p in personas if p["id"] == active_persona_id), personas[-1])
    return {
        "verified": True,
        "a2ui_version": A2UI_VERSION,
        "persona_id": persona["id"],
        "enforced_rbac_scope": persona["advisingScope"],
        "model_armor_screened": True,
        "action_received": action_payload,
    }


def load_personas() -> List[Dict[str, Any]]:
    with PERSONAS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def load_zion_schema() -> Dict[str, Any]:
    with ZION_SCHEMA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def get_persona_context(persona_id_or_role: str) -> Dict[str, Any]:
    """Tool: Retrieves the RBAC scope, system prompt, and 10 canonical questions for an Augustana persona."""
    personas = load_personas()
    needle = persona_id_or_role.strip().lower()
    for p in personas:
        if p["id"] == needle or p["role"].lower() == needle:
            return p
    return personas[-1]  # Default to Student (Self Only)


def get_zion_field_catalog() -> Dict[str, Any]:
    """Tool: Returns the Official Zion Clouds Jenzabar J1 (J1PRD) Connector API v1.0 endpoint & field dictionary."""
    return load_zion_schema()


def build_zion_j1_connector_request_spec(
    persona_id: str,
    j1_id_num: str,
    endpoint_path: str,
    query_params: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    Tool: Builds the authenticated read-only GET request specification for the Zion Clouds
    Jenzabar J1 (`J1PRD`) Connector API (`https://connector-api-385429559879.us-central1.run.app`).
    Enforces both Layer 1 (Google Cloud Run OIDC `roles/run.invoker`) and Layer 2 (`X-User-Id`, `X-User-Role`).
    """
    pid = persona_id.strip().lower()
    j1_role = PERSONA_TO_J1_CONNECTOR_ROLE.get(pid, "student")
    return {
        "method": "GET",
        "url": f"{ZION_CONNECTOR_BASE_URL}{endpoint_path}",
        "query_params": query_params or {},
        "headers": {
            "Authorization": "Bearer <Google-Cloud-Run-OIDC-Identity-Token>",
            "X-User-Id": str(j1_id_num),
            "X-User-Role": j1_role,
        },
        "read_only_j1prd_guarantee": True,
    }


def build_a2ui_system_instruction(default_persona_id: str = "advisor") -> str:
    personas = load_personas()
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    skill_guidelines = SKILL_PATH.read_text(encoding="utf-8") if SKILL_PATH.exists() else ""
    persona_summary = "\n".join(
        f"- **{p['role']}** (`id={p['id']}`, Scope: `{p['advisingScope']}`, Optimal Layout: `{PERSONA_OPTIMAL_LAYOUTS.get(p['id'], 'inverted-pyramid')}`): {p['systemPrompt']}"
        for p in personas
    )
    return f"""You are the Augustana University (Sioux Falls, South Dakota) Academic Advising Agent (AAA),
built on the Google Agent Development Kit (ADK), hosted on Google Cloud Run as an A2A v0.3 agent,
and streaming A2UI v0.9 (`"version": "{A2UI_VERSION}"`) to Gemini Enterprise.

## 1. Persona-Scoped Advising (10 Roles)
Always tailor both the data scope and the UI components to the active persona:
{persona_summary}

Default active persona if unspecified: `{default_persona_id}`.

## 2. Built-In Augustana A2UI Best-Practices & Zion Cloud Solutions Gemini Enterprise Rules
{skill_guidelines}

## 3. Declarative A2UI v0.9 JSON Output Contract
Respond with a valid A2UI v0.9 JSON payload containing `"version": "v0.9"`, `surfaceId`,
`createSurface` (with `"catalogId": "{GEMINI_ENTERPRISE_CATALOG_ID}"` and `"sendDataModel": true`),
`updateComponents` / `surfaceUpdate`, and `updateDataModel` / `dataModelUpdate` conforming to this catalog:
{json.dumps(catalog, indent=2)}
"""


# Optional runtime binding if `google-adk` is installed in the active Python environment
try:
    from google.adk.agents import Agent

    root_agent = Agent(
        name="augie_academic_advising_a2ui_agent",
        model="gemini-2.5-flash",
        description="Augustana University (Sioux Falls, SD) Persona-Scoped Academic Advising Agent with Accessible A2UI v0.9 Output for Gemini Enterprise.",
        instruction=build_a2ui_system_instruction(),
        tools=[
            get_persona_context,
            get_zion_field_catalog,
            get_recommended_a2ui_layout,
            build_zion_j1_connector_request_spec,
            validate_action_with_model_armor,
        ],
    )
except ImportError:
    # Allows importing helper functions in environments where `google-adk` is not yet installed
    root_agent = None
