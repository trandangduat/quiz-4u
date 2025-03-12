import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3: S3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
});

export async function POST(req: Request) {
    const { filesName, filesType, typeOperation } = await req.json();
    console.log("🤫🤫🤫🤫🤫");
    console.log(filesName);
    if (typeOperation === "put") {
        console.log(filesType);
    }
    
    let commands = [];
    
    if (typeOperation === "put") {
        for (let i = 0; i < filesName.length; i++) {
            commands.push(new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: filesName[i],
                ContentType: filesType[i]
            }));
        }
    } else if (typeOperation === "get") {
        for (let i = 0; i < filesName.length; i++) {
            commands.push(new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: filesName[i]
            }));
        }
    } else {
        return NextResponse.json({ error: "Invalid typeOperation" }, { status: 400 });
    }
    
    try {
        const urls = await Promise.all(
            commands.map(async (cmd, index) => {
                return {
                    fileName: filesName[index],
                    url: await getSignedUrl(s3, cmd, { expiresIn: 60 })
                };
            })
        );
        return NextResponse.json(urls);
    } catch (e) {
        console.log("💔💔💔💔");
        console.error(e);
        return NextResponse.json({
            error: "Error happened while getting pre-signed urls."
        }, {
            status: 500
        });
    }
}