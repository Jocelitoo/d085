import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return Response.json({ signature });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { imageId } = body;

  cloudinary.uploader.destroy(imageId, (error: unknown, result: unknown) => {
    console.log(result, error);
  });

  return NextResponse.json("Sucesso");
}
