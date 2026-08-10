import json
import os
import streamlit as st

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="SchemeMitra — MSME Scheme Discovery Platform",
    page_icon="🇮🇳",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .scheme-card {
        background-color: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        padding: 1.25rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .score-badge {
        font-size: 1.1rem;
        font-weight: 700;
        padding: 0.35rem 0.75rem;
        border-radius: 9999px;
        color: #15803D;
        background-color: #DCFCE7;
        border: 1px solid #86EFAC;
    }
    .badge-high {
        color: #15803D;
        background-color: #DCFCE7;
        border: 1px solid #86EFAC;
    }
    .badge-mid {
        color: #B45309;
        background-color: #FEF3C7;
        border: 1px solid #FCD34D;
    }
    .badge-low {
        color: #B91C1C;
        background-color: #FEE2E2;
        border: 1px solid #FCA5A5;
    }
    .tag {
        display: inline-block;
        background: #F3F4F6;
        color: #374151;
        padding: 0.2rem 0.6rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-right: 0.4rem;
        margin-bottom: 0.3rem;
    }
</style>
""", unsafe_allow_html=True)


# Load Schemes Dataset
@st.cache_data
def load_schemes():
    filepath = os.path.join(os.path.dirname(__file__), "src", "data", "schemes.json")
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

ALL_SCHEMES = load_schemes()


# Recommendation Engine Logic
def calculate_recommendation(profile, scheme):
    score = 0
    matched_criteria = []
    unmatched_criteria = []
    warnings = []
    reasons = []

    # 1. Sector Match (Max 30 pts)
    p_sector = profile.get("sector")
    if p_sector:
        if p_sector in scheme.get("sectors", []) or "general_msme" in scheme.get("sectors", []):
            score += 30
            sector_name = p_sector.replace("_", " ").title()
            matched_criteria.append(f"Sector: Matches {sector_name} sector eligibility")
            reasons.append(f"Relevant for your business sector ({sector_name})")
        else:
            target_sectors = ", ".join(scheme.get("sectors", []))
            unmatched_criteria.append(f"Sector: Scheme specifically targets [{target_sectors}]")
    else:
        score += 15

    # 2. State / Location Match (Max 20 pts)
    p_state = profile.get("state")
    if p_state:
        scheme_states = scheme.get("states", [])
        if "All" in scheme_states or p_state in scheme_states:
            score += 20
            matched_criteria.append(f"Location: Available in {p_state}")
            reasons.append(f"Active for businesses located in {p_state}")
        else:
            allowed = ", ".join(scheme_states)
            unmatched_criteria.append(f"Location: Exclusively available in {allowed}")
            warnings.append(f"Restricted to: {allowed}")
    else:
        score += 10

    # 3. Enterprise Size Match (Max 20 pts)
    p_size = profile.get("enterpriseSize")
    if p_size:
        sizes = scheme.get("enterpriseSizes", [])
        if p_size in sizes:
            score += 20
            matched_criteria.append(f"Enterprise Size: Eligible for {p_size.title()} enterprises")
            reasons.append(f"Designed for {p_size.title()}-sized enterprises")
        else:
            allowed_sizes = "/".join(sizes)
            unmatched_criteria.append(f"Enterprise Size: Scheme is for [{allowed_sizes}] units")
            warnings.append(f"Unit size requirement ({allowed_sizes}) should be verified")
    else:
        score += 10

    # 4. Objective Match (Max 20 pts)
    p_objectives = profile.get("objectives", [])
    scheme_objectives = scheme.get("objectives", [])
    if p_objectives:
        matched_objs = [obj for obj in p_objectives if obj in scheme_objectives]
        if matched_objs:
            obj_points = min(20, int(round((len(matched_objs) / len(p_objectives)) * 20)))
            score += obj_points
            formatted_objs = ", ".join([o.replace("_", " ").title() for o in matched_objs])
            matched_criteria.append(f"Objective: Matches your need for {formatted_objs}")
            reasons.append(f"Supports your core goals ({formatted_objs})")
        else:
            focus_objs = ", ".join([o.replace("_", " ").title() for o in scheme_objectives])
            unmatched_criteria.append(f"Objective: Scheme focuses on {focus_objs}")
    else:
        score += 10

    # 5. Registration Match (Max 10 pts)
    req_regs = scheme.get("requiredRegistrations", [])
    p_regs = profile.get("registrations", [])
    if req_regs:
        if p_regs:
            missing_regs = [r for r in req_regs if r not in p_regs]
            if not missing_regs:
                score += 10
                matched_criteria.append(f"Registrations: Possess required registrations ({', '.join(req_regs).upper()})")
            else:
                has_some = any(r in p_regs for r in req_regs)
                score += 5 if has_some else 0
                warnings.append(f"Missing mandatory registration: {', '.join(missing_regs).upper()}")
        else:
            warnings.append(f"Requires registration: {', '.join(req_regs).upper()}")
    else:
        score += 10

    return {
        "scheme": scheme,
        "matchScore": min(100, score),
        "matchedCriteria": matched_criteria,
        "unmatchedCriteria": unmatched_criteria,
        "warnings": warnings,
        "reasons": reasons,
    }


def get_recommendations(profile):
    recs = [calculate_recommendation(profile, scheme) for scheme in ALL_SCHEMES]
    return sorted(recs, key=lambda x: x["matchScore"], reverse=True)


# Application UI Layout
st.markdown('<div class="main-header">SchemeMitra 🇮🇳</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Government Scheme Discovery Platform for Indian MSMEs & Entrepreneurs</div>',
    unsafe_allow_html=True,
)

# Sidebar: Business Profile Wizard
st.sidebar.header("🏢 Business Profile Wizard")
st.sidebar.markdown("Configure your MSME details for transparent recommendations.")

SECTORS = {
    "food_processing": "Food Processing",
    "textile": "Textiles & Garments",
    "manufacturing": "General Manufacturing",
    "general_msme": "Cross-Sector / Services",
    "other": "Other",
}

STATES = [
    "All", "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu",
    "Uttar Pradesh", "Telangana", "Delhi", "Punjab", "Rajasthan", "Madhya Pradesh"
]

ENTERPRISE_SIZES = {
    "micro": "Micro (< ₹1 Cr Investment / < ₹5 Cr Turnover)",
    "small": "Small (< ₹10 Cr Investment / < ₹50 Cr Turnover)",
    "medium": "Medium (< ₹50 Cr Investment / < ₹250 Cr Turnover)",
}

OBJECTIVES = {
    "funding": "Capital & Term Loans",
    "machinery": "Machinery Purchase & Subsidy",
    "expansion": "Business Expansion",
    "export": "Export Support & Incentives",
    "marketing": "Marketing & Trade Fairs",
    "infrastructure": "Infrastructure & Industrial Land",
    "skill_development": "Training & Skill Development",
    "energy_efficiency": "Green Energy & Energy Efficiency",
}

REGISTRATIONS = {
    "udyam": "Udyam Registration",
    "gst": "GST Identification Number",
    "fssai": "FSSAI License",
    "iec": "Import Export Code (IEC)",
}

sector_key = st.sidebar.selectbox(
    "1. Industry Sector",
    options=list(SECTORS.keys()),
    format_func=lambda x: SECTORS[x],
    index=0,
)

state_val = st.sidebar.selectbox("2. Business Location (State)", options=STATES, index=1)

size_key = st.sidebar.selectbox(
    "3. Enterprise Category",
    options=list(ENTERPRISE_SIZES.keys()),
    format_func=lambda x: ENTERPRISE_SIZES[x],
    index=0,
)

selected_objs = st.sidebar.multiselect(
    "4. Primary Business Objectives",
    options=list(OBJECTIVES.keys()),
    default=["funding", "machinery"],
    format_func=lambda x: OBJECTIVES[x],
)

selected_regs = st.sidebar.multiselect(
    "5. Active Registrations",
    options=list(REGISTRATIONS.keys()),
    default=["udyam", "gst"],
    format_func=lambda x: REGISTRATIONS[x],
)

profile = {
    "sector": sector_key,
    "state": state_val,
    "enterpriseSize": size_key,
    "objectives": selected_objs,
    "registrations": selected_regs,
}

# Main Content Tabs
tab1, tab2, tab3 = st.tabs(["✨ Recommended Schemes", "🔍 Search & Explore Catalog", "⚖️ Compare Schemes"])

recommendations = get_recommendations(profile)

with tab1:
    st.subheader(f"Top Scheme Recommendations ({len(recommendations)} available)")
    st.info("💡 Recommendation Match Scores are calculated deterministically across 5 criteria (Sector, Location, Scale, Objective, Registration).")

    for item in recommendations:
        scheme = item["scheme"]
        score = item["matchScore"]

        badge_class = "badge-high" if score >= 75 else ("badge-mid" if score >= 50 else "badge-low")

        with st.container():
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown(f"### {scheme['shortName']} — {scheme['name']}")
                st.caption(f"🏛️ **Ministry**: {scheme['ministry']} | 📋 **Type**: {scheme['schemeType'].upper()}")
                st.write(scheme["description"])

                # Tags
                tags_html = "".join([f'<span class="tag">{s.replace("_", " ").title()}</span>' for s in scheme["sectors"]])
                tags_html += "".join([f'<span class="tag">📍 {st_name}</span>' for st_name in scheme["states"]])
                st.markdown(tags_html, unsafe_allow_html=True)

            with col2:
                st.markdown(f"<div style='text-align: right;'><span class='score-badge {badge_class}'>{score}/100 Match</span></div>", unsafe_allow_html=True)

            with st.expander("🔍 Match Analysis & Application Details"):
                m_col, w_col = st.columns(2)
                with m_col:
                    st.markdown("**✅ Why this matches:**")
                    for reason in item["reasons"]:
                        st.markdown(f"- {reason}")
                    for crit in item["matchedCriteria"]:
                        st.markdown(f"- `{crit}`")

                with w_col:
                    if item["warnings"]:
                        st.markdown("**⚠️ Potential Gap / Warnings:**")
                        for w in item["warnings"]:
                            st.markdown(f"- ⚠️ {w}")
                    if item["unmatchedCriteria"]:
                        st.markdown("**❌ Unmatched Requirements:**")
                        for u in item["unmatchedCriteria"]:
                            st.markdown(f"- `{u}`")

                st.markdown("---")
                st.markdown(f"💰 **Key Benefit**: {scheme.get('benefitSummary', 'N/A')}")
                st.markdown(f"🎯 **Target Beneficiary**: {scheme.get('beneficiary', 'N/A')}")

                d_col1, d_col2 = st.columns(2)
                with d_col1:
                    st.markdown("**📄 Required Documents:**")
                    for doc in scheme.get("documents", []):
                        st.markdown(f"- {doc}")
                with d_col2:
                    st.markdown("**📝 Application Steps:**")
                    for step in scheme.get("applicationSteps", []):
                        st.markdown(f"1. {step}")

                st.markdown(f"🔗 [Official Application Portal]({scheme.get('applicationUrl', '#')}) | [Ministry Source Guideline]({scheme.get('officialSourceUrl', '#')})")

        st.markdown("---")

with tab2:
    st.subheader("Explore All Government Schemes")
    search_query = st.text_input("🔎 Search by keywords (e.g. Subsidy, Machinery, CGTMSE, Credit)", "")
    
    filtered_schemes = ALL_SCHEMES
    if search_query:
        q = search_query.lower()
        filtered_schemes = [
            s for s in ALL_SCHEMES
            if q in s["name"].lower()
            or q in s["shortName"].lower()
            or q in s["description"].lower()
            or q in s["ministry"].lower()
        ]

    st.write(f"Showing **{len(filtered_schemes)}** scheme(s)")
    for scheme in filtered_schemes:
        st.markdown(f"#### {scheme['shortName']} — {scheme['name']}")
        st.write(scheme["description"])
        st.markdown(f"**Benefit**: {scheme.get('benefitSummary', 'N/A')}")
        st.markdown(f"🔗 [Visit Official Portal]({scheme.get('applicationUrl', '#')})")
        st.markdown("---")

with tab3:
    st.subheader("Side-by-Side Scheme Comparison")
    selected_scheme_names = st.multiselect(
        "Select up to 3 schemes to compare:",
        options=[s["shortName"] for s in ALL_SCHEMES],
        default=[s["shortName"] for s in ALL_SCHEMES[:2]],
        max_selections=3
    )

    if selected_scheme_names:
        compared = [s for s in ALL_SCHEMES if s["shortName"] in selected_scheme_names]
        cols = st.columns(len(compared))
        
        for idx, scheme in enumerate(compared):
            with cols[idx]:
                st.markdown(f"### {scheme['shortName']}")
                st.caption(scheme["name"])
                st.markdown(f"**Ministry:** {scheme['ministry']}")
                st.markdown(f"**Benefit:** {scheme.get('benefitAmount', scheme.get('benefitSummary'))}")
                st.markdown(f"**Eligible Unit Sizes:** {', '.join(scheme['enterpriseSizes']).title()}")
                st.markdown(f"**Required Regs:** {', '.join(scheme.get('requiredRegistrations', ['None'])).upper()}")
                st.markdown(f"**Application URL:** [Apply Now]({scheme.get('applicationUrl', '#')})")
