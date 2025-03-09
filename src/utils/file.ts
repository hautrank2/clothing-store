export function convertBase64(
  base64: string,
  targetType: "blob" | "file" | "arrayBuffer" | "text",
  mimeType: string = "application/octet-stream",
  fileName?: string
): Blob | File | ArrayBuffer | string {
  // Remove Base64 header if present (e.g., "data:image/png;base64,")
  const base64Content = base64.includes(",") ? base64.split(",")[1] : base64;
  fileName = new Date().toString();

  // Decode Base64 to binary data
  const binary = atob(base64Content);
  const binaryLength = binary.length;
  const bytes = new Uint8Array(binaryLength);

  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Convert to the target type
  switch (targetType) {
    case "blob":
      return new Blob([bytes], { type: mimeType });
    case "file":
      if (!fileName)
        throw new Error("File name is required when converting to File.");
      return new File([bytes], fileName, { type: mimeType });
    case "arrayBuffer":
      return bytes.buffer;
    case "text":
      return binary;
    default:
      throw new Error("Invalid target type specified.");
  }
}

export function base64ToFile(base64: string, filename: string): File {
  // Split the base64 string into data and metadata parts
  const [metadata, data] = base64.split(",");

  // Decode the Base64 string
  const binaryString = atob(data);

  // Create an array of 8-bit unsigned integers
  const arrayBuffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    arrayBuffer[i] = binaryString.charCodeAt(i);
  }

  // Extract the content type from the metadata
  const contentType = metadata.match(/data:(.*);base64/)?.[1] || "";

  // Create and return the File object
  return new File([arrayBuffer], filename, { type: contentType });
}

export function base64ToBlob(base64: string): Blob {
  // Kiểm tra và thêm tiền tố nếu thiếu
  if (!base64.startsWith("data:image/")) {
    console.warn("Base64 format is invalid. Adding correct prefix.");
    base64 = `data:image/png;base64,${base64}`; // Mặc định thêm "image/png"
  }

  // Phân tách phần header và nội dung
  const [header, base64Data] = base64.split(",");
  if (!header || !base64Data) {
    throw new Error("Invalid Base64 format. Unable to parse.");
  }

  // Lấy MIME type từ header
  const mimeTypeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png"; // Mặc định là "image/png"

  // Decode Base64 thành byte array
  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  // Tạo Blob
  return new Blob([byteArray], { type: mimeType });
}

export const fetchFile = async (imageUrl: string) => {
  try {
    // Fetch image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    // Convert response to Blob
    const blob = await response.blob();

    // Create a File object from the Blob
    const fileName = imageUrl.split("/").pop() || "image.jpg"; // Extract file name or use a default
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
};

export function filesArrayToFileList(files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files; // This returns a FileList
}
