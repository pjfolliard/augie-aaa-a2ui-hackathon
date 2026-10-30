"""
Augustana University (Sioux Falls, SD) — Academic Advising Agent (AAA)
Reference Google ADK + A2UI Agent Implementation (`adk_agent/agent.py`).

Demonstrates how Google ADK (`google-adk`) and A2UI (`a2ui-agent-sdk`) work together:
  1. Loads the 10 Augustana Advising Personas and RBAC scopes from `data/personas.json`.
  2. Loads the Hypothetical-to-Zion Cloud Solutions field dictionary from `data/zion_schema_mapping.json`.
  3. Loads the Accessible A2UI Component Catalog (`adk_agent/a2ui_catalog.json`).
  4. Instructs the Gemini model to stream declarative `application/a2ui+json` payloads
     (`surfaceUpdate`, `dataModelUpdate`, `beginRendering`) with mandatory WCAG 2.2 AA/AAA
     and International Student (F-1 12-credit + Plain-Language Glossary) metadata.

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
    """Tool: Returns the Hypothetical-to-Zion Cloud Solutions field mapping and higher-ed jargon glossary."""
    return load_zion_schema()


def build_a2ui_system_instruction(default_persona_id: str = "advisor") -> str:
    personas = load_personas()
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    persona_summary = "\n".join(
        f"- **{p['role']}** (`id={p['id']}`, Scope: `{p['advisingScope']}`): {p['systemPrompt']}"
        for p in personas
    )
    return f"""You are the Augustana University (Sioux Falls, South Dakota) Academic Advising Agent (AAA),
built on the Google Agent Development Kit (ADK) and the A2UI (Agent-to-UI) declarative UI protocol.

## 1. Persona-Scoped Advising (10 Roles)
Always tailor both the data scope and the UI components to the active persona:
{persona_summary}

Default active persona if unspecified: `{default_persona_id}`.

## 2. Mandatory Accessibility & International Student Rules (WCAG 2.2 AA/AAA)
- **Blind & Screen-Reader Users:** Every `DataTable` MUST include `a11yCaption`, `a11ySummary`, and `rowHeaderKey`.
- **Visually Impaired & Color-Blind Users:** Every status cell or badge MUST pair an explicit icon (`✓`, `⚠`, `⛔`, `🌐`) with text—never rely on color alone. Respect Augustana University Sioux Falls Navy (`#081E3F`) and Gold (`#FED102`).
- **Deaf & Hard-of-Hearing Users:** 100% visual and text parity (never rely on audio-only alerts).
- **International Students:** Link US higher-ed terminology (`SOPHIA`, `DFW Rate`, `SAP`, `Hold`, `F-1 Full-Time Load`, `Prerequisite Override`, `Residency Requirement`) via `jargon` tags and highlight the mandatory 12-credit F-1 full-time enrollment minimum whenever course drops or under-loads are discussed.

## 3. Declarative A2UI JSON Output Contract
Respond with a valid A2UI JSON payload containing `surfaceId`, `beginRendering`, `surfaceUpdate`, and `dataModelUpdate` conforming to this catalog:
{json.dumps(catalog, indent=2)}
"""


# Optional runtime binding if `google-adk` is installed in the active Python environment
try:
    from google.adk.agents import Agent

    root_agent = Agent(
        name="augie_academic_advising_a2ui_agent",
        model="gemini-2.5-flash",
        description="Augustana University (Sioux Falls, SD) Persona-Scoped Academic Advising Agent with Accessible A2UI Output.",
        instruction=build_a2ui_system_instruction(),
        tools=[get_persona_context, get_zion_field_catalog],
    )
except ImportError:
    # Allows importing helper functions in environments where `google-adk` is not yet installed
    root_agent = None
