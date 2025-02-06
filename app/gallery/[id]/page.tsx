import GalleryClient from './GalleryClient'
import { Metadata } from 'next'

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Gallery', 
  description: 'Gallery page',
}

export default async function GalleryPage(props: Props) {
  // 필요한 경우 여기서 데이터를 가져올 수 있습니다
  // const data = await fetchSomeData(props.params.id);
  
  return <GalleryClient id={props.params.id} />
} 