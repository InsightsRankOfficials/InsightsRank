import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  imageClassName?: string;
}

export function EmptyState({
  title,
  description,
  className = "",
  imageClassName = "w-52 max-w-full h-auto object-contain mx-auto",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center my-2 ${className}`}>
      <img
        src="/images/data_not_found.png"
        alt="Data Not Found"
        className={imageClassName}
      />
      {title && <h3 className="text-sm font-bold text-foreground mt-2">{title}</h3>}
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export function EmptyTableRow({
  colSpan,
  title,
  description,
}: {
  colSpan: number;
  title?: string;
  description?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-8 text-center">
        <EmptyState title={title} description={description} />
      </td>
    </tr>
  );
}
