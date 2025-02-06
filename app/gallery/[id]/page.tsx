import GalleryClient from './GalleryClient'
import { Metadata } from 'next'

type PageProps = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Gallery page',
}

export default function GalleryPage(props: PageProps) {
  return <GalleryClient id={props.params.id} />
} 