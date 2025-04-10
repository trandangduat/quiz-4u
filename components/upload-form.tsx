"use client"

import React, { createContext, use, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { createQuiz } from "../app/action";
import { User } from "next-auth";
import { FileInput, FileInputList } from "./ui/file-input";
import { Button } from "./ui/button";
import { Check, Files, LoaderCircle, LoaderPinwheel, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import ShimmerText from "./ui/shimmer-text";
import { Geist } from "next/font/google";
import StreamingKnowledge from "./streaming-knowledge";

type PresignedUrl = {
  fileName: string;
  url: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function UploadForm({ user } : { user: User }) {
  const filesRef = useRef<HTMLInputElement>(null);
  const [filesName, setFilesName] = useState<string[]>([]);
  const [filesType, setFilesType] = useState<string[]>([]);
  const [filesSize, setFilesSize] = useState<number[]>([]);
  const [quizLink, setQuizLink] = useState<string>("#");
  const [extractingKnowledge, setExtractingKnowledge] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<number>(0); //"none", "uploading", "extracting", "generating"
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const [uploadSectionHeight, setUploadSectionHeight] = useState<string>("auto");
  
  useEffect(() => {
    if (uploadSectionRef.current) {
      setUploadSectionHeight(`${uploadSectionRef.current.scrollHeight}px`);
    }
  }, [filesName, currentStage]);

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

    setCurrentStage(1);
    await sleep(2000);
    setCurrentStage(2);
    await sleep(5000);
    setCurrentStage(3);
    await sleep(3000);
    setCurrentStage(4);
    return;

    setCurrentStage(1);
    let presignedUrls = await getS3PresignedUrls();
    if (presignedUrls.length < 1) {
      return;
    }
    console.time("upload files to s3");
    await uploadFilesToS3(presignedUrls);
    console.timeEnd("upload files to s3");

    setCurrentStage(2);
    console.time("extract knowledge");
    let knowledge = await extractDocumentsKnowledge(filesName, filesType);
    console.timeEnd("extract knowledge");

    setCurrentStage(3);
    console.time("gen quiz");
    const { quiz } = await generateQuiz(knowledge, 10);
    console.log(quiz);
    console.timeEnd("gen quiz");
    let quizId = await createQuiz(quiz, user.id!, knowledge);
    if (quizId !== "Error") {
      setQuizLink(`/quiz/${quizId}`);
    }

    setCurrentStage(4);
  }

  return (
    <>
    <div className="p-8 m-8 rounded-xl border-2 border-dashed border-secondary/90 bg-linear-to-t from-secondary/30 to-primary-100/10">
      <form onSubmit={handleFilesSubmit} >
        <div 
          ref={uploadSectionRef}
          className={cn("overflow-clip transition-all duration-500", currentStage > 0 ? "blur-xs" : "blur-none")}
          style= {{
            height: currentStage > 0 ? 0 : uploadSectionHeight,
          }}
        >
          <FileInput
            type="file"
            ref={filesRef}
            multiple
            onChange={handleInputChange}
            accept="application/pdf, application/x-javascript, text/javascript, application/x-python, text/x-python, text/plain, text/html, text/css, text/md, text/csv, text/xml, text/rtf"
          />
          <FileInputList
            filesName={filesName}
            filesType={filesType}
            filesSize={filesSize}
            className="mt-4"
            hasFiles={filesName.length > 0}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          className={cn("cursor-pointer w-full text-lg py-6 font-semibold", currentStage > 0 ? "mt-0" : "mt-8")}
          disabled={filesName.length < 1 || currentStage > 0}
        >
          {currentStage > 0 ? (
            <>
              <LoaderCircle size={24} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkle size={24} />
              Generate 
            </>
          )}
        </Button>
      </form>

      {currentStage >= 1 && (
        <div className="mt-8 px-4 flex flex-col gap-4 animate-slide-in transition-all">
          <Stage currentStage={currentStage} stage={1} mountDelay={200}>
            <StageTitle title="Uploading files" />
          </Stage>

          <Stage currentStage={currentStage} stage={2} mountDelay={500}>
            <StageTitle title="Extracting knowledge" />
            <StageContent>
              <StreamingKnowledge 
                currentStage={currentStage}
                extractingKnowledge={extractingKnowledge}
              />
            </StageContent>
          </Stage>

          <Stage currentStage={currentStage} stage={3} mountDelay={500}>
            <StageTitle title="Generating quiz" />
            <StageContent>
              {quizLink === "#" ? (
                <span>No quiz available yet.</span>
              ) : (
                <Link href={quizLink} className="text-blue-400 hover:underline">
                  Go to quiz
                </Link>
              )}
            </StageContent>
          </Stage>

        </div>
      )}
    </div>

    <Button
      onClick={() => setCurrentStage(cs => cs - 1)}
    >Prev stage</Button>

    <Button
      onClick={() => setCurrentStage(cs => cs + 1)}
    >Next stage</Button>

    <Button
      onClick={() => {
        setExtractingKnowledge("");
        let text: string = `# Lacerare foret

## Quosque molire quantus degener rebello addidit urguet

Lorem markdownum Eryx, est concepit, sine licet; ex admota si imagine. Buten
animoque magnas luctus spatio crimine durus, me tardi et duro caeli, ad erat
sanguine subit de! Aere vincere missi et rigescere coepit nec, ara gemma
vertitur nisi superbus collo ululatus. Terra comis. In haec; perdes et ferarum
laurus; aut recludi piscem omnes, danda, visa.

    if (miniSpeakers) {
        parity += 3 + rayLogicRate;
    }
    if (4) {
        https_hfs_lamp /= autoresponderRasterCase;
    } else {
        soft(scan_plagiarism_ios - primary);
        mask_megapixel_bar += ditheringItunes + 2 + isaMedia;
        queryInterface(softwareArchitectureAnd * inkjetModel);
    }
    nodeSataDac.minicomputerLock += 850711;
    var online = -5 / 1;
    zebibyteOpen(noc_atm_impact + text);

Limina at demptos, hoc est te fuso pectus bracchia saucius ac *est formosos*
ignorant cupidusque *urbem* et simul, erat. Est domum, vicibus me crede Augusto
te monstri segetes nisi Venus saevaeque concipit latrator remoliri **nuntia
relicta**. Illa defecta riget aut validos: sumit nunc!

- Iuncta egressus si tanto Stygia gravitate unum
- Auro isset ad somnus dulcedine
- Dicenti cognitius spinae propiusque boum et colebas

## Latus generum

Creatus stridentibus **dixit** est patris resedit moenibus potest colonus ignes
[tacuit](http://www.amansmedia.net/) et internodia multaque exsul brevis vobis
vixque: mutabit. Hamo nervo locis in quid lactis forte, et videri miratur suas
ad erit haesit illis, id noviens Liternum. Partibus militiae semina; cuncta
solet flores, castra scylla tantaeque deinde. Ipse infringat, iuste posti
retinacula et, [quam](http://www.dictis.org/et-ex) omne sic.

1. Ante fugit cum
2. Levabas quaecumque ignis
3. Mulcebant tempus vinclisque certos vicimus murra contingere
4. Fecissent terras inania
5. Eandem molli cingere Echidnaeae innuba dextra utque

Esset sit sospes iubent. Hic hoc inexcusabile non austro salutifer riguisse
undas est inque moveri, parvum hederae, in oris, quae quondamque. Annum mea
poscit, insuetum, solvere mundus coma? Sacris hunc petit celebrare mora pervenit
poenas oraque, et sit dammis antiquus et.

Dominari sparsitque est; certans foedataque fera tendens noverca Pelagonaque
latet vocat? Loquax ne erit dentibus vacuae, quo vos, conlapsus Ionium oculos
Danae adulantum odoribus respicit accipe vox Capitolia.
`;
        text += text;
        let arrayText = text.split(" ");
        let i = 0;
        let interval = setInterval(() => {
          if (i >= arrayText.length) {
            clearInterval(interval);
            return;
          }
          setExtractingKnowledge(s => `${s} ${arrayText[i]}`);
          i++;
        }
        , 50);
      }}
    >Fake streaming text</Button>

    </>
  );
}

const StageContext = createContext({
  currentStage: 0,
  stage: 0,
});

type StageProps = {
  currentStage: number;
  stage: number;
  mountDelay?: number; // in milliseconds
  children: React.ReactNode;
};

function Stage({ currentStage, stage, mountDelay = 0, children }: StageProps) {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (currentStage !== stage) {
      return;
    }
    const timeout = setTimeout(() => setShouldMount(true), mountDelay);
    return () => clearTimeout(timeout);
  }, [currentStage]);

  if (!shouldMount) {
    return null;
  }

  return (
    <div className="animate-slide-in">
      <StageContext.Provider value={{ currentStage, stage }}>
        {children}
      </StageContext.Provider>
    </div>
  );
}

function StageTitle({ title }: { title: string }) {
  const { currentStage, stage } = useContext(StageContext);

  return (
    <div className={cn("relative h-8")}>
      {/* loading: currentStage === stage  */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-400", 
          currentStage === stage ? "blur-none opacity-100 transform-none" : "blur-[2px] opacity-0 -translate-y-2"
        )}
      >
        <ShimmerText 
          text={title} 
          shimmerWidth={100} 
          shimmerDuration={2000} 
          className="font-semibold"
        />
      </div>
      {/* done: currentStage > stage */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center gap-2 font-semibold text-secondary-800 transition-all duration-400",
          currentStage > stage ? "blur-none opacity-100 transform-none" : "blur-[2px] opacity-0 translate-y-2"
        )}
      >
        <Check size={16}/>
        <span>{title}</span>
      </div>
    </div>
  );
}

function StageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("relative m-4")}>
      {children}
    </div>
  );
}