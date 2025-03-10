"use client"

import React, { useRef, useState } from "react";

export default function Home() {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!filesRef.current || !filesRef.current.files) {
      console.log("No files were chosen.");
      return;
    }
    let files: FileList = filesRef.current.files;
    let newFilesName: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newFilesName.push(files[i].name);
    }
    setFilesName(newFilesName);
  }

  return (
    <>
      <form>
        <input 
          type="file"
          ref={ filesRef }
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
