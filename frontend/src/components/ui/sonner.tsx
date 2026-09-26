import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-[#18181b] group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-foreground group-[.toaster]:border-slate-200 dark:group-[.toaster]:border-[#27272a] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:p-3.5 group-[.toaster]:gap-3 group-[.toaster]:border font-sans text-xs flex items-center",
          title: "text-xs font-bold text-slate-900 dark:text-foreground",
          description: "text-[11px] text-slate-500 dark:text-muted-foreground mt-0.5 font-normal",
          actionButton:
            "bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold rounded-md px-3 py-1 cursor-pointer transition-colors",
          cancelButton:
            "bg-slate-100 dark:bg-[#27272a] text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md px-3 py-1 cursor-pointer transition-colors",
          closeButton:
            "bg-transparent hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-400 dark:text-muted-foreground rounded-md p-1 transition-colors",
          success:
            "group-[.toaster]:bg-emerald-50/90 dark:group-[.toaster]:bg-[#121c15] group-[.toaster]:border-emerald-200 dark:group-[.toaster]:border-emerald-900/60 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-emerald-100",
          error:
            "group-[.toaster]:bg-rose-50/90 dark:group-[.toaster]:bg-[#1f1214] group-[.toaster]:border-rose-200 dark:group-[.toaster]:border-rose-900/60 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-rose-100",
          info:
            "group-[.toaster]:bg-blue-50/90 dark:group-[.toaster]:bg-[#1c1812] group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-900/60 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-blue-100",
          warning:
            "group-[.toaster]:bg-blue-50/90 dark:group-[.toaster]:bg-[#1c1812] group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-900/60 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-blue-100",
        },
      }}
      icons={{
        success: <CheckCircle2 className="size-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />,
        error: <AlertCircle className="size-4.5 text-rose-500 dark:text-rose-400 shrink-0" />,
        info: <Info className="size-4.5 text-blue-500 dark:text-blue-400 shrink-0" />,
        warning: <AlertTriangle className="size-4.5 text-blue-500 dark:text-blue-400 shrink-0" />,
        loading: <Loader2 className="size-4.5 text-blue-500 dark:text-blue-400 animate-spin shrink-0" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
