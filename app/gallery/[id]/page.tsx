import GalleryClient from './GalleryClient'

interface Props {
  params: {
    id: string;
  };
}

export default function GalleryPage({ params }: Props) {
  return <GalleryClient id={params.id} />
} 