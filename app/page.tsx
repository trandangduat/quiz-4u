"use client"

import React, { useRef, useState } from "react";
import { createQuiz } from "./action";
import Link from "next/link";

type PresignedUrl = {
  fileName: string;
  url: string;
};

export default function Home() {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);
  const [filesType, setFilesType] = useState<string[]>([]);
  const [quizLink, setQuizLink] = useState<string>("#");
  const [extractingKnowledge, setExtractingKnowledge] = useState<string>("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!filesRef.current || !filesRef.current.files) {
      console.log("No files were chosen.");
      return;
    }
    let files: FileList = filesRef.current.files;
    console.log(files)
    let newFilesName: string[] = [];
    let newFilesType: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newFilesName.push(files[i].name);
      newFilesType.push(files[i].type);
    }
    setFilesName(newFilesName);
    setFilesType(newFilesType);
  }
  
  async function getS3PresignedUrls(): Promise<PresignedUrl[]> {
    try {
      let res = await fetch("/api/get-s3-presigned-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filesName: filesName,
          filesType: filesType,
        })
      });
      if (!res.ok) {
        throw new Error((await res.json()).error);
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function uploadFilesToS3(presignedUrls: PresignedUrl[]) {
    if (!filesRef.current || !filesRef.current.files) {
      console.log("No files were chosen.");
      return;
    }
    let files: File[] = Array.from(filesRef.current.files);

    const uploadPromises = presignedUrls.map(async ({ fileName, url }) => {
      const file: File | undefined = files.find(f => f.name === fileName);
      if (!file) {
        console.error(`No file with name ${fileName} was found.`);
        return Promise.resolve();
      }
      try {
        return await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
      } catch (error) {
        console.error(`Failed to upload ${fileName}: `, error);
      }
    });

    await Promise.all(uploadPromises);
  }

  async function extractDocumentsKnowledge(filesName: string[], filesType: string[]): Promise<string> {
    let res = await fetch("api/ai-extract-knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filesName: filesName,
        filesType: filesType
      })
    });

    try {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let finalText: string = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break;
        }
        let text: string = decoder.decode(value, { stream: true });
        setExtractingKnowledge(s => `${s}${text}`);
        finalText += text;
      }
      return finalText;
    } catch (e) {
      return `Something wrong happenned while streaming result: ${e}`;
    }
  }

  async function generateQuiz(knowledge: string, numQuestions: number) {
    let res = await fetch("/api/ai-generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        knowledge,
        numQuestions,
      }),
    });
    return await res.json();
  }

  async function handleFilesSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>{
    e.preventDefault();

    let presignedUrls: PresignedUrl[] = await getS3PresignedUrls();
    if (presignedUrls.length < 1) {
      return;
    }
    
    // console.time("upload");
    // await uploadFilesToS3(presignedUrls);
    // console.timeEnd("upload");

    console.time("extract knowledge");
    let knowledge: string = await extractDocumentsKnowledge(filesName, filesType);
    console.timeEnd("extract knowledge");

    console.time("gen quiz");
    const { quiz } = await generateQuiz(knowledge, 10);
    console.log(quiz);
    console.timeEnd("gen quiz");

    let quizId: string = await createQuiz(quiz);
    if (quizId != "Error") {
      setQuizLink(`/quiz/${quizId}`);
    }
  }

  return (
    <>
      <form 
        className="p-4 m-10 border-1"
        onSubmit={handleFilesSubmit}
      >
        <input 
          type="file"
          ref={filesRef}
          multiple
          onChange={handleInputChange}
          accept="
            application/pdf,
            application/x-javascript, text/javascript,
            application/x-python, text/x-python,
            text/plain,
            text/html,
            text/css,
            text/md,
            text/csv,
            text/xml,
            text/rtf
          "
        />
        <button type="submit" className="bg-zinc-800 p-2 hover:bg-zinc-900">Go</button>
      </form>
      <div>
        {filesName.length > 0 && (
          filesName.map((name) => (
            <p key={name}>{name}</p>
          ))
        )}
      </div>
      <div className="bg-zinc-900 p-4 text-sm">
        {extractingKnowledge}
      </div>
      <div>
        <Link href={quizLink} className="text-blue-400 hover:underline">Go to quiz</Link>
      </div>
    </>
  );
}
