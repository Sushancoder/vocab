"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OtherPageLink({ name, info, link }) {
    return (
        <Link
            href={link}
            className="group block w-full p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <h3 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {info}
                    </p>
                </div>

                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
                </div>
            </div>

            <div className="mt-2 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center text-xs font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600/70 dark:group-hover:text-blue-400/70 transition-colors">
                <span className="truncate max-w-[200px]">{(process.env.NEXT_PUBLIC_WEBSITE_URL) || ""}{link}</span>
            </div>
        </Link>
    );
}