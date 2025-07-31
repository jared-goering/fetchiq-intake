import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FetchIQ',
  description: 'Opportunity mapping and business intelligence platform',
  generator: 'FetchIQ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detect if running in iframe and add appropriate class
              if (window !== window.parent) {
                document.body.classList.add('iframe-embedded');
                // Send height updates to parent window for responsive iframe
                const sendHeightToParent = () => {
                  const height = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                  );
                  window.parent.postMessage({
                    type: 'iframe-height',
                    height: height
                  }, '*');
                };
                
                // Send initial height
                setTimeout(sendHeightToParent, 100);
                
                // Update height on window resize and DOM changes
                window.addEventListener('resize', sendHeightToParent);
                
                // Use MutationObserver to detect DOM changes
                if (typeof MutationObserver !== 'undefined') {
                  const observer = new MutationObserver(sendHeightToParent);
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                  });
                }
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
