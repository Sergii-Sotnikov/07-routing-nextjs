
import {fetchNotes} from "@/lib/api"
import NotesClients from "./Notes.client";


export default async function Notes(){

  const initialPage = 1;
  const initialSearch = '';

  const initialData = await fetchNotes({page: initialPage, search: initialSearch})
    console.log(initialData)

  return (
    <>
    <NotesClients initialData={initialData} initialPage={initialPage} initialSearch={initialSearch}/>
    </>)   
}



