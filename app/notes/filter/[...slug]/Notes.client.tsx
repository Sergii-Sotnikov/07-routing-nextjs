"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Note } from "@/types/note";
import css from "./NotePage.module.css";

interface Props {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
  initialPage: number;
  initialSearch: string;
  initialTag: string;
}

const NotesClients = ({initialData, initialPage, initialSearch, initialTag,}: Props) => {


  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialRef = useRef({
    page: initialPage,
    search: initialSearch,
    tag: initialTag,
  });

  useEffect(() => {
    setPage(1);
  }, [initialTag]);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, search, initialTag],
    queryFn: () =>
      fetchNotes(search.trim() === "" ? { page, tag: initialTag } : { page, search, tag:initialTag }),
    initialData:
      page === initialRef.current.page && search === initialRef.current.search && initialTag === initialRef.current.tag
        ? initialData
        : undefined,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!data) return;

    if (data.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [data, search]);

  const noteData = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={debouncedSearch} />
        {isSuccess && noteData.length > 0 && (
          <Pagination total={totalPages} onChange={setPage} page={page} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {noteData.length > 0 && <NoteList notes={noteData} />}
      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClients;
