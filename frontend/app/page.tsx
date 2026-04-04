"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Tab = "auth" | "companies" | "employees";

type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

type Company = {
  _id?: string;
  name: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zip: number;
  };
  contact: number;
  status: "ACTIVE" | "INACTIVE";
};

type Employee = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  designation: "MANAGER" | "TEAM_LEADER" | "DEVELOPER";
  companyId: string;
  isVerified: boolean;
};

const defaultCompany: Company = {
  name: "",
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    zip: 0,
  },
  contact: 0,
  status: "ACTIVE",
};

const defaultEmployee: Employee = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  designation: "DEVELOPER",
  companyId: "",
  isVerified: true,
};

const defaultRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  designation: "DEVELOPER",
  companyId: "",
  isVerified: true,
};

const defaultApiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://company-employee-management-backend.onrender.com";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("auth");
  const [apiBase, setApiBase] = useState(defaultApiBase);
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem("cem_token") || "";
  });
  const [authEmail, setAuthEmail] = useState("sahil@example.com");
  const [authPassword, setAuthPassword] = useState("Password@123");
  const [verifyToken, setVerifyToken] = useState("");
  const [registerData, setRegisterData] = useState(defaultRegister);

  const [companyForm, setCompanyForm] = useState<Company>(defaultCompany);
  const [companyId, setCompanyId] = useState("");
  const [companyQuery, setCompanyQuery] = useState({
    status: "",
    email: "",
    name: "",
    search: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  const [employeeForm, setEmployeeForm] = useState<Employee>(defaultEmployee);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeQuery, setEmployeeQuery] = useState({
    designation: "",
    email: "",
    name: "",
    search: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [lastResponse, setLastResponse] = useState("{}");

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("cem_token", token);
    } else {
      window.localStorage.removeItem("cem_token");
    }
  }, [token]);

  const tokenPreview = useMemo(() => {
    if (!token) return "No token";
    if (token.length < 24) return token;
    return `${token.slice(0, 16)}...${token.slice(-8)}`;
  }, [token]);

  async function callApi<T = unknown>(
    path: string,
    method: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<ApiResult<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${apiBase}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as ApiResult<T>;
    setLastResponse(JSON.stringify(json, null, 2));

    if (!res.ok || !json.success) {
      throw new Error(json.message || json.error || "Request failed");
    }

    return json;
  }

  function startAction(message: string) {
    setLoading(true);
    setError("");
    setFeedback(message);
  }

  function endAction(successMessage: string) {
    setLoading(false);
    setFeedback(successMessage);
  }

  function failAction(err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    setLoading(false);
    setError(message);
    setFeedback("");
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    startAction("Logging in...");
    try {
      const result = await callApi<{ token: string }>(
        "/api/authenticate",
        "POST",
        { email: authEmail, password: authPassword },
        false
      );
      setToken(result.data.token);
      endAction("Login successful. Token saved.");
    } catch (err) {
      failAction(err);
    }
  }

  async function register(e: FormEvent) {
    e.preventDefault();
    startAction("Registering employee...");
    try {
      await callApi("/api/register", "POST", registerData, false);
      endAction("Registration successful. Check email for verification flow.");
    } catch (err) {
      failAction(err);
    }
  }

  async function verifyAccount(e: FormEvent) {
    e.preventDefault();
    startAction("Verifying account...");
    try {
      await callApi(`/api/account-verify/${verifyToken}`, "GET", undefined, false);
      endAction("Account verified successfully.");
    } catch (err) {
      failAction(err);
    }
  }

  async function refresh() {
    startAction("Refreshing token...");
    try {
      const result = await callApi<{ token: string }>(
        "/api/refresh-token",
        "GET",
        undefined,
        true
      );
      setToken(result.data.token);
      endAction("Token refreshed successfully.");
    } catch (err) {
      failAction(err);
    }
  }

  async function loadCompanies() {
    startAction("Loading companies...");
    try {
      const params = new URLSearchParams();
      Object.entries(companyQuery).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const query = params.toString();
      const result = await callApi<Company[]>(
        `/api/companies${query ? `?${query}` : ""}`,
        "GET"
      );
      setCompanies(Array.isArray(result.data) ? result.data : []);
      endAction("Companies loaded.");
    } catch (err) {
      failAction(err);
    }
  }

  async function createCompany(e: FormEvent) {
    e.preventDefault();
    startAction("Creating company...");
    try {
      await callApi("/api/companies", "POST", companyForm);
      endAction("Company created.");
      await loadCompanies();
    } catch (err) {
      failAction(err);
    }
  }

  async function updateCompany(method: "PUT" | "PATCH") {
    if (!companyId) {
      setError("Select a company or fill company id first.");
      return;
    }
    startAction(`${method} company...`);
    try {
      await callApi(`/api/companies/${companyId}`, method, companyForm);
      endAction(`Company ${method === "PUT" ? "updated" : "modified"}.`);
      await loadCompanies();
    } catch (err) {
      failAction(err);
    }
  }

  async function removeCompany(id: string) {
    startAction("Deleting company...");
    try {
      await callApi(`/api/companies/${id}`, "DELETE");
      if (companyId === id) {
        setCompanyId("");
        setCompanyForm(defaultCompany);
      }
      endAction("Company deleted.");
      await loadCompanies();
    } catch (err) {
      failAction(err);
    }
  }

  async function loadEmployees() {
    startAction("Loading employees...");
    try {
      const params = new URLSearchParams();
      Object.entries(employeeQuery).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const query = params.toString();
      const result = await callApi<Employee[]>(
        `/api/employees${query ? `?${query}` : ""}`,
        "GET"
      );
      setEmployees(Array.isArray(result.data) ? result.data : []);
      endAction("Employees loaded.");
    } catch (err) {
      failAction(err);
    }
  }

  async function createEmployee(e: FormEvent) {
    e.preventDefault();
    startAction("Creating employee...");
    try {
      await callApi("/api/employees", "POST", employeeForm);
      endAction("Employee created.");
      await loadEmployees();
    } catch (err) {
      failAction(err);
    }
  }

  async function updateEmployee(method: "PUT" | "PATCH") {
    if (!employeeId) {
      setError("Select an employee or fill employee id first.");
      return;
    }
    startAction(`${method} employee...`);
    try {
      await callApi(`/api/employees/${employeeId}`, method, employeeForm);
      endAction(`Employee ${method === "PUT" ? "updated" : "modified"}.`);
      await loadEmployees();
    } catch (err) {
      failAction(err);
    }
  }

  async function removeEmployee(id: string) {
    startAction("Deleting employee...");
    try {
      await callApi(`/api/employees/${id}`, "DELETE");
      if (employeeId === id) {
        setEmployeeId("");
        setEmployeeForm(defaultEmployee);
      }
      endAction("Employee deleted.");
      await loadEmployees();
    } catch (err) {
      failAction(err);
    }
  }

  return (
    <div className="w-full px-4 py-6 md:px-8 md:py-10">
      <main className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[1.3fr_1fr]">
        <section className="glass rise rounded-3xl p-5 shadow-xl shadow-slate-300/40 md:p-7">
          <header className="mb-6 border-b border-slate-300/70 pb-5">
            <p className="mono text-xs uppercase tracking-[0.24em] text-teal-700">
              Com-Emp Management
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Frontend API Workbench
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
              Built from your Postman collection. Use this dashboard to login,
              keep token state, and execute company/employee CRUD + filters.
            </p>
          </header>

          <div className="mb-5 grid gap-3 rounded-2xl border border-slate-300 bg-white/85 p-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="text-sm font-semibold text-slate-700">
              API Base URL
              <input
                className="mono mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none ring-teal-500 transition focus:ring"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => setToken("")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
            >
              Clear Token
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {(["auth", "companies", "employees"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-teal-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-teal-400"
                }`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "auth" && (
            <div className="grid gap-4 md:grid-cols-2">
              <form
                onSubmit={login}
                className="rounded-2xl border border-slate-300 bg-white p-4"
              >
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Login</h2>
                <div className="space-y-2">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Email"
                  />
                  <input
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Authenticate
                </button>
              </form>

              <form
                onSubmit={verifyAccount}
                className="rounded-2xl border border-slate-300 bg-white p-4"
              >
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Verify Account</h2>
                <input
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  placeholder="JWT token for /account-verify/:token"
                />
                <button
                  type="submit"
                  className="mt-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-500"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={refresh}
                  className="mt-3 ml-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Refresh Token
                </button>
              </form>

              <form
                onSubmit={register}
                className="rounded-2xl border border-slate-300 bg-white p-4 md:col-span-2"
              >
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Register Employee</h2>
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    placeholder="First name"
                    value={registerData.firstName}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Last name"
                    value={registerData.lastName}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                  <select
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    value={registerData.designation}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        designation: e.target.value as Employee["designation"],
                      }))
                    }
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="TEAM_LEADER">TEAM_LEADER</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                  </select>
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Company ID"
                    value={registerData.companyId}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, companyId: e.target.value }))
                    }
                  />
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registerData.isVerified}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, isVerified: e.target.checked }))
                    }
                  />
                  isVerified
                </label>
                <button
                  type="submit"
                  className="mt-3 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Register
                </button>
              </form>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <form
                onSubmit={createCompany}
                className="rounded-2xl border border-slate-300 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Company Form</h2>
                  <input
                    className="mono w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="Company ID"
                  />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={companyForm.name} onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={companyForm.email} onChange={(e) => setCompanyForm((p) => ({ ...p, email: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Address line1" value={companyForm.address.line1} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, line1: e.target.value } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Address line2" value={companyForm.address.line2 || ""} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, line2: e.target.value } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="City" value={companyForm.address.city} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="State" value={companyForm.address.state} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Country" value={companyForm.address.country} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, country: e.target.value } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Zip" value={companyForm.address.zip || ""} onChange={(e) => setCompanyForm((p) => ({ ...p, address: { ...p.address, zip: Number(e.target.value || 0) } }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Contact (10 digits)" value={companyForm.contact || ""} onChange={(e) => setCompanyForm((p) => ({ ...p, contact: Number(e.target.value || 0) }))} />
                  <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={companyForm.status} onChange={(e) => setCompanyForm((p) => ({ ...p, status: e.target.value as Company["status"] }))}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Create</button>
                  <button type="button" onClick={() => updateCompany("PUT")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">PUT Update</button>
                  <button type="button" onClick={() => updateCompany("PATCH")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">PATCH Modify</button>
                  <button type="button" onClick={() => setCompanyForm(defaultCompany)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reset</button>
                </div>
              </form>

              <div className="rounded-2xl border border-slate-300 bg-white p-4">
                <h2 className="text-lg font-semibold text-slate-900">Company List & Filters</h2>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="status" value={companyQuery.status} onChange={(e) => setCompanyQuery((p) => ({ ...p, status: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="email" value={companyQuery.email} onChange={(e) => setCompanyQuery((p) => ({ ...p, email: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="name" value={companyQuery.name} onChange={(e) => setCompanyQuery((p) => ({ ...p, name: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="search" value={companyQuery.search} onChange={(e) => setCompanyQuery((p) => ({ ...p, search: e.target.value }))} />
                </div>
                <button type="button" onClick={loadCompanies} className="mt-3 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Load Companies</button>

                <div className="mt-3 max-h-80 space-y-2 overflow-auto pr-1">
                  {companies.map((company) => (
                    <article key={company._id} className="rounded-xl border border-slate-300 p-3">
                      <p className="font-semibold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-600">{company.email}</p>
                      <p className="text-xs text-slate-500">{company.status}</p>
                      <p className="mono mt-1 text-[11px] text-slate-500">{company._id}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCompanyId(company._id || "");
                            setCompanyForm({
                              ...company,
                              address: {
                                line1: company.address?.line1 || "",
                                line2: company.address?.line2 || "",
                                city: company.address?.city || "",
                                state: company.address?.state || "",
                                country: company.address?.country || "",
                                zip: Number(company.address?.zip || 0),
                              },
                              contact: Number(company.contact || 0),
                              status: (company.status || "ACTIVE") as Company["status"],
                            });
                          }}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => company._id && removeCompany(company._id)}
                          className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "employees" && (
            <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <form
                onSubmit={createEmployee}
                className="rounded-2xl border border-slate-300 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Employee Form</h2>
                  <input
                    className="mono w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Employee ID"
                  />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="First name" value={employeeForm.firstName} onChange={(e) => setEmployeeForm((p) => ({ ...p, firstName: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Last name" value={employeeForm.lastName} onChange={(e) => setEmployeeForm((p) => ({ ...p, lastName: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="password" placeholder="Password" value={employeeForm.password || ""} onChange={(e) => setEmployeeForm((p) => ({ ...p, password: e.target.value }))} />
                  <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={employeeForm.designation} onChange={(e) => setEmployeeForm((p) => ({ ...p, designation: e.target.value as Employee["designation"] }))}>
                    <option value="MANAGER">MANAGER</option>
                    <option value="TEAM_LEADER">TEAM_LEADER</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                  </select>
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Company ID" value={employeeForm.companyId} onChange={(e) => setEmployeeForm((p) => ({ ...p, companyId: e.target.value }))} />
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={employeeForm.isVerified} onChange={(e) => setEmployeeForm((p) => ({ ...p, isVerified: e.target.checked }))} />
                  isVerified
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Create</button>
                  <button type="button" onClick={() => updateEmployee("PUT")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">PUT Update</button>
                  <button type="button" onClick={() => updateEmployee("PATCH")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">PATCH Modify</button>
                  <button type="button" onClick={() => setEmployeeForm(defaultEmployee)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reset</button>
                </div>
              </form>

              <div className="rounded-2xl border border-slate-300 bg-white p-4">
                <h2 className="text-lg font-semibold text-slate-900">Employee List & Filters</h2>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="designation" value={employeeQuery.designation} onChange={(e) => setEmployeeQuery((p) => ({ ...p, designation: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="email" value={employeeQuery.email} onChange={(e) => setEmployeeQuery((p) => ({ ...p, email: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="name" value={employeeQuery.name} onChange={(e) => setEmployeeQuery((p) => ({ ...p, name: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="search" value={employeeQuery.search} onChange={(e) => setEmployeeQuery((p) => ({ ...p, search: e.target.value }))} />
                </div>
                <button type="button" onClick={loadEmployees} className="mt-3 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Load Employees</button>

                <div className="mt-3 max-h-80 space-y-2 overflow-auto pr-1">
                  {employees.map((employee) => (
                    <article key={employee._id} className="rounded-xl border border-slate-300 p-3">
                      <p className="font-semibold text-slate-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-slate-600">{employee.email}</p>
                      <p className="text-xs text-slate-500">{employee.designation}</p>
                      <p className="mono mt-1 text-[11px] text-slate-500">{employee._id}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEmployeeId(employee._id || "");
                            setEmployeeForm({
                              ...employee,
                              password: "",
                              companyId:
                                typeof employee.companyId === "string"
                                  ? employee.companyId
                                  : "",
                            });
                          }}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => employee._id && removeEmployee(employee._id)}
                          className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="glass rise rounded-3xl p-5 shadow-xl shadow-slate-300/35 md:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Session State</h2>
          <dl className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-300 bg-white p-3">
              <dt className="font-semibold">Token</dt>
              <dd className="mono mt-1 break-all text-xs text-slate-600">{tokenPreview}</dd>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-3">
              <dt className="font-semibold">Status</dt>
              <dd className="mt-1 text-sm text-slate-600">
                {loading ? "Running request..." : feedback || "Idle"}
              </dd>
            </div>
            {error && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3">
                <dt className="font-semibold text-rose-700">Error</dt>
                <dd className="mt-1 text-sm text-rose-700">{error}</dd>
              </div>
            )}
          </dl>

          <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            Last Response
          </h3>
          <pre className="mono mt-2 max-h-[28rem] overflow-auto rounded-2xl border border-slate-300 bg-slate-950 p-3 text-[11px] leading-5 text-emerald-300">
            {lastResponse}
          </pre>
        </aside>
      </main>
    </div>
  );
}
