import dotenv from "dotenv";
dotenv.config();

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
// import serviceAccount from "../../serviceAccountKey.json";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.SERVICE_ACCOUNT_KEY!, "base64").toString("utf-8")
);

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const firebaseAdminAuth = getAuth();
