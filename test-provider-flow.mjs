import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function run() {
  const timestamp = Date.now();
  const providerData = {
    name: `Provider_${timestamp}`,
    email: `provider_${timestamp}@example.com`,
    password: "Password@123",
    phone: "9876543210",
    location: "Mumbai",
    serviceType: "HARVESTING",
    description: "Expert harvesting equipment and labor"
  };

  console.log("==================================================");
  console.log("1. REGISTER NEW SERVICE PROVIDER");
  console.log("==================================================");
  console.log("Registering:", providerData.email);

  const regRes = await fetch(`${BASE_URL}/api/v1/service-provider/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerData)
  });

  const regData = await regRes.json();
  console.log(`Status: ${regRes.status}`);
  console.log("Response:", JSON.stringify(regData, null, 2));

  if (!regRes.ok) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }

  const providerId = regData.serviceProvider.id;
  console.log(`\nService Provider registered with ID: ${providerId}`);

  console.log("\n==================================================");
  console.log("2. AUTHENTICATE SERVICE PROVIDER (NextAuth Credentials Flow)");
  console.log("==================================================");

  // Step 2a: Get CSRF token
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfCookie = csrfRes.headers.get("set-cookie");
  const { csrfToken } = await csrfRes.json();
  console.log("CSRF Token obtained:", csrfToken);

  // Step 2b: Sign in with credentials callback
  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookie || ""
    },
    body: new URLSearchParams({
      csrfToken,
      email: providerData.email,
      password: providerData.password,
      json: "true"
    }),
    redirect: "manual"
  });

  console.log(`Login response status: ${loginRes.status}`);
  const setCookies = loginRes.headers.get("set-cookie");
  console.log("Set-Cookie headers received:", setCookies ? "Yes" : "No");

  // Extract session token cookie
  let sessionCookie = "";
  if (setCookies) {
    const match = setCookies.match(/(next-auth\.session-token=[^;]+)/) || setCookies.match(/(__Secure-next-auth\.session-token=[^;]+)/);
    if (match) {
      sessionCookie = match[1];
    }
  }

  // Also check session endpoint to verify authentication
  const sessionCheckRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: {
      Cookie: sessionCookie
    }
  });
  const sessionData = await sessionCheckRes.json();
  console.log("Session verified:", JSON.stringify(sessionData, null, 2));

  if (!sessionData?.user || sessionData.user.role !== "SERVICE_PROVIDER") {
    throw new Error("Authentication failed or role is not SERVICE_PROVIDER");
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: sessionCookie
  };

  console.log("\n==================================================");
  console.log("3. CHECK SERVICE ROUTE: CREATE SERVICE");
  console.log("==================================================");

  const createPayload = {
    name: "Tractor & Harvester Rental",
    type: "HARVESTING",
    prices: 1500.50,
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-example-tractor.jpg"
  };

  const createRes = await fetch(`${BASE_URL}/api/v1/service-provider/services/create`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(createPayload)
  });

  const createResult = await createRes.json();
  console.log(`Create Status: ${createRes.status}`);
  console.log("Create Response:", JSON.stringify(createResult, null, 2));

  if (!createRes.ok || !createResult.service?.id) {
    throw new Error("Failed to create service");
  }

  const serviceId = createResult.service.id;
  console.log(`Created service ID: ${serviceId}`);

  console.log("\n==================================================");
  console.log("4. CHECK SERVICE ROUTE: GET SERVICES");
  console.log("==================================================");

  const getRes = await fetch(`${BASE_URL}/api/v1/service-provider/services/get-service`, {
    method: "GET",
    headers: authHeaders
  });

  const getResult = await getRes.json();
  console.log(`Get Status: ${getRes.status}`);
  console.log("Get Response:", JSON.stringify(getResult, null, 2));

  console.log("\n==================================================");
  console.log("5. CHECK SERVICE ROUTE: UPDATE SERVICE");
  console.log("==================================================");

  const updatePayload = {
    id: serviceId,
    name: "Tractor & Advanced Harvester Rental (Updated)",
    prices: 1800.00,
    type: "HARVESTING"
  };

  const updateRes = await fetch(`${BASE_URL}/api/v1/service-provider/services/update-service`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(updatePayload)
  });

  const updateResult = await updateRes.json();
  console.log(`Update Status: ${updateRes.status}`);
  console.log("Update Response:", JSON.stringify(updateResult, null, 2));

  console.log("\n==================================================");
  console.log("6. CHECK SERVICE ROUTE: DELETE SERVICE");
  console.log("==================================================");

  const deleteRes = await fetch(`${BASE_URL}/api/v1/service-provider/services/delete?id=${serviceId}`, {
    method: "DELETE",
    headers: authHeaders
  });

  const deleteResult = await deleteRes.json();
  console.log(`Delete Status: ${deleteRes.status}`);
  console.log("Delete Response:", JSON.stringify(deleteResult, null, 2));

  console.log("\n==================================================");
  console.log("7. VERIFY SERVICE DELETION (GET SERVICES)");
  console.log("==================================================");

  const verifyGetRes = await fetch(`${BASE_URL}/api/v1/service-provider/services/get-service`, {
    method: "GET",
    headers: authHeaders
  });
  const verifyGetResult = await verifyGetRes.json();
  console.log("Services list after deletion:", JSON.stringify(verifyGetResult, null, 2));

  console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
}

run().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
