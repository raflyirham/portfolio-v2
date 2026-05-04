import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 4 * 1024 * 1024;

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucketName ||
    !publicBaseUrl
  ) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicBaseUrl: publicBaseUrl.replace(/\/$/, ""),
  };
};

const getS3Client = () => {
  const config = getR2Config();

  if (!config) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function uploadImageWithKeyPrefix(file: File, keyPrefix: string) {
  if (file.size === 0) {
    return null;
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Image must be a JPG, PNG, or WebP file.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Image must be 4MB or smaller.");
  }

  const config = getR2Config();
  const client = getS3Client();

  if (!config || !client) {
    throw new Error("R2 is not configured.");
  }

  const normalizedPrefix = keyPrefix.replace(/^\/+|\/+$/g, "");
  const key = `${normalizedPrefix}/${crypto.randomUUID()}.${extensionByType[file.type]}`;
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: body,
      ContentType: file.type,
    })
  );

  return {
    key,
    url: `${config.publicBaseUrl}/${key}`,
  };
}

export async function uploadProjectImage(file: File) {
  return uploadImageWithKeyPrefix(file, "projects");
}

export async function uploadProjectPreviewImage(file: File) {
  return uploadImageWithKeyPrefix(file, "projects/previews");
}
