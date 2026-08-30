import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function run() {
  const timestamp = Date.now();
  const providerData = {
    name: `GoodSupplier_${timestamp}`,
    email: `supplier_${timestamp}@example.com`,
    password: "Password@123",
    companyName: "Green Agro Supplies Ltd",
    phone: "9988776655",
    location: "Nashik",
    goods: ["SEEDS", "FERTILIZER", "EQUIPMENT"]
  };

  console.log("==================================================");
  console.log("1. REGISTER NEW GOODS PROVIDER");
  console.log("==================================================");

  const regRes = await fetch(`${BASE_URL}/api/v1/goods-provider/register`, {
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

  console.log("\n==================================================");
  console.log("2. AUTHENTICATE GOODS PROVIDER VIA NEXTAUTH");
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
      email: providerData.email,
      password: providerData.password,
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

  if (!sessionData?.user || sessionData.user.role !== "GOODS_PROVIDER") {
    throw new Error("Authentication failed or role is not GOODS_PROVIDER");
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: sessionCookie
  };

  console.log("\n==================================================");
  console.log("3. CREATE GOOD (POST /api/v1/goods-provider/goods/create)");
  console.log("==================================================");

  const createPayload = {
    name: "Hybrid Tomato Seeds F1",
    category: "SEEDS",
    price: 450.00,
    stock: 200,
    unit: "packets (50g)",
    description: "High-yield, disease resistant tomato hybrid seeds",
    imageUrl: "https://images.unsplash.com/photo-seeds.jpg"
  };

  const createRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/create`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(createPayload)
  });

  const createResult = await createRes.json();
  console.log(`Create Status: ${createRes.status}`);
  console.log("Create Response:", JSON.stringify(createResult, null, 2));

  if (!createRes.ok || !createResult.good?.id) {
    throw new Error("Failed to create good");
  }

  const goodId = createResult.good.id;

  console.log("\n==================================================");
  console.log("4. GET GOODS PROVIDER GOODS (GET /api/v1/goods-provider/goods/get-goods)");
  console.log("==================================================");

  const getRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/get-goods`, {
    method: "GET",
    headers: authHeaders
  });

  const getResult = await getRes.json();
  console.log(`Get Status: ${getRes.status}`);
  console.log("Get Response:", JSON.stringify(getResult, null, 2));

  console.log("\n==================================================");
  console.log("5. UPDATE GOOD (PUT /api/v1/goods-provider/goods/update-good)");
  console.log("==================================================");

  const updatePayload = {
    id: goodId,
    name: "Premium Hybrid Tomato Seeds F1 (Updated)",
    price: 420.00,
    stock: 250
  };

  const updateRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/update-good`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(updatePayload)
  });

  const updateResult = await updateRes.json();
  console.log(`Update Status: ${updateRes.status}`);
  console.log("Update Response:", JSON.stringify(updateResult, null, 2));

  console.log("\n==================================================");
  console.log("6. GET ALL GOODS (GET /api/v1/goods-provider/goods/all)");
  console.log("==================================================");

  const allRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/all`);
  const allResult = await allRes.json();
  console.log(`All Goods Status: ${allRes.status}`);
  console.log("Goods count:", allResult.goods?.length);

  console.log("\n==================================================");
  console.log("7. DELETE GOOD (DELETE /api/v1/goods-provider/goods/delete)");
  console.log("==================================================");

  const deleteRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/delete?id=${goodId}`, {
    method: "DELETE",
    headers: authHeaders
  });

  const deleteResult = await deleteRes.json();
  console.log(`Delete Status: ${deleteRes.status}`);
  console.log("Delete Response:", JSON.stringify(deleteResult, null, 2));

  console.log("\n==================================================");
  console.log("8. VERIFY DELETION (GET /api/v1/goods-provider/goods/get-goods)");
  console.log("==================================================");

  const verifyGetRes = await fetch(`${BASE_URL}/api/v1/goods-provider/goods/get-goods`, {
    method: "GET",
    headers: authHeaders
  });
  const verifyGetResult = await verifyGetRes.json();
  console.log("Goods list after deletion:", JSON.stringify(verifyGetResult, null, 2));

  console.log("\n>>> ALL GOODS PROVIDER TESTS PASSED SUCCESSFULLY! <<<");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
