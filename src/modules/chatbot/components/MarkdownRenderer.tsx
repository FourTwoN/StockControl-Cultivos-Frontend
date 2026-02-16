import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  readonly content: string
  readonly className?: string
}

function CopyButton({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-primary',
        'prose-headings:text-primary prose-headings:font-semibold',
        'prose-p:text-primary prose-p:leading-relaxed',
        'prose-a:text-secondary prose-a:underline prose-a:underline-offset-2',
        'prose-strong:text-primary prose-strong:font-semibold',
        'prose-ul:text-primary prose-ol:text-primary',
        'prose-li:text-primary prose-li:marker:text-muted',
        'prose-blockquote:border-l-secondary prose-blockquote:text-muted',
        'prose-table:text-primary',
        'prose-th:border-border prose-th:bg-surface-hover prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:font-semibold',
        'prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:text-sm',
        'prose-hr:border-border',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({ className: codeClassName, children, node: _node, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName ?? '')
            const codeString = String(children).replace(/\n$/, '')

            if (match) {
              return (
                <div className="group relative my-3">
                  <div className="flex items-center justify-between rounded-t-lg bg-[#282c34] px-4 py-1.5">
                    <span className="text-xs text-white/50">{match[1]}</span>
                  </div>
                  <CopyButton text={codeString} />
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: '0.5rem',
                      borderBottomRightRadius: '0.5rem',
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              )
            }

            return (
              <code
                className={cn(
                  'rounded bg-surface-hover px-1.5 py-0.5 text-sm font-mono',
                  codeClassName,
                )}
                {...props}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
