import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-primary-950 custom-scrollbar">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}