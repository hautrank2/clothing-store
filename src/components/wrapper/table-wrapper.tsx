import React, { FunctionComponent, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Edit, Sticker } from "lucide-react";
import { formatDate, formatDateTime } from "~/utils/datetime";
import ColorBox from "../ui/color-box";
import Image from "next/image";
import { PaginationWarpper } from "./pagination";
import { getValueFromPath } from "~/utils/common";
import Spin from "../ui/spin";

export interface IColumn {
  key?: string;
  title: string;
  dataIndex: string[] | string;
  type?:
    | "number"
    | "text"
    | "bagde"
    | "bagdes"
    | "image"
    | "datetime"
    | "date"
    | "color"
    | "images";
  width?: number;
  render?: (value: any, item: any, index: number) => any;
}

export interface IPagination {
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  totalPage: number;
}

interface IProp {
  columns: IColumn[];
  data: any[];
  className?: string;
  classNames?: {
    table?: string;
  };
  variant?: string;
  editable?: boolean;
  deletable?: boolean;
  onEdit?(items: any, index: number): void;
  onDelete?(items: any, index: number): void;
  filters?: ReactNode;
  actions?: ReactNode;
  pagination?: IPagination;
  onChangePage?: (page: number) => void;
  onClickRow?: (item: any) => void;
  onReload?: () => void;
  loading?: boolean;
  height?: number | string;
  scrollToBottom?: () => void;
  hidePagination?: boolean;
}

const TableWrapper: FunctionComponent<IProp> = ({
  columns,
  data = [],
  className,
  classNames,
  editable,
  deletable,
  onEdit,
  pagination,
  onChangePage,
  loading,
  onClickRow,
  height,
  ...props
}) => {
  const hideFooter = !pagination;
  //   const tableRef = React.useRef<HTMLDivElement | null>(null);
  //   const [openDelete, setOpenDelete] = useState({
  //     open: false,
  //     item: null,
  //     index: -1,
  //   });
  const enableRowClick = !!onClickRow;
  const onPageChange = (page: number) => {
    if (onChangePage) {
      onChangePage(page);
    }
  };

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       if (tableRef.current) {
  //         const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
  //         if (scrollTop + clientHeight >= scrollHeight) {
  //           if (scrollToBottom) {
  //             scrollToBottom();
  //           }
  //         }
  //       }
  //     };
  //     const currentRef = tableRef.current;
  //     if (currentRef) {
  //       currentRef.addEventListener("scroll", handleScroll);
  //     }
  //     // Cleanup listener on component unmount
  //     return () => {
  //       if (currentRef) {
  //         currentRef.removeEventListener("scroll", handleScroll);
  //       }
  //     };
  //   }, [data]);

  //   useEffect(() => {
  //     if (!openDelete.open && openDelete.item) {
  //       onDelete?.(openDelete.item, openDelete.index);
  //     }
  //   }, [openDelete.open]);

  const colCount = columns.length;
  return (
    <div className={cn("table-wrapper flex w-full flex-col", className)}>
      <div
        className="table-wrapper relative overflow-auto rounded-md border"
        style={{ maxHeight: height }}
      >
        {loading && (
          <div className="table-loading absolute inset-0 z-20 flex items-center justify-between">
            <div className="m-auto p-4">
              <Spin className="m-auto" size={64} />
            </div>
          </div>
        )}
        <Table className={cn("relative", classNames?.table)} {...props}>
          <TableHeader className="border-b-1 sticky top-0 z-10">
            <TableRow>
              {columns.map((column, index) => {
                return (
                  <TableHead key={column.key || column.title + index}>
                    {column.title}
                  </TableHead>
                );
              })}
              {(editable || deletable) && (
                <TableHead className="table-head-cell-actions"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length <= 0 && (
              <TableRow>
                <TableCell colSpan={colCount}>
                  <div className="mx-auto w-fit py-2">
                    <Sticker size={64} className="text-muted-foreground" />
                    <p className="text-lg font-normal text-muted-foreground">
                      No data
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data.map((row, rowIndex) => {
              return (
                <TableRow
                  key={`table-row-${rowIndex}`}
                  className={cn(
                    `table-row-${rowIndex}`,
                    enableRowClick ? "cursor-pointer" : ""
                  )}
                >
                  {columns.map((col: IColumn, colIndex) => {
                    const key = col.key || "" + colIndex;
                    const value = getValueFromPath(row, col.dataIndex);
                    let el = <p>{value}</p>;
                    switch (col.type) {
                      case "bagde":
                        el = <Badge>{value}</Badge>;
                        break;
                      case "bagdes":
                        el = (
                          <div className="flex flex-wrap gap-2" key={key}>
                            {value.map((item: string, index: number) => (
                              <Badge key={item + index}>{item}</Badge>
                            ))}
                          </div>
                        );
                        break;
                      case "number":
                        el = <p key={key}>{value}</p>;
                        break;
                      case "date":
                        el = <p key={key}>{formatDate(value, "dd/MM/yyyy")}</p>;
                        break;
                      case "datetime":
                        el = <p key={key}>{formatDateTime(value)}</p>;
                        break;
                      case "color":
                        el = <ColorBox color={value} />;
                        break;
                      case "image":
                        el = (
                          <Image
                            key={key}
                            src={value}
                            width={80}
                            height={80}
                            alt="Image not found"
                            className="rounded"
                            priority
                          />
                        );
                        break;
                      case "images":
                        el = (
                          <div key={key} className="flex flex-wrap gap-2">
                            {value?.map((img: string, index: number) => {
                              return (
                                <Image
                                  key={img + index}
                                  src={img}
                                  width={60}
                                  height={60}
                                  alt="Image not found"
                                  className="rounded"
                                />
                              );
                            })}
                          </div>
                        );
                        break;
                    }

                    return (
                      <TableCell
                        style={{ width: col.width }}
                        key={`table-${rowIndex}-col-${colIndex}`}
                      >
                        {col.render ? col.render(value, row, rowIndex) : el}
                      </TableCell>
                    );
                  })}
                  {(editable || deletable) && (
                    <TableCell className="table-cell-actions flex h-full flex-wrap items-center gap-2">
                      {editable && (
                        <Button
                          onClick={() => onEdit && onEdit(row, rowIndex)}
                          variant={"ghost"}
                          icon
                        >
                          <Edit />
                        </Button>
                      )}
                      {/* {deletable && (
                        <>
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setOpenDelete({
                                open: true,
                                item: row,
                                index: rowIndex,
                              });
                            }}
                            icon
                          >
                            <Trash />
                          </Button>
                        </>
                      )} */}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          {!hideFooter && (
            <TableFooter
              className="sticky bg-foreground/5"
              style={{ bottom: -1 }}
            >
              <TableRow>
                <TableCell className="table-footer-info"></TableCell>
                <TableCell colSpan={colCount} className="pagination text-right">
                  {pagination && (
                    <PaginationWarpper
                      className="flex justify-end"
                      {...pagination}
                      onPageChange={onPageChange}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
};

export default TableWrapper;
