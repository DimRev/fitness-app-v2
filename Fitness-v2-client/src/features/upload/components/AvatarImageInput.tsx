import { X } from "lucide-react";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { cn, computeCheckSum } from "~/lib/utils";
import useGetPresignedUrlAvatar from "../hooks/useGetPresignedUrlAvatar";
import { H4 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";

type Props = {
  accepts?: string;
  size?: number;
  initImageUrl?: string;
  label: string;
};

const AvatarImageInput = forwardRef(
  ({ accepts, size, initImageUrl, label }: Props, ref) => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileUrl, setFileUrl] = useState<string | null>(initImageUrl ?? null);
    const [fileError, setFileError] = useState<string | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      mutateAsync: getPresignedBucketUrl,
      isError,
      isLoading,
      error,
    } = useGetPresignedUrlAvatar();

    useImperativeHandle(ref, () => ({
      async triggerSubmit() {
        return await handleSubmit();
      },
    }));

    async function handleChange(ev: ChangeEvent<HTMLInputElement>) {
      const file = ev.target.files?.[0];
      setFileError(undefined);

      if (file && size && file.size > size) {
        setFileError("File size exceeds limit");
        handleRemove();
        return;
      }

      if (file && accepts && !accepts.split(",").includes(file.type)) {
        handleRemove();
        setFileError("File type not supported");
        return;
      }

      setFile(file);

      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }

      if (file) {
        const url = URL.createObjectURL(file);
        await handleSubmit();
        setFileUrl(url);
      } else {
        setFileUrl(null);
      }
    }

    function handleRemove() {
      setFile(undefined);
      setFileUrl(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }

    async function handleSubmit() {
      if (!file) {
        return Promise.resolve(fileUrl);
      }
      const checkSum = await computeCheckSum(file);

      const { presigned_url } = await getPresignedBucketUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        check_sum: checkSum,
      });

      if (isError && error) {
        handleRemove();
        console.error(error);
        setFileError(error.message);
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
        handleRemove();
        console.error(err);
        setFileError("Failed to upload file");
        throw "Failed to upload file";
      }
    }

    return (
      <div className="mt-4">
        <H4 className="mb-2">{label}</H4>
        {fileUrl && file ? (
          <div
            className={cn(
              "relative mb-2 flex h-36 justify-center rounded-md border p-1",
              isLoading && "animate-pulse opacity-70",
            )}
          >
            <img
              src={fileUrl}
              alt={file.name}
              className="max-h-36 max-w-60 rounded-md object-cover"
            />
            <Button
              type="button"
              disabled={isLoading}
              className="absolute end-1 top-1"
              onClick={handleRemove}
              size="icon"
              variant="destructive"
            >
              <X />
            </Button>
          </div>
        ) : fileUrl ? (
          <div
            className={cn(
              "relative mb-2 flex h-36 justify-center rounded-md border p-1",
              isLoading && "animate-pulse opacity-70",
            )}
          >
            <img
              src={fileUrl}
              alt="avatar"
              className="max-h-36 max-w-60 rounded-md object-cover"
            />
            <Button
              type="button"
              disabled={isLoading}
              className="absolute end-1 top-1"
              onClick={handleRemove}
              size="icon"
              variant="destructive"
            >
              <X />
            </Button>
          </div>
        ) : null}
        {fileError && <div className="text-destructive">{fileError}</div>}
        <input
          ref={inputRef}
          type="file"
          name="media"
          className="flex-1 border-none"
          accept={accepts}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
    );
  },
);

export default AvatarImageInput;
