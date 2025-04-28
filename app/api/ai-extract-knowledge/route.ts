import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../get-s3-presigned-urls/route";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

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
You are tasked with extracting all relevant knowledge from educational documents and formatting it into structured Markdown. Follow these rules:

1. **No Markdown code fences**: Output raw Markdown without \`\`\` delimiters.
2. **Comprehensive extraction**: Include all key information—concepts, definitions, formulas, examples, and important details.
3. **Formula formatting**: Render all formulas using TeX syntax with $...$ for inline and $$...$$ for block formulas.
4. **Maintain hierarchy**: Preserve the original document's hierarchical structure (e.g., headings, subheadings).
5. **Language consistency**: Ensure the output is entirely in the same language as the source document.
6. **No additional commentary**: Do not add explanations, comments, or concluding remarks.

Here are examples to guide you:

---

**Example 1**

*Input Excerpt:*
"Newton's Second Law states that the force acting on an object is equal to the mass of that object multiplied by its acceleration."

*Output:*
### Newton's Second Law
Newton's Second Law states that the force acting on an object is equal to the mass of that object multiplied by its acceleration.

**Formula:**
$$
F = m \\times a
$$

---

**Example 2**

*Input Excerpt:*
"The area of a circle is calculated by multiplying pi with the square of the radius."

*Output:*
### Area of a Circle
The area of a circle is calculated by multiplying pi with the square of the radius.

**Formula:**
$$
A = \\pi r^2
$$
`;


export async function POST(req: Request) {
    const { filesName, filesType } = await req.json();
    const filesUrl = await getFilesUrl(filesName, filesType);

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

    const result = streamText({
        model: google("gemini-2.0-flash"),
        system: SUMMARY_PROMPT,
        messages: [
            {
                role: "user",
                // @ts-ignore
                content: files
            }
        ]
    });

    return result.toTextStreamResponse();
}