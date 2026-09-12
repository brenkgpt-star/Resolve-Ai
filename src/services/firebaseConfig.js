/**
 * Firebase Configuration for Resolve Aí (Projeto: resolve-ai-c9305)
 * Conectado ao Firebase Web App
 */

export const firebaseConfig = {
  apiKey: "AIzaSyAv3nIDTGncZO2yBSwMiJA-yVVNlJQLJGI",
  authDomain: "resolve-ai-c9305.firebaseapp.com",
  projectId: "resolve-ai-c9305",
  storageBucket: "resolve-ai-c9305.firebasestorage.app",
  messagingSenderId: "1076603275834",
  appId: "1:1076603275834:web:d4c990abb88c2b9e690303",
  measurementId: "G-QTKLEWQPC9"
}

// Verifica se as chaves reais foram fornecidas
export function isFirebaseConfigured() {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" &&
    !firebaseConfig.apiKey.includes("SUA_API_KEY") &&
    Boolean(firebaseConfig.appId) &&
    firebaseConfig.appId !== "SUA_APP_ID_AQUI" &&
    !firebaseConfig.appId.includes("SUA_APP_ID")
  )
}
