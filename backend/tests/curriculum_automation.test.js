const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const {
  getAutomatedDailyQotd,
  getAutomatedWeeklyCases,
  getAutomationTelemetry,
  DAILY_MCQ_BANK,
  WEEKLY_CASE_VAULT,
} = require("../src/services/curriculumAutomation");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Curriculum Automation Engine Tests", () => {
  test("Daily MCQ Bank contains high-yield questions with valid structure", () => {
    assert.ok(DAILY_MCQ_BANK.length >= 20, "MCQ bank should have at least 20 questions");
    for (const q of DAILY_MCQ_BANK) {
      assert.ok(q.id, "MCQ must have an ID");
      assert.ok(q.question, "MCQ must have question text");
      assert.ok(Array.isArray(q.options) && q.options.length >= 4, "MCQ must have at least 4 options");
      assert.ok(typeof q.correctIndex === "number", "MCQ must specify correctIndex");
      assert.ok(q.explanation, "MCQ must have statutory explanation");
    }
  });

  test("Weekly Case Vault contains multi-week sets with 3 standard cases each", () => {
    assert.ok(WEEKLY_CASE_VAULT.length >= 4, "Vault should have at least 4 weeks of cases");
    for (const week of WEEKLY_CASE_VAULT) {
      assert.strictEqual(week.length, 3, "Each week must contain exactly 3 cases (Mon, Wed, Fri)");
      for (const c of week) {
        assert.ok(c.day, "Case must have day title");
        assert.ok(c.title, "Case must have title");
        assert.ok(c.scenario, "Case must have facts scenario");
        assert.ok(c.modelAnswer, "Case must have model answer");
      }
    }
  });

  test("getAutomatedDailyQotd returns deterministic question of the day", async () => {
    const qotd = await getAutomatedDailyQotd();
    assert.ok(qotd, "Must return QOTD");
    assert.ok(qotd.question, "Must have question");
    assert.ok(Array.isArray(qotd.options), "Must have options");
    assert.ok(typeof qotd.correctIndex === "number" || typeof qotd.correctOption === "number");
  });

  test("getAutomatedWeeklyCases returns current week's 3 cases", async () => {
    const weekly = await getAutomatedWeeklyCases();
    assert.ok(weekly, "Must return weekly result");
    assert.ok(Array.isArray(weekly.cases), "Must return cases array");
    assert.strictEqual(weekly.cases.length, 3, "Must have 3 cases for the active week");
  });

  test("GET /api/public/qotd returns live question of the day", async () => {
    const res = await fetch(`${API_URL}/api/public/qotd`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.qotd && data.qotd.question);
  });

  test("GET /api/public/weekly-cases returns academic cases", async () => {
    const res = await fetch(`${API_URL}/api/public/weekly-cases`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.cases) && data.cases.length > 0);
  });

  test("GET /api/public/site-data includes non-null qotd and weekly cases", async () => {
    const res = await fetch(`${API_URL}/api/public/site-data`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.qotd, "site-data must include qotd");
    assert.ok(Array.isArray(data.cases) && data.cases.length > 0, "site-data must include cases");
  });

  test("getAutomationTelemetry provides monitoring metrics", async () => {
    const telemetry = await getAutomationTelemetry();
    assert.ok(telemetry, "Must return telemetry");
    assert.ok(typeof telemetry.currentDayOfYear === "number");
    assert.ok(typeof telemetry.currentWeekOfYear === "number");
    assert.ok(telemetry.totalDailyMcqs > 0);
    assert.ok(telemetry.totalWeeklySets > 0);
  });
});
