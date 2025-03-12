"use client"

import React, { useRef, useState } from "react";

type PresignedUrl = {
  fileName: string;
  url: string;
};

export default function Home() {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);
  const [filesType, setFilesType] = useState<string[]>([]);

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
          typeOperation: "put"
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

  async function getFilesFromS3(filesName: string[]): Promise<PresignedUrl[]> {
    try {
      let res = await fetch("/api/get-s3-presigned-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filesName: filesName,
          typeOperation: "get"
        }),
      });
      return await res.json();
    } catch (error) {
      console.log(`Failed to get files: ${error}`);
      return [];
    }
  }

  async function handleFilesSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>{
    e.preventDefault();

    let presignedUrls: PresignedUrl[] = await getS3PresignedUrls();
    if (presignedUrls.length < 1) {
      return;
    }

    await uploadFilesToS3(presignedUrls);
    let urls: PresignedUrl[] = await getFilesFromS3(filesName);
    console.log(urls.map(e => e.url));

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
    </>
  );
}
