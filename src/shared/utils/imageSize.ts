const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const MAX_IMAGE_SIZE_MB = 5;

export function isImageTooLarge(asset: {
  fileSize?: number;
  filesize?: number;
}): boolean {
  const size = asset.fileSize ?? asset.filesize;

  if (size === undefined) {
    // Size unknown (some Android devices don't report it reliably) —
    // don't block the upload, just skip the check.
    return false;
  }

  return size > MAX_IMAGE_SIZE_BYTES;
}
