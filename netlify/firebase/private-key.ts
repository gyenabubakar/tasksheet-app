export interface FirebasePrivateKeySnakeCase {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

const getFirebasePrivateKey = () => {
  const key = JSON.parse(
    process.env.FIREBASE_PRIVATE_KEY!,
  ) as FirebasePrivateKeySnakeCase;

  return key;
};

export default getFirebasePrivateKey;
