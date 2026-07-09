const BASE_URL = (process.env.SECURITY_TEST_BASE_URL || "http://127.0.0.1:7000/api/v1").replace(/\/$/, "");

const SIGNUP_PAYLOAD = {
  name: process.env.SECURITY_TEST_SIGNUP_NAME || "Security Test User",
  email: process.env.SECURITY_TEST_SIGNUP_EMAIL,
  password: process.env.SECURITY_TEST_SIGNUP_PASSWORD,
  mobile_number: process.env.SECURITY_TEST_SIGNUP_MOBILE,
  country_code: process.env.SECURITY_TEST_SIGNUP_COUNTRY_CODE || "+1",
  login_type: "s",
  role: "user",
};

const LOGIN_PAYLOAD = {
  email: process.env.SECURITY_TEST_LOGIN_EMAIL,
  password: process.env.SECURITY_TEST_LOGIN_PASSWORD,
  login_type: "s",
};

const BCRYPT_PATTERN = /\$2[abxy]\$\d{2}\$/;

function findBcryptLeak(value, path = "$") {
  if (typeof value === "string") {
    if (BCRYPT_PATTERN.test(value)) {
      return path;
    }
    return null;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = findBcryptLeak(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const found = findBcryptLeak(child, `${path}.${key}`);
      if (found) return found;
    }
  }

  return null;
}

async function callApi(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  return { status: response.status, json };
}

async function main() {
  if (!SIGNUP_PAYLOAD.email || !SIGNUP_PAYLOAD.password || !SIGNUP_PAYLOAD.mobile_number) {
    console.error("Missing SECURITY_TEST_SIGNUP_* environment variables.");
    process.exit(1);
  }

  if (!LOGIN_PAYLOAD.email || !LOGIN_PAYLOAD.password) {
    console.error("Missing SECURITY_TEST_LOGIN_* environment variables.");
    process.exit(1);
  }

  const checks = [
    { name: "signup", path: "/auth/signup", payload: SIGNUP_PAYLOAD },
    { name: "login", path: "/auth/login", payload: LOGIN_PAYLOAD },
  ];

  for (const check of checks) {
    const result = await callApi(check.path, check.payload);
    const leakPath = findBcryptLeak(result.json);
    if (leakPath) {
      console.error(`[FAIL] bcrypt-like hash leak detected in ${check.name} response at ${leakPath}`);
      process.exit(1);
    }
    console.log(`[PASS] No bcrypt-like hash leak in ${check.name} response`);
  }
}

main().catch((error) => {
  console.error("Security check failed:", error.message);
  process.exit(1);
});
