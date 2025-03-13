import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../get-s3-presigned-urls/route";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

async function getFilesUrl(filesName: string[], filesType: string[]) {
    let commands = [];
    
    for (let i = 0; i < filesName.length; i++) {
        commands.push(new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filesName[i]
        }));
    }
    
    try {
        const urls = await Promise.all(
            commands.map(async (cmd, index) => {
                return {
                    fileName: filesName[index],
                    fileType: filesType[index],
                    url: await getSignedUrl(s3, cmd, { expiresIn: 60 }),
                };
            })
        );
        return urls;
    } catch (e) {
        return [];
    }
}

const SUMMARY_PROMPT = `
Extract ALL knowledge from this educational document with these requirements:

1. Begin immediately with the content extraction - no introductory phrases like "Here are the notes" or "I've extracted the following"
2. Include ALL key information, concepts, definitions, formulas, and important details
3. Maintain the original structure and organization 
4. Keep ALL technical terms and specialized vocabulary intact
5. Output must be 100% in the same language as the source document
6. Include all examples, case studies, and practical applications
7. Preserve all citations and references
8. Highlight critical points or particularly significant information
9. Keep tables, lists, and structured information in their original format
10. Do not add any commentary, explanations of what you did, or concluding remarks
`;

export async function POST(req: Request) {
    console.time("get urls");
    const { filesName, filesType } = await req.json();
    const filesUrl = await getFilesUrl(filesName, filesType);
    console.timeEnd("get urls");

    console.log(filesUrl);

    let files: { 
        type: string, 
        data: string, 
        mimeType: string 
    }[] = [];

    for (let i = 0; i < filesUrl.length; i++) {
        files.push({
            type: "file",
            data: filesUrl[i].url,
            mimeType: filesUrl[i].fileType
        });
    }

    console.time("gen text");

    // const result = await generateText({
    //     model: google("gemini-2.0-flash"),
    //     system: SUMMARY_PROMPT,
    //     messages: [
    //         {
    //             role: "user",
    //             content: files
    //         }
    //     ]
    // });

    console.timeEnd("gen text");

    const result = streamText({
        model: google("gemini-2.0-flash"),
        system: SUMMARY_PROMPT,
        messages: [
            {
                role: "user",
                content: files
            }
        ]
    });
    
    return result.toTextStreamResponse();
    return NextResponse.json({ text: result.text });
}