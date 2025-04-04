"use client"

import React, { useRef, useState } from "react";
import Link from "next/link";
import { createQuiz } from "../app/action";
import { User } from "next-auth";
import { FileInput, FileInputList } from "./ui/file-input";
import { Button } from "./ui/button";
import { Files, Sparkles } from "lucide-react";

type PresignedUrl = {
  fileName: string;
  url: string;
};

export default function UploadForm({ user } : { user: User }) {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);
  const [filesType, setFilesType] = useState<string[]>([]);
  const [filesSize, setFilesSize] = useState<number[]>([]);
  const [quizLink, setQuizLink] = useState<string>("#");
  const [extractingKnowledge, setExtractingKnowledge] = useState<string>("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!filesRef.current || !filesRef.current.files) {
      console.log("No files were chosen.");
      return;
    }
    let files = filesRef.current.files;
    let newFilesName: string[] = [];
    let newFilesType: string[] = [];
    let newFilesSize: number[] = [];
    for (let i = 0; i < files.length; i++) {
      newFilesName.push(files[i].name);
      newFilesType.push(files[i].type);
      newFilesSize.push(files[i].size);
    }
    setFilesName(newFilesName);
    setFilesType(newFilesType);
    setFilesSize(newFilesSize);
  }

  async function getS3PresignedUrls(): Promise<PresignedUrl[]> {
    try {
      let res = await fetch("/api/get-s3-presigned-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filesName, filesType }),
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
    let files = Array.from(filesRef.current.files);
    const uploadPromises = presignedUrls.map(async ({ fileName, url }) => {
      const file = files.find(f => f.name === fileName);
      if (!file) {
        console.error(`No file with name ${fileName} was found.`);
        return Promise.resolve();
      }
      try {
        return await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
      } catch (error) {
        console.error(`Failed to upload ${fileName}: `, error);
      }
    });
    await Promise.all(uploadPromises);
  }

  async function extractDocumentsKnowledge(filesName: string[], filesType: string[]): Promise<string> {
    let res = await fetch("/api/ai-extract-knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filesName, filesType }),
    });
    try {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let finalText = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        let text = decoder.decode(value, { stream: true });
        setExtractingKnowledge(s => `${s}${text}`);
        finalText += text;
      }
      return finalText;
    } catch (e) {
      return `Something wrong happened while streaming result: ${e}`;
    }
  }

  async function generateQuiz(knowledge: string, numQuestions: number) {
    let res = await fetch("/api/ai-generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ knowledge, numQuestions }),
    });
    return await res.json();
  }

  async function handleFilesSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    let presignedUrls = await getS3PresignedUrls();
    if (presignedUrls.length < 1) return;
    console.time("upload files to s3");
    await uploadFilesToS3(presignedUrls);
    console.timeEnd("upload files to s3");
    console.time("extract knowledge");
    let knowledge = await extractDocumentsKnowledge(filesName, filesType);
    console.timeEnd("extract knowledge");
    console.time("gen quiz");
    const { quiz } = await generateQuiz(knowledge, 10);
    console.log(quiz);
    console.timeEnd("gen quiz");
    let quizId = await createQuiz(quiz, user.id!, knowledge);
    if (quizId !== "Error") {
      setQuizLink(`/quiz/${quizId}`);
    }
  }

  return (
    <>
    <div className="p-8 m-8 rounded-xl border-4 border-dashed dark:border-slate-800 bg-slate-700/10">
      <form className="" onSubmit={handleFilesSubmit}>
        <FileInput
          type="file"
          ref={filesRef}
          multiple
          onChange={handleInputChange}
          accept="application/pdf, application/x-javascript, text/javascript, application/x-python, text/x-python, text/plain, text/html, text/css, text/md, text/csv, text/xml, text/rtf"
        />
      </form>
      <FileInputList
        filesName={filesName}
        filesType={filesType}
        filesSize={filesSize}
        className="mt-4"
        hasFiles={filesName.length > 0}
      />
      {/* <div>
        {filesName.length > 0 &&
          filesName.map(name => <p key={name}>{name}</p>)}
      </div> */}
      <Button
        type="submit"
        variant="default"
        className="cursor-pointer w-full mt-8 text-lg py-6 font-semibold"
        disabled={filesName.length < 1}
      >
        <Sparkles size={24} />
        Generating
      </Button>
    </div>




    <div className="dark:bg-zinc-900 p-4 text-sm">
      {extractingKnowledge}
    </div>
    <div>
      <Link href={quizLink} className="text-blue-400 hover:underline">
        Go to quiz
      </Link>
    </div>
    </>
  );
}
