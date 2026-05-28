export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-emerald-200">
      <code>{children}</code>
    </pre>
  );
}