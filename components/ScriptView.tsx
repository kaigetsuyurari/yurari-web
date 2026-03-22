type Props = {
  script: string
}

export default function ScriptView({ script }: Props) {
  const paragraphs = script.split(/\n+/).filter(p => p.trim() !== "")

  return (
    <div className="space-y-4 text-sm leading-7 text-foreground">
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  )
}
