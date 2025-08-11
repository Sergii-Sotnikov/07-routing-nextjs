
import {fetchNotes} from "@/lib/api"
import NotesClients from "./Notes.client";


type Props = {
  params: Promise<{slug: string[]}>;
}

export default async function Notes({params}:Props){
  const {slug} = await params

  const initialTag = slug[0] === 'All' ? '' : slug[0];

    const initialData = await fetchNotes({
    page: 1,
    search: "",
    tag: initialTag,
  });

  return (
    <>
    <NotesClients initialData={initialData} initialTag={initialTag}/>
    </>)   
}



