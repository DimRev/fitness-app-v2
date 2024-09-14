import { type ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import useGetPresignedBucketUrl from "../hooks/useGetPresignedBucketUrl";
import { cn, computeCheckSum } from "~/lib/utils";

function FileInput() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    mutateAsync: getPresignedBucketUrl,
    isError,
    isLoading,
    error,
  } = useGetPresignedBucketUrl();

  async function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      await handleSubmit();
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  }

  function handleRemove() {
    setFile(undefined);
    setFileUrl(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleSubmit() {
    if (!file) {
      return;
    }
    const checkSum = await computeCheckSum(file);

    const { presigned_url } = await getPresignedBucketUrl({
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      check_sum: checkSum,
    });

    if (isError && error) {
      console.error(error);
      throw "Failed to get presigned url";
    }

    try {
      const res = await fetch(presigned_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      const resUrl = new URL(res.url);
      return resUrl.origin + resUrl.pathname;
    } catch (err) {
      console.error(err);
      throw "Failed to upload file";
    }
  }

  return (
    <>
      {fileUrl && file && (
        <div
          className={cn("relative", isLoading && "animate-pulse opacity-70")}
        >
          <img
            src={fileUrl}
            alt={file.name}
            className="max-w-60 max-h-36 object-cover"
          />
          <Button
            disabled={isLoading}
            className="top-1 absolute end-1"
            onClick={handleRemove}
            size="icon"
            variant="destructive"
          >
            <X />
          </Button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        name="media"
        className="flex-1 border-none"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={isLoading}
      />
    </>
  );
}

export default FileInput;
