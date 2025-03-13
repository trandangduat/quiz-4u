"use client"

import { readStreamableValue } from "ai/rsc";
import React, { useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

type PresignedUrl = {
  fileName: string;
  url: string;
};

export default function Home() {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);
  const [filesType, setFilesType] = useState<string[]>([]);
  const [gg, setGg] = useState<string>("");

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

  async function handleFilesSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>{
    e.preventDefault();

    let presignedUrls: PresignedUrl[] = await getS3PresignedUrls();
    if (presignedUrls.length < 1) {
      return;
    }
    
    console.time("upload");
    await uploadFilesToS3(presignedUrls);
    console.timeEnd("upload");

    let res = await fetch("api/get-documents-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filesName: filesName,
        filesType: filesType
      })
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) {
        break;
      }
      let text: string = decoder.decode(value, { stream: true });
      setGg(s => `${s}${text}`);
    }


    // setGg((await res.json()).text);
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
        {gg}
      </div>
    </>
  );
}
