import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What happens to files you open in pdf-tool: nothing leaves your browser. No analytics, no cookies, no accounts. The full detail, plainly.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = '27 July 2026'

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Privacy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {UPDATED}</p>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        Short version: your files are never uploaded, there is no analytics, there are no cookies,
        and there is no account system. Below is the same thing said carefully, including the parts
        that are not absolute.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Your files</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Every tool on {SITE_NAME} processes files in your browser, on your own device. The file is
        read into memory by JavaScript, the work is done there, and the result is handed back to
        you as a download. No copy is transmitted to a server, so there is no copy for anyone to
        store, read, retain, or hand over.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Nothing is written to disk beyond the file you choose to download, and nothing persists
        between page loads. Close the tab and the working copy in memory is gone.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You can check this rather than believe it. Open your browser devtools, switch to the
        network tab, and run any tool. You will see the page and its scripts load, and no request
        carrying your file. Disconnecting from the internet after the page loads also works: the
        tools keep running.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Analytics and tracking
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        There are none. No analytics product, no tracking pixels, no advertising tags, no session
        recording, no third party scripts of any kind. Fonts are served from this site rather than
        fetched from a font provider, so loading a page does not tell anyone else that you were
        here.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Cookies</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Browsing {SITE_NAME} sets no cookies. The only cookie the site is capable of setting
        belongs to a password protected admin area used to review draft articles, which is not
        reachable from the public site and is not set for visitors.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        What the host can see
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        This is the part most privacy pages skip. The site is hosted on Vercel, and like any web
        host it processes standard request data in order to serve pages: your IP address, the page
        you asked for, your browser and operating system, and the time. That is a property of how
        the web works, not something added on top, and it applies to the page request only. It
        never includes your file, because your file is never part of a request.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        No accounts, no personal data
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        There is nothing to sign up for. No email address is collected, no profile is built, and no
        personal data is stored, sold, or shared, because none is gathered. If you contact us
        through the{' '}
        <Link href="/contact" className="text-foreground underline underline-offset-4">
          contact page
        </Link>
        , that message is obviously visible to us, and to the platform you sent it through.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Children</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The tools collect no data from anyone, of any age.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
        Changes to this page
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If the way files are handled ever changes, this page changes first and the date at the top
        moves with it. A tool that uploads your file would be labelled as such on the tool page
        itself, not buried here.
      </p>
    </main>
  )
}
