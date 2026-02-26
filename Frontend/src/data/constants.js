import RAW_MONTHLY_DATA from "./sse_monthly_analysis.json";

export const MONTHLY_DATA = RAW_MONTHLY_DATA.map((m) => ({
  // ── Top-level fields ────────────────────────────────────────────────────────
  month:     m.month,
  timestamp: m.timestamp,
  bdh_hour:  m.bdh_hour,

  // ── key_numbers: merge your key_numbers + financials + bdh_summary ──────────
  // Components read from key_numbers, so everything they need lives here.
  key_numbers: {
    // Wind
    wind_speed_avg_ms:         m.bdh_summary?.wind_speed_avg_ms     ?? m.key_numbers?.wind_speed_avg_ms     ?? 0,
    wind_speed_max_ms:         m.bdh_summary?.wind_speed_max_ms     ?? m.key_numbers?.wind_speed_max_ms     ?? 0,
    wind_speed_min_ms:         m.bdh_summary?.wind_speed_min_ms     ?? 0,
    wind_speed_std_ms:         m.bdh_summary?.wind_speed_std_ms     ?? 0,
    wind_power_proxy_avg:      m.bdh_summary?.wind_power_proxy_avg  ?? 0,

    // Hours & fractions
    calm_fraction_pct:         m.bdh_summary?.calm_fraction_pct     ?? m.key_numbers?.calm_fraction_pct     ?? 0,
    high_wind_hours_gt12ms:    m.bdh_summary?.high_wind_hours_gt12ms ?? m.key_numbers?.high_wind_hours_gt12ms ?? 0,
    low_wind_hours_lt4ms:      m.bdh_summary?.low_wind_hours_lt4ms  ?? m.key_numbers?.low_wind_hours_lt4ms  ?? 0,
    hours_processed:           m.bdh_summary?.hours_processed       ?? 744,

    // BDH model
    bdh_memory_norm_avg:       m.bdh_summary?.memory_norm_avg       ?? m.key_numbers?.bdh_memory_norm_avg   ?? 0,
    memory_norm_std:           m.bdh_summary?.memory_norm_std       ?? 0,
    mean_prediction_error:     m.bdh_summary?.mean_prediction_error ?? 0,

    // Financials — pulled from financials block (more accurate than key_numbers)
    capacity_factor_pct:       m.financials?.capacity_factor_pct    ?? m.key_numbers?.capacity_factor_pct   ?? 0,
    est_energy_mwh:            m.financials?.est_energy_mwh         ?? m.key_numbers?.est_energy_mwh        ?? 0,
    est_revenue_cfd_gbp:       m.financials?.est_revenue_cfd_gbp    ?? m.key_numbers?.est_revenue_cfd_gbp   ?? 0,
    est_gross_profit_gbp:      m.financials?.est_gross_profit_gbp   ?? m.key_numbers?.est_gross_profit_gbp  ?? 0,
    lost_revenue_low_wind_gbp: m.financials?.lost_revenue_gbp       ?? m.key_numbers?.lost_revenue_low_wind_gbp ?? 0,
    carbon_avoided_tco2e:      m.financials?.carbon_avoided_tco2e   ?? m.key_numbers?.carbon_avoided_tco2e  ?? 0,
    monthly_om_cost_gbp:       m.financials?.monthly_om_cost_gbp    ?? 500000,
    cfd_strike_price_gbp:      m.financials?.cfd_strike_price_gbp   ?? 98,
    fleet_capacity_mw:         m.financials?.fleet_capacity_mw      ?? 210,

    // Risk
    overall_risk_rating:
      m.llm_conclusion?.overall_risk_rating ??
      m.key_numbers?.overall_risk_rating     ??
      "UNKNOWN",
  },

  // ── llm_conclusion: keep exactly as-is from your JSON ──────────────────────
  llm_conclusion: {
    headline:         m.llm_conclusion?.headline         ?? "",
    overall_risk_rating: m.llm_conclusion?.overall_risk_rating ?? "UNKNOWN",
    sections: {
      "1_weather_and_wind_summary": m.llm_conclusion?.sections?.["1_weather_and_wind_summary"] ?? "",
      "2_energy_generation":        m.llm_conclusion?.sections?.["2_energy_generation"]        ?? "",
      "3_financial_performance":    m.llm_conclusion?.sections?.["3_financial_performance"]    ?? "",
      "4_climate_risk_tcfd":        m.llm_conclusion?.sections?.["4_climate_risk_tcfd"]        ?? "",
      "5_strategic_alignment":      m.llm_conclusion?.sections?.["5_strategic_alignment"]      ?? "",
      "6_recommended_actions":      m.llm_conclusion?.sections?.["6_recommended_actions"]      ?? "",
    },
  },

  // ── Raw blocks: kept for any future use ────────────────────────────────────
  bdh_summary: m.bdh_summary ?? {},
  financials:  m.financials  ?? {},
  sources:     m.sources     ?? [],
}));

// ─── Live Data ────────────────────────────────────────────────────────────────
// Still placeholder — replace when you have a real BDH stream/API
export const LIVE_DATA = {
  hour:        4320,
  timestamp:   "2023-06-15T14:00:00",
  memory_norm: 0.7231,
  wind_metrics: {
    avg_ws_24h:          7.412,
    avg_power_proxy_24h: 0.384,
    high_wind_hours_24h: 8,
    low_wind_hours_24h:  3,
    mean_pred_error:     0.002841,
  },
  recent_errors: [
    0.0031, 0.0028, 0.0024, 0.0029, 0.0033, 0.0027, 0.0031, 0.0025,
    0.0028, 0.003,  0.0026, 0.0029, 0.0031, 0.0027, 0.0024, 0.0028,
    0.003,  0.0026, 0.0029, 0.0031, 0.0025, 0.0028, 0.0027, 0.003,
  ],
  features: {
    WS50M:               { predicted: 8.1241,   actual: 7.9832,   error:  0.1409  },
    WS10M:               { predicted: 6.3412,   actual: 6.2103,   error:  0.1309  },
    wind_power_50m:      { predicted: 0.4123,   actual: 0.3941,   error:  0.0182  },
    wind_power_10m:      { predicted: 0.2741,   actual: 0.2512,   error:  0.0229  },
    T2M:                 { predicted: 12.3241,  actual: 12.1032,  error:  0.2209  },
    ALLSKY_SFC_SW_DWN:   { predicted: 145.23,   actual: 142.81,   error:  2.42    },
    RH2M:                { predicted: 78.41,    actual: 79.1,     error: -0.69    },
    PS:                  { predicted: 1013.23,  actual: 1013.51,  error: -0.28    },
    wind_shear_ratio:    { predicted: 0.8231,   actual: 0.8412,   error: -0.0181  },
    memory_norm_last_hour: { predicted: 0.7181, actual: 0.7312,   error: -0.0131  },
    WD50M:               { predicted: 234.12,   actual: 231.89,   error:  2.23    },
    CLOUD_AMT:           { predicted: 62.31,    actual: 64.12,    error: -1.81    },
    RHOA:                { predicted: 1.2341,   actual: 1.2289,   error:  0.0052  },
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const CHAT_HISTORY = [
  {
    role: "assistant",
    text: "Hello! I'm the SSE Renewables AI Analyst. I have access to live BDH model data and SSE's corporate documents. Ask me anything about wind performance, financial risk, climate exposure, or strategic alignment.",
  },
];

// Dynamically build mock responses from real data so answers reflect actual numbers
const highRiskMonths  = MONTHLY_DATA.filter(m => m.key_numbers.overall_risk_rating === "HIGH");
const mediumRiskMonths = MONTHLY_DATA.filter(m => m.key_numbers.overall_risk_rating === "MEDIUM");
const totalRevenue    = MONTHLY_DATA.reduce((s, m) => s + (m.key_numbers.est_revenue_cfd_gbp || 0), 0);
const totalProfit     = MONTHLY_DATA.reduce((s, m) => s + (m.key_numbers.est_gross_profit_gbp || 0), 0);
const bestMonth       = [...MONTHLY_DATA].sort((a, b) => b.key_numbers.est_revenue_cfd_gbp - a.key_numbers.est_revenue_cfd_gbp)[0];
const worstMonth      = [...MONTHLY_DATA].sort((a, b) => a.key_numbers.est_revenue_cfd_gbp - b.key_numbers.est_revenue_cfd_gbp)[0];
const maxLostRevenue  = Math.max(...MONTHLY_DATA.map(m => m.key_numbers.lost_revenue_low_wind_gbp || 0));
const maxLostMonth    = MONTHLY_DATA.find(m => m.key_numbers.lost_revenue_low_wind_gbp === maxLostRevenue);

export const MOCK_RESPONSES = {
  default: {
    answer: `Based on the BDH model data and SSE's TCFD disclosures, the main physical climate risks are:\n\n**Low-wind exposure** — calm fractions up to ${Math.max(...MONTHLY_DATA.map(m => m.key_numbers.calm_fraction_pct || 0)).toFixed(1)}% recorded, with up to £${(maxLostRevenue / 1e6).toFixed(2)}M lost revenue in a single month (${maxLostMonth?.month}).\n\n**Anticyclonic blocking** — increased frequency under 2°C warming pathways per TCFD 2023.\n\n**Financial stress** during wind droughts — O&M costs can consume nearly all CfD revenue when generation drops near zero.\n\nTransition risk remains LOW given stable CfD contracts at £${MONTHLY_DATA[0]?.key_numbers.cfd_strike_price_gbp ?? 98}/MWh.`,
    sources: [
      { file: "SSE_TCFD_2023.pdf",        year: "2023", page: 51 },
      { file: "SSE_Annual_Report_2023.pdf", year: "2023", page: 88 },
    ],
  },
  revenue: {
    answer: `Revenue analysis across ${MONTHLY_DATA.length} months of data:\n\nStrongest month: **${bestMonth?.month}** at £${(bestMonth?.key_numbers.est_revenue_cfd_gbp / 1e3).toFixed(0)}k CfD revenue (${bestMonth?.key_numbers.wind_speed_avg_ms?.toFixed(2)} m/s avg wind).\n\nWeakest month: **${worstMonth?.month}** at £${Math.max(0, worstMonth?.key_numbers.est_revenue_cfd_gbp || 0).toFixed(0)} CfD revenue (${worstMonth?.key_numbers.wind_speed_avg_ms?.toFixed(2)} m/s avg wind).\n\nTotal revenue across dataset: **£${(totalRevenue / 1e6).toFixed(2)}M**. The fleet is CfD-protected at £${MONTHLY_DATA[0]?.key_numbers.cfd_strike_price_gbp ?? 98}/MWh — revenue is purely volumetric, driven entirely by wind resource.`,
    sources: [{ file: "SSE_Annual_Report_2023.pdf", year: "2023", page: 42 }],
  },
  risk: {
    answer: `Risk summary across ${MONTHLY_DATA.length} months:\n\n**HIGH risk months (${highRiskMonths.length}):** ${highRiskMonths.map(m => m.month).join(", ")} — characterised by anticyclonic blocking, calm fractions above 9%, and BDH memory norm below 0.65.\n\n**MEDIUM risk months (${mediumRiskMonths.length}):** ${mediumRiskMonths.map(m => m.month).join(", ")} — moderate wind resource and stable memory norm.\n\nPrimary risk driver: **persistent low-wind and calm conditions** — O&M costs of £500k/month consume the majority of CfD revenue during these periods.`,
    sources: [
      { file: "SSE_TCFD_2023.pdf", year: "2023", page: 17 },
      { file: "SSE_TCFD_2023.pdf", year: "2023", page: 51 },
    ],
  },
};

// ─── UI Constants ─────────────────────────────────────────────────────────────
export const KEY_FEATURES = [
  "WS50M", "WS10M", "wind_power_50m", "T2M", "RH2M",
  "PS", "wind_shear_ratio", "memory_norm_last_hour", "CLOUD_AMT", "ALLSKY_SFC_SW_DWN",
];

export const SECTION_KEYS = [
  "1_weather_and_wind_summary",
  "2_energy_generation",
  "3_financial_performance",
  "4_climate_risk_tcfd",
  "5_strategic_alignment",
  "6_recommended_actions",
];

export const SECTION_LABELS = [
  "Weather & Wind",
  "Energy Gen",
  "Financials",
  "Climate Risk",
  "Strategy",
  "Actions",
];