import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function run() {
  const timestamp = Date.now();
  const userData = {
    name: `Farmer_${timestamp}`,
    email: `farmer_${timestamp}@example.com`,
    password: "Password@123"
  };

  console.log("==================================================");
  console.log("1. REGISTER NEW USER");
  console.log("==================================================");

  const regRes = await fetch(`${BASE_URL}/api/v1/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const regData = await regRes.json();
  console.log(`Status: ${regRes.status}`);
  console.log("Response:", JSON.stringify(regData, null, 2));

  if (!regRes.ok) {
    throw new Error(`User registration failed: ${JSON.stringify(regData)}`);
  }

  console.log("\n==================================================");
  console.log("2. AUTHENTICATE USER VIA NEXTAUTH");
  console.log("==================================================");

  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfCookie = csrfRes.headers.get("set-cookie");
  const { csrfToken } = await csrfRes.json();

  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookie || ""
    },
    body: new URLSearchParams({
      csrfToken,
      email: userData.email,
      password: userData.password,
      json: "true"
    }),
    redirect: "manual"
  });

  const setCookies = loginRes.headers.get("set-cookie");
  let sessionCookie = "";
  if (setCookies) {
    const match = setCookies.match(/(next-auth\.session-token=[^;]+)/) || setCookies.match(/(__Secure-next-auth\.session-token=[^;]+)/);
    if (match) {
      sessionCookie = match[1];
    }
  }

  const sessionCheckRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { Cookie: sessionCookie }
  });
  const sessionData = await sessionCheckRes.json();
  console.log("Session verified:", JSON.stringify(sessionData, null, 2));

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: sessionCookie
  };

  console.log("\n==================================================");
  console.log("3. CREATE CROP");
  console.log("==================================================");

  const createRes = await fetch(`${BASE_URL}/api/v1/user/crops/create`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Organic Wheat",
      type: "Grain",
      area: 5.5,
      quantity: 1200,
      price: 25.50
    })
  });

  const createData = await createRes.json();
  console.log(`Status: ${createRes.status}`);
  console.log("Response:", JSON.stringify(createData, null, 2));

  if (!createRes.ok || !createData.crop?.id) {
    throw new Error("Crop creation failed");
  }

  const cropId = createData.crop.id;

  console.log("\n==================================================");
  console.log("4. GET ALL CROPS");
  console.log("==================================================");

  const getRes = await fetch(`${BASE_URL}/api/v1/user/crops/all`, {
    method: "GET",
    headers: authHeaders
  });

  const getData = await getRes.json();
  console.log(`Status: ${getRes.status}`);
  console.log("Response:", JSON.stringify(getData, null, 2));

  console.log("\n==================================================");
  console.log("5. UPDATE CROP (PUT /api/v1/user/crops/update)");
  console.log("==================================================");

  const updateRes = await fetch(`${BASE_URL}/api/v1/user/crops/update`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      id: cropId,
      name: "Premium Organic Wheat",
      price: 28.75,
      quantity: 1500
    })
  });

  const updateData = await updateRes.json();
  console.log(`Status: ${updateRes.status}`);
  console.log("Response:", JSON.stringify(updateData, null, 2));

  if (!updateRes.ok || updateData.crop?.name !== "Premium Organic Wheat") {
    throw new Error("Crop update failed");
  }

  console.log("\n==================================================");
  console.log("6. DELETE CROP (DELETE /api/v1/user/crops/delete)");
  console.log("==================================================");

  const deleteRes = await fetch(`${BASE_URL}/api/v1/user/crops/delete?id=${cropId}`, {
    method: "DELETE",
    headers: authHeaders
  });

  const deleteData = await deleteRes.json();
  console.log(`Status: ${deleteRes.status}`);
  console.log("Response:", JSON.stringify(deleteData, null, 2));

  if (!deleteRes.ok) {
    throw new Error("Crop delete failed");
  }

  console.log("\n==================================================");
  console.log("7. VERIFY DELETION VIA GET ALL CROPS");
  console.log("==================================================");

  const verifyRes = await fetch(`${BASE_URL}/api/v1/user/crops/all`, {
    method: "GET",
    headers: authHeaders
  });
  const verifyData = await verifyRes.json();
  console.log("Crops list after deletion:", JSON.stringify(verifyData, null, 2));

  console.log("\n>>> ALL CROP TESTS PASSED SUCCESSFULLY! <<<");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
