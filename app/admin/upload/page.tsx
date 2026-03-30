import Link from "next/link"
import CsvUploadForm from "@/components/admin/CsvUploadForm"

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>
      <CsvUploadForm />
    </div>
  )
}
