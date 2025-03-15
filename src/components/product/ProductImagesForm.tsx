"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem } from "~/components/ui/form";
import { Product } from "~/models/product";
import { Label } from "@radix-ui/react-label";
import { FileUploadPrepare } from "../ui/upload";
import Image from "next/image";
import { ImagePlus, Upload } from "lucide-react";
import ColorBox from "../ui/color-box";
import { Button } from "../ui/button";
import { ChangeEvent, useRef } from "react";

const COLORS = z.enum([
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "brown",
  "gray",
]);

const productImagesSchema = z.object({
  colors: z
    .array(
      z.object({
        color: COLORS,
        hexCode: z.string(),
        imgs: z.custom<FileList>(
          (files) => files instanceof FileList,
          "At least one file is required"
        ),
      })
    )
    .nonempty("At least one color variant is required"),
});

export const ProductImagesForm = ({
  defaultValues,
}: {
  defaultValues: Product;
}) => {
  const imgCount = Array.from({ length: 2 }, (_, i) => i + 1);
  return (
    <div className="product-images form">
      <ul className="colors space-y-8">
        {defaultValues.colors.map((colorField) => {
          return (
            <li key={colorField.color}>
              <div className="mb-4 flex space-x-2">
                <ColorBox color={colorField.hexCode} />
                <h4>{colorField.color}</h4>
              </div>
              <ul className="imgs flex space-x-4">
                {imgCount.map((_, imgIndex) => {
                  return (
                    <FileUpload
                      key={"colorImage" + imgIndex}
                      value={colorField.imgUrls[imgIndex]}
                      onChange={(file) => {
                        console.log("file", file);
                      }}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const FileUpload = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const width = 200,
    height = 200;
  return (
    <div className="upload-wrapper">
      <div className="mb-2">
        <input
          hidden
          ref={inputRef}
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file);
            }
          }}
          max={1}
          value={[]}
        />
        <Button
          variant={"outline"}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          <Upload />
          Upload
        </Button>
      </div>
      {value ? (
        <Image src={value} alt={value} width={width} height={height} />
      ) : (
        <div
          className="img-placeholder rounded border flex items-center"
          style={{ width, height }}
        >
          <ImagePlus size={80} className="m-auto" />
        </div>
      )}
    </div>
  );
};
