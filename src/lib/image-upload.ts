export async function uploadToImageBB(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", process.env.NEXT_PUBLIC_IMAGEBB_API_KEY as string);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      return data.data.url;
    }
    throw new Error("Upload failed");
  } catch (error) {
    throw new Error("Failed to upload image to ImageBB");
  }
}
