import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../serviceAccountKey.json";

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const firebaseAdminAuth = getAuth();
