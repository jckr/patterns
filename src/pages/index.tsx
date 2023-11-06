import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { PatternRenderer } from './pattern-renderer'

const inter = Inter({ subsets: ['latin'] })

const instructions: string[] = [
 'hex1',
 'hex2',
  // 'point,100,100',
  // 'point,200,100',
  // 'point,200,200',
  // 'point,100,200',
  // 'line,0,1,2,3',
  // 'shape,0,1,2,3'
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Patterns</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <PatternRenderer width={500} height={500} instructions={instructions}/>
      </main>
    </>
  )
}
