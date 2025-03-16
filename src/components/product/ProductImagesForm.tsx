"use client";

import { Product } from "~/models/product";
import Image from "next/image";
import { ImagePlus, Upload } from "lucide-react";
import ColorBox from "../ui/color-box";
import { Button } from "../ui/button";
import { ChangeEvent, useRef, useState } from "react";

export const ProductImagesForm = ({
  defaultValues,
  onChange,
  loading,
}: {
  defaultValues: Product;
  onChange: (colorIndex: number, imgIndex: number, file: File) => void;
  loading?: boolean;
}) => {
  const imgCount = Array.from({ length: 2 }, (_, i) => i + 1);
  return (
    <div className="product-images form">
      <ul className="colors space-y-8">
        {defaultValues.colors.map((colorField, colorIndex) => {
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
                        onChange(colorIndex, imgIndex, file);
                      }}
                      loading={loading}
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
  loading,
}: {
  value: string;
  onChange: (file: File) => void;
  loading?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const width = 200,
    height = 200;

  const [hover, setHover] = useState(false);

  return (
    <div
      className="upload-wrapper relative border border-transparent hover:border-border rounded"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
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
      {hover && (
        <div className="absolute top-[-8px] right-[-8px]">
          <Button
            variant={"outline"}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
            disabled={loading}
            size={"sm"}
          >
            <Upload />
            Upload
          </Button>
        </div>
      )}
      <div className="img overflow-hidden rounded">
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
    </div>
  );
};
