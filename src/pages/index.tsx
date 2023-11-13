import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { Renderer } from './renderer';
import data from '@/data/patterns.json';
const inter = Inter({ subsets: ['latin'] });

const instructions: Array<string[] | string> = [
  'hex4',
  'hex3',
  [
    'addSymmetricPoint,2,3,8',
    'addSymmetricPoint,8,13,3',
    'addSymmetricPoint,3,4,13',
    'addSymmetricPoint,13,12,4',
    'addSymmetricPoint,4,5,12',
    'addSymmetricPoint,11,12,5',
    'addSymmetricPoint,5,6,11',
    'addSymmetricPoint,10,11,6',
    'addSymmetricPoint,1,6,10',
    'addSymmetricPoint,9,10,1',
    'addSymmetricPoint,1,2,9',
    'addSymmetricPoint,8,9,2',
  ],
  'circle,0,14',
  [
    'addLineIntersect,14,19,2,3',
    'addLineIntersect,14,21,2,3',
    'addLineIntersect,15,20,8,13',
    'addLineIntersect,15,22,8,13',
    'addLineIntersect,16,21,3,4',
    'addLineIntersect,16,23,3,4',
    'addLineIntersect,17,22,12,13',
    'addLineIntersect,17,24,12,13',
    'addLineIntersect,18,23,4,5',
    'addLineIntersect,18,25,4,5',
    'addLineIntersect,19,14,11,12',
    'addLineIntersect,19,24,11,12',
    'addLineIntersect,20,15,5,6',
    'addLineIntersect,20,25,5,6',
    'addLineIntersect,21,14,10,11',
    'addLineIntersect,21,16,10,11',
    'addLineIntersect,22,15,1,6',
    'addLineIntersect,22,17,1,6',
    'addLineIntersect,23,16,9,10',
    'addLineIntersect,23,18,9,10',
    'addLineIntersect,24,17,1,2',
    'addLineIntersect,24,19,1,2',
    'addLineIntersect,25,18,8,9',
    'addLineIntersect,25,20,8,9',
  ],

  [
    'addLineIntersect,2,3,8,9',
    'addLineIntersect,2,3,8,13',
    'addLineIntersect,3,4,8,13',
    'addLineIntersect,3,4,12,13',
    'addLineIntersect,4,5,11,12',
    'addLineIntersect,4,5,12,13',
    'addLineIntersect,5,6,10,11',
    'addLineIntersect,5,6,11,12',
    'addLineIntersect,1,6,9,10',
    'addLineIntersect,1,6,10,11',
    'addLineIntersect,1,2,8,9',
    'addLineIntersect,1,2,9,10',
  ],

  [
    'segment,26,36',
    'segment,27,40',
    'segment,28,38',
    'segment,29,42',
    'segment,30,41',
    'segment,31,44',
    'segment,32,43',
    'segment,33,46',
    'segment,34,45',
    'segment,35,48',
    'segment,37,47',
    'segment,39,49',
  ],

  [
    'addLineIntersect,14,19,15,22',
    'addLineIntersect,14,19,18,23',
    'addLineIntersect,14,21,18,25',
    'addLineIntersect,14,21,22,32',
    'addLineIntersect,15,20,16,23',
    'addLineIntersect,15,20,19,24',
    'addLineIntersect,15,22,18,23',
    'addLineIntersect,16,23,19,24',
    'addLineIntersect,17,24,20,25',
    'addLineIntersect,18,25,22,32',
    'addLineIntersect,20,25,21,30',
    'addLineIntersect,21,30,24,33',
  ],

  [
    'addLineIntersect,14,19,16,23',
    'addLineIntersect,14,19,17,22',
    'addLineIntersect,14,21,17,24',
    'addLineIntersect,14,21,18,23',
    'addLineIntersect,15,20,17,24',
    'addLineIntersect,15,20,18,23',
    'addLineIntersect,15,22,18,25',
    'addLineIntersect,15,22,19,24',
    'addLineIntersect,16,21,18,25',
    'addLineIntersect,16,21,19,24',
    'addLineIntersect,16,23,20,25',
    'addLineIntersect,17,22,20,25',
  ],

  'hex2',

  [
    'addLineIntersect,8,9,87,92',
    'addLineIntersect,8,9,88,89',
    'addLineIntersect,8,13,87,88',
    'addLineIntersect,8,13,91,92',
    'addLineIntersect,9,10,87,88',
    'addLineIntersect,9,10,89,90',
    'addLineIntersect,10,11,88,89',
    'addLineIntersect,10,11,90,91',
    'addLineIntersect,11,12,89,90',
    'addLineIntersect,11,12,91,92',
    'addLineIntersect,12,13,87,92',
    'addLineIntersect,12,13,90,91',
  ],

  [
    'shapeColor,87,95,8,93,brown',
    'shapeColor,103,92,96,13,brown',
    'shapeColor,12,102,91,104,brown',
    'shapeColor,11,101,90,100,brown',
    'shapeColor,10,98,89,99,brown',
    'shapeColor,9,94,88,97,brown',
  ],

  [
    'shapeColor,95,8,50,2,60,9,97,gray',
    'shapeColor,9,94,99,10,58,1,61,gray',
    'shapeColor,10,98,101,11,56,6,59,gray',
    'shapeColor,11,100,104,12,54,5,57,gray',
    'shapeColor,12,102,96,13,53,4,55,gray',
    'shapeColor,8,93,103,13,52,3,51,gray',
  ],

  [
    'shapeColor,27,14,62,15,28,51,green',
    'shapeColor,29,15,66,16,30,52,green',
    'shapeColor,31,16,73,17,32,53,green',
    'shapeColor,33,17,71,18,34,55,green',
    'shapeColor,35,18,63,19,37,54,green',
    'shapeColor,36,19,67,20,39,57,green',
    'shapeColor,20,38,56,40,21,72,green',
    'shapeColor,41,21,65,22,42,59,green',
    'shapeColor,43,22,68,23,44,58,green',
    'shapeColor,45,23,69,24,46,61,green',
    'shapeColor,47,24,70,25,48,60,green',
    'shapeColor,49,25,64,14,26,50,green',
  ],
  'shapeColor,64,80,62,74,66,78,73,82,71,75,63,79,67,83,72,85,65,77,68,81,69,84,70,76,red',

  [
    'shapeColor,14,64,80,62,orange',
    'shapeColor,15,62,74,66,orange',
    'shapeColor,16,66,78,73,orange',
    'shapeColor,17,73,82,71,orange',
    'shapeColor,18,71,75,63,orange',
    'shapeColor,19,63,79,67,orange',
    'shapeColor,20,67,83,72,orange',
    'shapeColor,21,72,85,65,orange',
    'shapeColor,22,65,77,68,orange',
    'shapeColor,23,68,81,69,orange',
    'shapeColor,24,69,84,70,orange',
    'shapeColor,25,70,76,64,orange',
  ],

  [
    'shapeColor,8,50,26,14,27,51,blue',
    'shapeColor,3,51,28,15,29,52,blue',
    'shapeColor,13,52,30,16,31,53,blue',
    'shapeColor,53,32,17,33,55,4,blue',
    'shapeColor,55,12,54,35,18,34,blue',
    'shapeColor,54,5,57,36,19,37,blue',
    'shapeColor,57,11,56,38,20,39,blue',
    'shapeColor,56,6,59,41,21,40,blue',
    'shapeColor,59,10,58,43,22,42,blue',
    'shapeColor,58,1,61,45,23,44,blue',
    'shapeColor,61,9,60,47,24,46,blue',
    'shapeColor,60,2,50,49,25,48,blue',
  ],
];

const figure = 'mustansiriya';

export default function Home() {
  return (
    <>
      <Head>
        <title>Patterns</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Renderer
          width={500}
          height={500}
          symmetry={data[figure].symmetry}
          instructions={data[figure].instructions}
        />
      </main>
    </>
  );
}
