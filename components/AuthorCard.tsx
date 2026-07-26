import Image from 'next/image'
import Link from 'next/link'
import type { Author } from '@/lib/authors'

/**
 * End-of-post author block.
 *
 * Google's guidance asks whether bylines "lead to further information about the
 * author". A linked name at the top satisfies that narrowly; showing the
 * credentials and where else this person exists satisfies it in a way a reader
 * actually benefits from.
 */
export function AuthorCard({ author }: { author: Author }) {
  return (
    <aside className="mt-14 border-t border-border pt-8">
      <div className="flex items-start gap-5">
        <Image
          src={author.image}
          alt={author.name}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-full border border-border object-cover"
        />
        <div>
          <p className="text-sm text-muted-foreground">Written by</p>
          <p className="mt-0.5">
            <Link
              href={`/author/${author.slug}`}
              className="text-lg font-medium text-foreground underline-offset-4 hover:underline"
            >
              {author.name}
            </Link>
            <span className="text-muted-foreground">, {author.jobTitle}</span>
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">{author.bio}</p>
          {author.sameAs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {author.sameAs.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {new URL(url).hostname.replace(/^www\./, '')}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
